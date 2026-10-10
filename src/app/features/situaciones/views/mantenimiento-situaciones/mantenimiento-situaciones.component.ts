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
import { ModalConfirmacionComponent } from '../../../../shared/components/modal-confirmacion/modal-confirmacion.component';
import {
  IChangePaginate
} from '../../../../shared/components/agrihusa-table-footer/agrihusa-table-footer.component';
import { AgrihusaTopBarComponent } from '../../../../shared/components/agrihusa-topbar/agrihusa-topbar.component';
import {
  AccionBitacora,
  RegistroBitacoraCrearData,
  ResultadoBitacora
} from '../../../../core/models/bitacora.model';
import { BitacoraService } from '../../../../core/services/bitacora.service';
import { FiltroSituacionesComponent } from '../../components/filtro-situaciones/filtro-situaciones.component';
import { ModalSituacionComponent } from '../../components/modal-situacion/modal-situacion.component';
import { TablaSituacionesComponent } from '../../components/tabla-situaciones/tabla-situaciones.component';
import {
  Situacion,
  SituacionFilter,
  SituacionFormData,
  SituacionQuery
} from '../../../../core/models/situacion.model';
import { SituacionService } from '../../../../core/services/situacion.service';

@Component({
  selector: 'app-mantenimiento-situaciones',
  standalone: true,
  imports: [
    CommonModule,
    AgrihusaTopBarComponent,
    AgrihusaButtonComponent,
    FiltroSituacionesComponent,
    TablaSituacionesComponent
  ],
  templateUrl:
    './mantenimiento-situaciones.component.html'
})
export class MantenimientoSituacionesComponent
  implements OnInit {
  readonly titulo =
    'Mantenimiento de Situaciones';

  situaciones: Situacion[] = [];
  filaSeleccionada: Situacion | null = null;
  loading = false;
  totalItems = 0;
  page = 1;
  pageSize = 10;

  puedeCrear = false;
  puedeEditar = false;
  puedeCambiarEstado = false;

  private filtro: SituacionFilter = {};

  constructor(
    private situacionService: SituacionService,
    private authService: AuthService,
    private bitacoraService: BitacoraService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.cargarPermisos();
    this.cargarSituaciones();
  }

  onBuscar(
    filtro: SituacionFilter
  ): void {
    this.filtro = { ...filtro };
    this.page = 1;
    this.cargarSituaciones();
  }

  onLimpiarFiltro(): void {
    this.filtro = {};
    this.page = 1;
    this.cargarSituaciones();
  }

  onSeleccionarSituacion(
    situacion: Situacion
  ): void {
    this.filaSeleccionada =
      this.filaSeleccionada?.id === situacion.id
        ? null
        : situacion;
  }

  onChangePaginate(
    event: IChangePaginate
  ): void {
    this.page = event.page;
    this.pageSize = event.pageSize;
    this.cargarSituaciones();
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
    const situacion = this.filaSeleccionada;

    if (
      !this.puedeCambiarEstado ||
      !situacion
    ) {
      return;
    }

    const accion = situacion.activo
      ? 'desactivar'
      : 'activar';

    const modalRef = this.modalService.open(ModalConfirmacionComponent, {
      backdrop: 'static',
      keyboard: false,
      centered: true
    });

    modalRef.componentInstance.titulo = situacion.activo
      ? 'Confirmar desactivación'
      : 'Confirmar activación';
    modalRef.componentInstance.mensaje =
      `¿Deseas ${accion} la situación ` +
      `"${situacion.descripcion}"?`;

    modalRef.result
      .then((confirmado: boolean) => {
        if (!confirmado) {
          return;
        }

        this.situacionService
          .cambiarEstado(situacion)
          .subscribe((resultado) => {
            if (!resultado) {
              return;
            }

            const accionBitacora = resultado.activo
              ? AccionBitacora.ACTIVAR
              : AccionBitacora.DESACTIVAR;

            this.registrarEventoSituacion(
              accionBitacora,
              resultado,
              resultado.activo
                ? `Se activó la situación ${resultado.descripcion}.`
                : `Se desactivó la situación ${resultado.descripcion}.`
            );

            this.cargarSituaciones();
          });
      })
      .catch(() => {});
  }

  private cargarSituaciones(): void {
    const query: SituacionQuery = {
      ...this.filtro,
      page: this.page,
      pageSize: this.pageSize
    };

    this.loading = true;
    this.filaSeleccionada = null;

    this.situacionService
      .listar(query)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe((resultado) => {
        this.situaciones = resultado.items;
        this.totalItems = resultado.totalItems;
      });
  }

  private abrirModal(
    situacion: Situacion | null
  ): void {
    const modalRef = this.modalService.open(
      ModalSituacionComponent,
      {
        backdrop: 'static',
        keyboard: false,
        size: 'lg',
        centered: true
      }
    );

    modalRef.componentInstance.titleModal = situacion
      ? 'EDITAR SITUACIÓN'
      : 'REGISTRAR SITUACIÓN';

    modalRef.componentInstance.data = situacion;

    modalRef.result
      .then(
        (resultado: SituacionFormData) => {
          if (resultado) {
            this.guardarSituacion(
              resultado,
              situacion
            );
          }
        }
      )
      .catch(() => {});
  }

  private guardarSituacion(
    data: SituacionFormData,
    situacion: Situacion | null
  ): void {
    this.situacionService
      .existeDescripcion(
        data.descripcion,
        situacion?.id
      )
      .pipe(
        switchMap((existeDescripcion) => {
          if (existeDescripcion) {
            window.alert(
              'Ya existe una situación con esa descripción.'
            );

            return EMPTY;
          }

          if (!situacion) {
            return this.situacionService.crear(data);
          }

          return this.situacionService.actualizar(
            situacion.id,
            data
          );
        })
      )
      .subscribe((situacionGuardada) => {
        if (!situacionGuardada) {
          return;
        }

        if (!situacion) {
          this.registrarEventoSituacion(
            AccionBitacora.CREAR,
            situacionGuardada,
            `Se creó la situación ` +
              `${situacionGuardada.descripcion}.`
          );
        } else {
          this.registrarEventoSituacion(
            AccionBitacora.EDITAR,
            situacionGuardada,
            `Se actualizó la situación ` +
              `${situacionGuardada.descripcion}.`
          );
        }

        this.page = 1;
        this.cargarSituaciones();
      });
  }

  private cargarPermisos(): void {
    forkJoin({
      crear: this.authService.tienePermiso(
        ModuloSistema.SITUACIONES,
        AccionPermiso.CREAR
      ),
      editar: this.authService.tienePermiso(
        ModuloSistema.SITUACIONES,
        AccionPermiso.EDITAR
      ),
      cambiarEstado:
        this.authService.tienePermiso(
          ModuloSistema.SITUACIONES,
          AccionPermiso.ELIMINAR
        )
    }).subscribe((permisos) => {
      this.puedeCrear = permisos.crear;
      this.puedeEditar = permisos.editar;
      this.puedeCambiarEstado =
        permisos.cambiarEstado;
    });
  }

  private registrarEventoSituacion(
    accion: AccionBitacora,
    situacion: Situacion,
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
      modulo: ModuloSistema.SITUACIONES,
      accion,
      entidad: 'Situación',
      registroId: situacion.id,
      detalle,
      resultado: ResultadoBitacora.EXITO
    };

    this.bitacoraService
      .registrar(evento)
      .subscribe();
  }
}
