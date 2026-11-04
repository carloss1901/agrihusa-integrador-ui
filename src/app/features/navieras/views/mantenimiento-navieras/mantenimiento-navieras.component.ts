import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';

import { AlertService } from '../../../../core/services/alert.service';
import { AccionPermiso, ModuloSistema } from '../../../../core/models/permiso.model';
import { TokenService } from '../../../../core/services/token.service';
import { NavieraService } from '../../../../core/services/naviera.service';
import { Naviera, NavieraFilter, NavieraFormData, NavieraQuery } from '../../../../core/models/naviera.model';
import { AgrihusaButtonComponent } from '../../../../shared/components/agrihusa-button/agrihusa-button.component';
import { IChangePaginate } from '../../../../shared/components/agrihusa-table-footer/agrihusa-table-footer.component';
import { AgrihusaTopBarComponent } from '../../../../shared/components/agrihusa-topbar/agrihusa-topbar.component';
import { FiltroMantNavierasComponent } from '../../components/filtro-mant-navieras/filtro-mant-navieras.component';
import { ModalConfirmarNavieraComponent } from '../../components/modal-confirmar-naviera/modal-confirmar-naviera.component';
import { ModalUpsertNavieraComponent } from '../../components/modal-upsert-naviera/modal-upsert-naviera.component';
import { TablaMantNavierasComponent } from '../../components/tabla-mant-navieras/tabla-mant-navieras.component';

@Component({
  selector: 'app-mantenimiento-navieras',
  standalone: true,
  imports: [
    CommonModule,
    AgrihusaTopBarComponent,
    AgrihusaButtonComponent,
    FiltroMantNavierasComponent,
    TablaMantNavierasComponent
  ],
  templateUrl: './mantenimiento-navieras.component.html'
})
export class MantenimientoNavierasComponent implements OnInit {
  private readonly tokenService = inject(TokenService);
  readonly puedeRegistrar = this.tokenService.tienePermiso(ModuloSistema.NAVIERAS, AccionPermiso.CREAR);
  readonly puedeEditar = this.tokenService.tienePermiso(ModuloSistema.NAVIERAS, AccionPermiso.EDITAR);
  readonly puedeEliminar = this.tokenService.tienePermiso(ModuloSistema.NAVIERAS, AccionPermiso.ELIMINAR);
  readonly titulo = 'Mantenimiento de Navieras';

  navieras: Naviera[] = [];
  filaSeleccionada: Naviera | null = null;
  loading = false;
  totalItems = 0;
  page = 1;
  pageSize = 10;

  private filtro: NavieraFilter = {};

  constructor(
    private readonly navieraService: NavieraService,
    private readonly modalService: NgbModal,
    private readonly alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.cargarNavieras();
  }

  onBuscar(filtro: NavieraFilter): void {
    this.filtro = { ...filtro };
    this.page = 1;
    this.cargarNavieras();
  }

  onLimpiarFiltro(): void {
    this.filtro = {};
    this.page = 1;
    this.cargarNavieras();
  }

  onSeleccionarNaviera(naviera: Naviera): void {
    this.filaSeleccionada = this.filaSeleccionada?.id === naviera.id
      ? null
      : naviera;
  }

  onChangePaginate(event: IChangePaginate): void {
    this.page = event.page;
    this.pageSize = event.pageSize;
    this.cargarNavieras();
  }

  mostrarModalCrear(): void {
    this.abrirModal(null);
  }

  mostrarModalEditar(): void {
    if (!this.filaSeleccionada || !this.filaSeleccionada.activo) {
      return;
    }

    this.abrirModal(this.filaSeleccionada);
  }

  cambiarEstado(): void {
    const naviera = this.filaSeleccionada;
    if (!naviera) {
      return;
    }

    const modalRef = this.modalService.open(ModalConfirmarNavieraComponent, {
      backdrop: 'static',
      keyboard: false,
      centered: true
    });
    modalRef.componentInstance.titulo = naviera.activo
      ? 'Confirmar eliminación'
      : 'Confirmar activación';
    modalRef.componentInstance.mensaje =
      `¿Deseas ${naviera.activo ? 'desactivar' : 'activar'} la naviera "${naviera.nombre}"?`;

    modalRef.result.then((confirmado: boolean) => {
      if (!confirmado) {
        return;
      }

      this.navieraService.cambiarEstado(naviera.id, !naviera.activo).subscribe({
        next: (response) => {
          this.alertService.success(response.message!);
          this.cargarNavieras();
        },
        error: (error: HttpErrorResponse) => this.mostrarError(error)
      });
    }).catch(() => {});
  }

  private cargarNavieras(): void {
    const query: NavieraQuery = {
      ...this.filtro,
      page: this.page,
      pageSize: this.pageSize
    };

    this.loading = true;
    this.filaSeleccionada = null;

    this.navieraService.listar(query).pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (resultado) => {
        this.navieras = resultado.items;
        this.totalItems = resultado.totalItems;
      },
      error: (error: HttpErrorResponse) => this.mostrarError(error)
    });
  }

  private abrirModal(naviera: Naviera | null): void {
    const modalRef = this.modalService.open(ModalUpsertNavieraComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
      centered: true,
      scrollable: true
    });

    modalRef.componentInstance.titleModal = naviera
      ? 'EDITAR NAVIERA'
      : 'REGISTRAR NAVIERA';
    modalRef.componentInstance.data = naviera;

    modalRef.result.then((resultado: NavieraFormData) => {
      if (resultado) {
        this.guardarNaviera(resultado, naviera);
      }
    }).catch(() => {});
  }

  private guardarNaviera(data: NavieraFormData, naviera: Naviera | null): void {
    (naviera
      ? this.navieraService.actualizar(naviera.id, data)
      : this.navieraService.crear(data)
    ).subscribe({
      next: (response) => {
        this.alertService.success(response.message!);
        this.page = 1;
        this.cargarNavieras();
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
