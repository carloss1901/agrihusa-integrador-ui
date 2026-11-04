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
import { FiltroMantDestinosComponent } from '../../components/filtro-mant-destinos/filtro-mant-destinos.component';
import { ModalUpsertDestinoComponent } from '../../components/modal-upsert-destino/modal-upsert-destino.component';
import { ModalConfirmarDestinoComponent } from '../../components/modal-confirmar-destino/modal-confirmar-destino.component';
import { TablaMantDestinosComponent } from '../../components/tabla-mant-destinos/tabla-mant-destinos.component';
import {
  Destino,
  DestinoFilter,
  DestinoFormData,
  DestinoQuery
} from '../../../../core/models/destino.model';
import { DestinoService } from '../../../../core/services/destino.service';
import { AlertService } from '../../../../core/services/alert.service';
import { AccionPermiso, ModuloSistema } from '../../../../core/models/permiso.model';
import { TokenService } from '../../../../core/services/token.service';

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
  private readonly tokenService = inject(TokenService);
  readonly puedeRegistrar = this.tokenService.tienePermiso(ModuloSistema.DESTINOS, AccionPermiso.CREAR);
  readonly puedeEditar = this.tokenService.tienePermiso(ModuloSistema.DESTINOS, AccionPermiso.EDITAR);
  readonly puedeEliminar = this.tokenService.tienePermiso(ModuloSistema.DESTINOS, AccionPermiso.ELIMINAR);
  readonly titulo = 'Mantenimiento de Destinos';

  destinos: Destino[] = [];
  filaSeleccionada: Destino | null = null;
  loading = false;
  totalItems = 0;
  page = 1;
  pageSize = 10;

  private filtro: DestinoFilter = {};

  constructor(
    private destinoService: DestinoService,
    private modalService: NgbModal,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
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
    const destino = this.filaSeleccionada;
    if (!destino) {
      return;
    }

    const modalRef = this.modalService.open(ModalConfirmarDestinoComponent, {
      backdrop: 'static',
      keyboard: false,
      centered: true
    });
    modalRef.componentInstance.titulo = destino.activo
      ? 'Confirmar eliminación'
      : 'Confirmar activación';
    modalRef.componentInstance.mensaje =
      `¿Deseas ${destino.activo ? 'desactivar' : 'activar'} el destino "${destino.ciudad} - ${destino.pais}"?`;

    modalRef.result.then((confirmado: boolean) => {
      if (!confirmado) {
        return;
      }

      this.destinoService
        .cambiarEstado(destino.id, !destino.activo)
        .subscribe({
          next: (response) => {
            this.alertService.success(response.message!);
            this.cargarDestinos();
          },
          error: (error: HttpErrorResponse) => this.mostrarError(error)
        });
    }).catch(() => {});
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
      .then((guardado: boolean) => {
        if (guardado) {
          this.page = 1;
          this.cargarDestinos();
        }
      })
      .catch(() => {});
  }

  private mostrarError(error: HttpErrorResponse): void {
    this.alertService.error(
      (error.error as { message?: string }).message!
    );
  }

}
