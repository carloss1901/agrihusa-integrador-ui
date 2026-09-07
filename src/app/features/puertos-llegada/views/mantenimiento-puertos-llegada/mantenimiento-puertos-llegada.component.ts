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
import { FiltroMantPuertosLlegadaComponent } from '../../components/filtro-mant-puertos-llegada/filtro-mant-puertos-llegada.component';
import { ModalUpsertPuertoLlegadaComponent } from '../../components/modal-upsert-puerto-llegada/modal-upsert-puerto-llegada.component';
import { TablaMantPuertosLlegadaComponent } from '../../components/tabla-mant-puertos-llegada/tabla-mant-puertos-llegada.component';
import {
  PuertoLlegada,
  PuertoLlegadaFilter,
  PuertoLlegadaFormData,
  PuertoLlegadaQuery
} from '../../models/puerto-llegada.model';
import { PuertoLlegadaService } from '../../services/puerto-llegada.service';

@Component({
  selector: 'app-mantenimiento-puertos-llegada',
  standalone: true,
  imports: [
    CommonModule,
    AgrihusaTopBarComponent,
    AgrihusaButtonComponent,
    FiltroMantPuertosLlegadaComponent,
    TablaMantPuertosLlegadaComponent
  ],
  templateUrl:
    './mantenimiento-puertos-llegada.component.html'
})
export class MantenimientoPuertosLlegadaComponent
  implements OnInit {
  readonly titulo =
    'Mantenimiento de Puertos de Llegada';

  puertos: PuertoLlegada[] = [];
  filaSeleccionada: PuertoLlegada | null = null;
  loading = false;
  totalItems = 0;
  page = 1;
  pageSize = 10;

  puedeCrear = false;
  puedeEditar = false;
  puedeCambiarEstado = false;

  private filtro: PuertoLlegadaFilter = {};

  constructor(
    private puertoService: PuertoLlegadaService,
    private authService: AuthService,
    private bitacoraService: BitacoraService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.cargarPermisos();
    this.cargarPuertos();
  }

  onBuscar(
    filtro: PuertoLlegadaFilter
  ): void {
    this.filtro = { ...filtro };
    this.page = 1;
    this.cargarPuertos();
  }

  onLimpiarFiltro(): void {
    this.filtro = {};
    this.page = 1;
    this.cargarPuertos();
  }

  onSeleccionarPuerto(
    puerto: PuertoLlegada
  ): void {
    this.filaSeleccionada =
      this.filaSeleccionada?.id === puerto.id
        ? null
        : puerto;
  }

  onChangePaginate(
    event: IChangePaginate
  ): void {
    this.page = event.page;
    this.pageSize = event.pageSize;
    this.cargarPuertos();
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
    const puerto = this.filaSeleccionada;

    if (
      !this.puedeCambiarEstado ||
      !puerto
    ) {
      return;
    }

    const accion = puerto.activo
      ? 'desactivar'
      : 'activar';

    const confirmado = window.confirm(
      `¿Deseas ${accion} el puerto ` +
      `"${puerto.puerto} - ${puerto.pais}"?`
    );

    if (!confirmado) {
      return;
    }

    this.puertoService
      .cambiarEstado(puerto.id)
      .subscribe((resultado) => {
        if (!resultado) {
          return;
        }

        const accionBitacora = resultado.activo
          ? AccionBitacora.ACTIVAR
          : AccionBitacora.DESACTIVAR;

        this.registrarEventoPuerto(
          accionBitacora,
          resultado,
          resultado.activo
            ? `Se activó el puerto ${resultado.puerto} - ${resultado.pais}.`
            : `Se desactivó el puerto ${resultado.puerto} - ${resultado.pais}.`
        );

        this.cargarPuertos();
      });
  }

  private cargarPuertos(): void {
    const query: PuertoLlegadaQuery = {
      ...this.filtro,
      page: this.page,
      pageSize: this.pageSize
    };

    this.loading = true;
    this.filaSeleccionada = null;

    this.puertoService
      .listar(query)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe((resultado) => {
        this.puertos = resultado.items;
        this.totalItems = resultado.totalItems;
      });
  }

  private abrirModal(
    puerto: PuertoLlegada | null
  ): void {
    const modalRef = this.modalService.open(
      ModalUpsertPuertoLlegadaComponent,
      {
        backdrop: 'static',
        keyboard: false,
        size: 'lg',
        centered: true
      }
    );

    modalRef.componentInstance.titleModal = puerto
      ? 'EDITAR PUERTO DE LLEGADA'
      : 'REGISTRAR PUERTO DE LLEGADA';

    modalRef.componentInstance.data = puerto;

    modalRef.result
      .then(
        (resultado: PuertoLlegadaFormData) => {
          if (resultado) {
            this.guardarPuerto(
              resultado,
              puerto
            );
          }
        }
      )
      .catch(() => {});
  }

  private guardarPuerto(
    data: PuertoLlegadaFormData,
    puerto: PuertoLlegada | null
  ): void {
    forkJoin({
      existeCodigo:
        this.puertoService.existeCodigo(
          data.codigo,
          puerto?.id
        ),
      existePuerto:
        this.puertoService.existePuerto(
          data.pais,
          data.puerto,
          puerto?.id
        )
    })
      .pipe(
        switchMap(
          ({ existeCodigo, existePuerto }) => {
            if (existeCodigo) {
              window.alert(
                'Ya existe un puerto con ese código.'
              );

              return EMPTY;
            }

            if (existePuerto) {
              window.alert(
                'Ya existe ese puerto para el país indicado.'
              );

              return EMPTY;
            }

            if (!puerto) {
              return this.puertoService.crear(data);
            }

            return this.puertoService.actualizar(
              puerto.id,
              data
            );
          }
        )
      )
      .subscribe((puertoGuardado) => {
        if (!puertoGuardado) {
          return;
        }

        if (!puerto) {
          this.registrarEventoPuerto(
            AccionBitacora.CREAR,
            puertoGuardado,
            `Se creó el puerto ` +
              `${puertoGuardado.puerto} - ` +
              `${puertoGuardado.pais}.`
          );
        } else {
          this.registrarEventoPuerto(
            AccionBitacora.EDITAR,
            puertoGuardado,
            `Se actualizó el puerto ` +
              `${puertoGuardado.puerto} - ` +
              `${puertoGuardado.pais}.`
          );
        }

        this.page = 1;
        this.cargarPuertos();
      });
  }

  private cargarPermisos(): void {
    forkJoin({
      crear: this.authService.tienePermiso(
        ModuloSistema.PUERTOS_LLEGADA,
        AccionPermiso.CREAR
      ),
      editar: this.authService.tienePermiso(
        ModuloSistema.PUERTOS_LLEGADA,
        AccionPermiso.EDITAR
      ),
      cambiarEstado:
        this.authService.tienePermiso(
          ModuloSistema.PUERTOS_LLEGADA,
          AccionPermiso.ELIMINAR
        )
    }).subscribe((permisos) => {
      this.puedeCrear = permisos.crear;
      this.puedeEditar = permisos.editar;
      this.puedeCambiarEstado =
        permisos.cambiarEstado;
    });
  }

  private registrarEventoPuerto(
    accion: AccionBitacora,
    puerto: PuertoLlegada,
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
      modulo: ModuloSistema.PUERTOS_LLEGADA,
      accion,
      entidad: 'Puerto de llegada',
      registroId: puerto.id,
      detalle,
      resultado: ResultadoBitacora.EXITO
    };

    this.bitacoraService
      .registrar(evento)
      .subscribe();
  }
}