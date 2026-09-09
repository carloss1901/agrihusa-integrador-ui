import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  EMPTY,
  finalize,
  forkJoin,
  switchMap
} from 'rxjs';

import {
  AccionPermiso,
  ModuloSistema
} from '../../../../core/models/permiso.model';
import { AuthService } from '../../../../core/services/auth.service';
import { AgrihusaButtonComponent } from '../../../../shared/components/agrihusa-button/agrihusa-button.component';
import {
  IChangePaginate
} from '../../../../shared/components/agrihusa-table-footer/agrihusa-table-footer.component';
import { AgrihusaTopBarComponent } from '../../../../shared/components/agrihusa-topbar/agrihusa-topbar.component';
import {
  AccionBitacora,
  RegistroBitacoraCrearData,
  ResultadoBitacora
} from '../../../auditoria/models/bitacora.model';
import { BitacoraService } from '../../../auditoria/services/bitacora.service';
import { FiltroMantDestinosComponent } from '../../components/filtro-mant-destinos/filtro-mant-destinos.component';
import { ModalUpsertDestinoComponent } from '../../components/modal-upsert-destino/modal-upsert-destino.component';
import { TablaMantDestinosComponent } from '../../components/tabla-mant-destinos/tabla-mant-destinos.component';
import {
  Destino,
  DestinoFilter,
  DestinoFormData,
  DestinoQuery
} from '../../models/destino.model';
import { DestinoService } from '../../services/destino.service';

@Component({
  selector: 'app-mantenimiento-destinos',
  standalone: true,
  imports: [
    CommonModule,
    AgrihusaTopBarComponent,
    AgrihusaButtonComponent,
    FiltroMantDestinosComponent,
    TablaMantDestinosComponent
  ],
  templateUrl:
    './mantenimiento-destinos.component.html'
})
export class MantenimientoDestinosComponent
  implements OnInit {
  readonly titulo = 'Mantenimiento de Destinos';

  destinos: Destino[] = [];
  filaSeleccionada: Destino | null = null;
  loading = false;
  totalItems = 0;
  page = 1;
  pageSize = 10;

  puedeCrear = false;
  puedeEditar = false;
  puedeCambiarEstado = false;

  private filtro: DestinoFilter = {};

  constructor(
    private destinoService: DestinoService,
    private authService: AuthService,
    private bitacoraService: BitacoraService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.cargarPermisos();
    this.cargarDestinos();
  }

  onBuscar(filtro: DestinoFilter): void {
    this.filtro = { ...filtro };
    this.page = 1;
    this.cargarDestinos();
  }

  onLimpiarFiltro(): void {
    this.filtro = {};
    this.page = 1;
    this.cargarDestinos();
  }

  onSeleccionarDestino(
    destino: Destino
  ): void {
    this.filaSeleccionada =
      this.filaSeleccionada?.id === destino.id
        ? null
        : destino;
  }

  onChangePaginate(
    event: IChangePaginate
  ): void {
    this.page = event.page;
    this.pageSize = event.pageSize;
    this.cargarDestinos();
  }

  mostrarModalCrear(): void {
    if (!this.puedeCrear) {
      return;
    }

    this.abrirModal(null);
  }

  mostrarModalEditar(): void {
    if (
      !this.puedeEditar ||
      !this.filaSeleccionada ||
      !this.filaSeleccionada.activo
    ) {
      return;
    }

    this.abrirModal(this.filaSeleccionada);
  }

  cambiarEstado(): void {
    const destino = this.filaSeleccionada;

    if (
      !this.puedeCambiarEstado ||
      !destino
    ) {
      return;
    }

    const accion = destino.activo
      ? 'desactivar'
      : 'activar';

    const confirmado = window.confirm(
      `¿Deseas ${accion} el destino ` +
      `"${destino.ciudad} - ${destino.pais}"?`
    );

    if (!confirmado) {
      return;
    }

    this.destinoService
      .cambiarEstado(destino.id)
      .subscribe((resultado) => {
        if (!resultado) {
          return;
        }

        const accionBitacora = resultado.activo
          ? AccionBitacora.ACTIVAR
          : AccionBitacora.DESACTIVAR;

        this.registrarEventoDestino(
          accionBitacora,
          resultado,
          resultado.activo
            ? `Se activó el destino ${resultado.ciudad} - ${resultado.pais}.`
            : `Se desactivó el destino ${resultado.ciudad} - ${resultado.pais}.`
        );

        this.cargarDestinos();
      });
  }

  private cargarDestinos(): void {
    const query: DestinoQuery = {
      ...this.filtro,
      page: this.page,
      pageSize: this.pageSize
    };

    this.loading = true;
    this.filaSeleccionada = null;

    this.destinoService
      .listar(query)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe((resultado) => {
        this.destinos = resultado.items;
        this.totalItems = resultado.totalItems;
      });
  }

  private abrirModal(
    destino: Destino | null
  ): void {
    const modalRef = this.modalService.open(
      ModalUpsertDestinoComponent,
      {
        backdrop: 'static',
        keyboard: false,
        size: 'lg',
        centered: true
      }
    );

    modalRef.componentInstance.titleModal = destino
      ? 'EDITAR DESTINO'
      : 'REGISTRAR DESTINO';

    modalRef.componentInstance.data = destino;

    modalRef.result
      .then((resultado: DestinoFormData) => {
        if (resultado) {
          this.guardarDestino(
            resultado,
            destino
          );
        }
      })
      .catch(() => {});
  }

  private guardarDestino(
    data: DestinoFormData,
    destino: Destino | null
  ): void {
    this.destinoService
      .existeUbicacion(
        data.pais,
        data.ciudad,
        destino?.id
      )
      .pipe(
        switchMap((existeUbicacion) => {
          if (existeUbicacion) {
            window.alert(
              'Ya existe ese destino para el país y ciudad indicados.'
            );

            return EMPTY;
          }

          if (!destino) {
            return this.destinoService.crear(data);
          }

          return this.destinoService.actualizar(
            destino.id,
            data
          );
        })
      )
      .subscribe((destinoGuardado) => {
        if (!destinoGuardado) {
          return;
        }

        if (!destino) {
          this.registrarEventoDestino(
            AccionBitacora.CREAR,
            destinoGuardado,
            `Se creó el destino ` +
              `${destinoGuardado.ciudad} - ` +
              `${destinoGuardado.pais}.`
          );
        } else {
          this.registrarEventoDestino(
            AccionBitacora.EDITAR,
            destinoGuardado,
            `Se actualizó el destino ` +
              `${destinoGuardado.ciudad} - ` +
              `${destinoGuardado.pais}.`
          );
        }

        this.page = 1;
        this.cargarDestinos();
      });
  }

  private cargarPermisos(): void {
    forkJoin({
      crear: this.authService.tienePermiso(
        ModuloSistema.DESTINOS,
        AccionPermiso.CREAR
      ),
      editar: this.authService.tienePermiso(
        ModuloSistema.DESTINOS,
        AccionPermiso.EDITAR
      ),
      cambiarEstado:
        this.authService.tienePermiso(
          ModuloSistema.DESTINOS,
          AccionPermiso.ELIMINAR
        )
    }).subscribe((permisos) => {
      this.puedeCrear = permisos.crear;
      this.puedeEditar = permisos.editar;
      this.puedeCambiarEstado =
        permisos.cambiarEstado;
    });
  }

  private registrarEventoDestino(
    accion: AccionBitacora,
    destino: Destino,
    detalle: string
  ): void {
    const sesion =
      this.authService.obtenerSesionActual();

    if (!sesion) {
      return;
    }

    const evento: RegistroBitacoraCrearData = {
      usuarioId: sesion.usuarioId,
      nombreUsuario: sesion.nombreUsuario,
      modulo: ModuloSistema.DESTINOS,
      accion,
      entidad: 'Destino',
      registroId: destino.id,
      detalle,
      resultado: ResultadoBitacora.EXITO
    };

    this.bitacoraService
      .registrar(evento)
      .subscribe();
  }
}