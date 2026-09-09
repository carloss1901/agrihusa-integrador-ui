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
import { FiltroMantViasComponent } from '../../components/filtro-mant-vias/filtro-mant-vias.component';
import { ModalUpsertViaComponent } from '../../components/modal-upsert-via/modal-upsert-via.component';
import { TablaMantViasComponent } from '../../components/tabla-mant-vias/tabla-mant-vias.component';
import {
  Via,
  ViaFilter,
  ViaFormData,
  ViaQuery
} from '../../models/via.model';
import { ViaService } from '../../services/via.service';

@Component({
  selector: 'app-mantenimiento-vias',
  standalone: true,
  imports: [
    CommonModule,
    AgrihusaTopBarComponent,
    AgrihusaButtonComponent,
    FiltroMantViasComponent,
    TablaMantViasComponent
  ],
  templateUrl:
    './mantenimiento-vias.component.html'
})
export class MantenimientoViasComponent
  implements OnInit {
  readonly titulo = 'Mantenimiento de Vías';

  vias: Via[] = [];
  filaSeleccionada: Via | null = null;
  loading = false;
  totalItems = 0;
  page = 1;
  pageSize = 10;

  puedeCrear = false;
  puedeEditar = false;
  puedeCambiarEstado = false;

  private filtro: ViaFilter = {};

  constructor(
    private viaService: ViaService,
    private authService: AuthService,
    private bitacoraService: BitacoraService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.cargarPermisos();
    this.cargarVias();
  }

  onBuscar(
    filtro: ViaFilter
  ): void {
    this.filtro = { ...filtro };
    this.page = 1;
    this.cargarVias();
  }

  onLimpiarFiltro(): void {
    this.filtro = {};
    this.page = 1;
    this.cargarVias();
  }

  onSeleccionarVia(
    via: Via
  ): void {
    this.filaSeleccionada =
      this.filaSeleccionada?.id === via.id
        ? null
        : via;
  }

  onChangePaginate(
    event: IChangePaginate
  ): void {
    this.page = event.page;
    this.pageSize = event.pageSize;
    this.cargarVias();
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
    const via = this.filaSeleccionada;

    if (
      !this.puedeCambiarEstado ||
      !via
    ) {
      return;
    }

    const accion = via.activo
      ? 'desactivar'
      : 'activar';

    const confirmado = window.confirm(
      `¿Deseas ${accion} la vía ` +
      `"${via.descripcion}"?`
    );

    if (!confirmado) {
      return;
    }

    this.viaService
      .cambiarEstado(via.id)
      .subscribe((resultado) => {
        if (!resultado) {
          return;
        }

        const accionBitacora = resultado.activo
          ? AccionBitacora.ACTIVAR
          : AccionBitacora.DESACTIVAR;

        this.registrarEventoVia(
          accionBitacora,
          resultado,
          resultado.activo
            ? `Se activó la vía ${resultado.descripcion}.`
            : `Se desactivó la vía ${resultado.descripcion}.`
        );

        this.cargarVias();
      });
  }

  private cargarVias(): void {
    const query: ViaQuery = {
      ...this.filtro,
      page: this.page,
      pageSize: this.pageSize
    };

    this.loading = true;
    this.filaSeleccionada = null;

    this.viaService
      .listar(query)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe((resultado) => {
        this.vias = resultado.items;
        this.totalItems = resultado.totalItems;
      });
  }

  private abrirModal(
    via: Via | null
  ): void {
    const modalRef = this.modalService.open(
      ModalUpsertViaComponent,
      {
        backdrop: 'static',
        keyboard: false,
        size: 'lg',
        centered: true
      }
    );

    modalRef.componentInstance.titleModal = via
      ? 'EDITAR VÍA'
      : 'REGISTRAR VÍA';

    modalRef.componentInstance.data = via;

    modalRef.result
      .then(
        (resultado: ViaFormData) => {
          if (resultado) {
            this.guardarVia(
              resultado,
              via
            );
          }
        }
      )
      .catch(() => {});
  }

  private guardarVia(
    data: ViaFormData,
    via: Via | null
  ): void {
    this.viaService
      .existeDescripcion(
        data.descripcion,
        via?.id
      )
      .pipe(
        switchMap((existeDescripcion) => {
          if (existeDescripcion) {
            window.alert(
              'Ya existe una vía con esa descripción.'
            );

            return EMPTY;
          }

          if (!via) {
            return this.viaService.crear(data);
          }

          return this.viaService.actualizar(
            via.id,
            data
          );
        })
      )
      .subscribe((viaGuardada) => {
        if (!viaGuardada) {
          return;
        }

        if (!via) {
          this.registrarEventoVia(
            AccionBitacora.CREAR,
            viaGuardada,
            `Se creó la vía ` +
              `${viaGuardada.descripcion}.`
          );
        } else {
          this.registrarEventoVia(
            AccionBitacora.EDITAR,
            viaGuardada,
            `Se actualizó la vía ` +
              `${viaGuardada.descripcion}.`
          );
        }

        this.page = 1;
        this.cargarVias();
      });
  }

  private cargarPermisos(): void {
    forkJoin({
      crear: this.authService.tienePermiso(
        ModuloSistema.VIAS,
        AccionPermiso.CREAR
      ),
      editar: this.authService.tienePermiso(
        ModuloSistema.VIAS,
        AccionPermiso.EDITAR
      ),
      cambiarEstado:
        this.authService.tienePermiso(
          ModuloSistema.VIAS,
          AccionPermiso.ELIMINAR
        )
    }).subscribe((permisos) => {
      this.puedeCrear = permisos.crear;
      this.puedeEditar = permisos.editar;
      this.puedeCambiarEstado =
        permisos.cambiarEstado;
    });
  }

  private registrarEventoVia(
    accion: AccionBitacora,
    via: Via,
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
      modulo: ModuloSistema.VIAS,
      accion,
      entidad: 'Vía',
      registroId: via.id,
      detalle,
      resultado: ResultadoBitacora.EXITO
    };

    this.bitacoraService
      .registrar(evento)
      .subscribe();
  }
}