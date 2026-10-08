import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  OnInit
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';

import { AgrihusaButtonComponent } from '../../../../shared/components/agrihusa-button/agrihusa-button.component';
import {
  IChangePaginate
} from '../../../../shared/components/agrihusa-table-footer/agrihusa-table-footer.component';
import { AgrihusaTopBarComponent } from '../../../../shared/components/agrihusa-topbar/agrihusa-topbar.component';
import { AlertService } from '../../../../core/services/alert.service';
import { AccionPermiso, ModuloSistema } from '../../../../core/models/permiso.model';
import { TokenService } from '../../../../core/services/token.service';
import { ViaService } from '../../../../core/services/via.service';
import {
  Via,
  ViaFilter,
  ViaFormData,
  ViaQuery
} from '../../../../core/models/via.model';
import { FiltroMantViasComponent } from '../../components/filtro-mant-vias/filtro-mant-vias.component';
import { ModalConfirmarViaComponent } from '../../components/modal-confirmar-via/modal-confirmar-via.component';
import { ModalUpsertViaComponent } from '../../components/modal-upsert-via/modal-upsert-via.component';
import { TablaMantViasComponent } from '../../components/tabla-mant-vias/tabla-mant-vias.component';

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
  private readonly tokenService = inject(TokenService);
  readonly puedeRegistrar = this.tokenService.tienePermiso(ModuloSistema.VIAS, AccionPermiso.CREAR);
  readonly puedeEditar = this.tokenService.tienePermiso(ModuloSistema.VIAS, AccionPermiso.EDITAR);
  readonly puedeEliminar = this.tokenService.tienePermiso(ModuloSistema.VIAS, AccionPermiso.ELIMINAR);
  readonly titulo = 'Mantenimiento de Vías';

  vias: Via[] = [];
  filaSeleccionada: Via | null = null;
  loading = false;
  totalItems = 0;
  page = 1;
  pageSize = 10;

  private filtro: ViaFilter = {};

  constructor(
    private readonly viaService: ViaService,
    private readonly modalService: NgbModal,
    private readonly alertService: AlertService
  ) {}

  ngOnInit(): void {
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
    this.abrirModal(null);
  }

  mostrarModalEditar(): void {
    if (
      !this.filaSeleccionada ||
      !this.filaSeleccionada.activo
    ) {
      return;
    }

    this.abrirModal(this.filaSeleccionada);
  }

  cambiarEstado(): void {
    const via = this.filaSeleccionada;
    if (!via) {
      return;
    }

    const modalRef = this.modalService.open(ModalConfirmarViaComponent, {
      backdrop: 'static',
      keyboard: false,
      centered: true
    });
    modalRef.componentInstance.titulo = via.activo
      ? 'Confirmar eliminación'
      : 'Confirmar activación';
    modalRef.componentInstance.mensaje =
      `¿Deseas ${via.activo ? 'desactivar' : 'activar'} la vía "${via.descripcion}"?`;

    modalRef.result.then((confirmado: boolean) => {
      if (!confirmado) {
        return;
      }

      this.viaService.cambiarEstado(via.id, !via.activo).subscribe({
        next: (response) => {
          this.alertService.success(
            response.message!
          );
          this.cargarVias();
        },
        error: (error: HttpErrorResponse) => this.mostrarError(error)
      });
    }).catch(() => {});
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

  private guardarVia(data: ViaFormData, via: Via | null): void {
    (via
      ? this.viaService.actualizar(via.id, data)
      : this.viaService.crear(data)
    ).subscribe({
      next: (response) => {
        this.alertService.success(response.message!);
        this.page = 1;
        this.cargarVias();
      },
      error: (error: HttpErrorResponse) => this.mostrarError(error)
    });
  }

  private mostrarError(error: HttpErrorResponse): void {
    this.alertService.error(
      (error.error as { message?: string }).message!
    );
  }

}
