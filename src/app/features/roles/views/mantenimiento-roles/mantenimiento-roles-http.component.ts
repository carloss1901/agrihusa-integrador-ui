import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';

import { AlertService } from '../../../../core/services/alert.service';
import { RolService } from '../../../../core/services/rol.service';
import { AgrihusaButtonComponent } from '../../../../shared/components/agrihusa-button/agrihusa-button.component';
import { IChangePaginate } from '../../../../shared/components/agrihusa-table-footer/agrihusa-table-footer.component';
import { AgrihusaTopBarComponent } from '../../../../shared/components/agrihusa-topbar/agrihusa-topbar.component';
import { FiltroRolesComponent } from '../../components/filtro-roles/filtro-roles.component';
import { ModalRolComponent } from '../../components/modal-rol/modal-rol.component';
import { TablaRolesComponent } from '../../components/tabla-roles/tabla-roles.component';
import { Rol, RolFilter, RolFormData, RolQuery } from '../../models/rol.model';

@Component({
  selector: 'app-mantenimiento-roles',
  standalone: true,
  imports: [
    CommonModule,
    AgrihusaTopBarComponent,
    AgrihusaButtonComponent,
    FiltroRolesComponent,
    TablaRolesComponent
  ],
  templateUrl: './mantenimiento-roles.component.html'
})
export class MantenimientoRolesHttpComponent implements OnInit {
  readonly titulo = 'Mantenimiento de Roles';
  roles: Rol[] = [];
  filaSeleccionada: Rol | null = null;
  loading = false;
  totalItems = 0;
  page = 1;
  pageSize = 10;
  private filtro: RolFilter = {};

  constructor(
    private readonly rolService: RolService,
    private readonly modalService: NgbModal,
    private readonly alertService: AlertService
  ) {}

  ngOnInit(): void { this.cargarRoles(); }

  onBuscar(filtro: RolFilter): void {
    this.filtro = { ...filtro };
    this.page = 1;
    this.cargarRoles();
  }

  onLimpiarFiltro(): void {
    this.filtro = {};
    this.page = 1;
    this.cargarRoles();
  }

  onSeleccionarRol(rol: Rol): void {
    this.filaSeleccionada = this.filaSeleccionada?.id === rol.id ? null : rol;
  }

  onChangePaginate(event: IChangePaginate): void {
    this.page = event.page;
    this.pageSize = event.pageSize;
    this.cargarRoles();
  }

  mostrarModalCrear(): void { this.abrirModal(null); }

  mostrarModalEditar(): void {
    if (!this.filaSeleccionada) return;

    if (this.filaSeleccionada.esSistema) {
      this.alertService.warning('El rol Administrador está protegido y no puede editarse.');
      return;
    }

    if (!this.filaSeleccionada.activo) return;
    const rolSeleccionado = this.filaSeleccionada;
    this.rolService.obtenerPorId(rolSeleccionado.id, rolSeleccionado).subscribe({
      next: (rol) => this.abrirModal(rol),
      error: (error: HttpErrorResponse) => this.mostrarError(error)
    });
  }

  cambiarEstado(): void {
    const rol = this.filaSeleccionada;
    if (!rol || rol.esSistema) return;

    const accion = rol.activo ? 'desactivar' : 'activar';
    if (!window.confirm(`¿Deseas ${accion} el rol "${rol.nombre}"?`)) return;

    this.rolService.cambiarEstado(rol.id, !rol.activo).subscribe({
      next: (response) => {
        this.alertService.success(response.message!);
        this.cargarRoles();
      },
      error: (error: HttpErrorResponse) => this.mostrarError(error)
    });
  }

  private cargarRoles(): void {
    const query: RolQuery = { ...this.filtro, page: this.page, pageSize: this.pageSize };
    this.loading = true;
    this.filaSeleccionada = null;

    this.rolService.listar(query).pipe(finalize(() => this.loading = false)).subscribe({
      next: (resultado) => {
        this.roles = resultado.items;
        this.totalItems = resultado.totalItems;
      },
      error: (error: HttpErrorResponse) => this.mostrarError(error)
    });
  }

  private abrirModal(rol: Rol | null): void {
    const modalRef = this.modalService.open(ModalRolComponent, {
      backdrop: 'static', keyboard: false, size: 'xl', centered: true
    });
    modalRef.componentInstance.titleModal = rol ? 'EDITAR ROL' : 'REGISTRAR ROL';
    modalRef.componentInstance.data = rol;
    modalRef.result.then((resultado: RolFormData) => {
      if (!resultado) return;
      (rol ? this.rolService.actualizar(rol.id, resultado) : this.rolService.crear(resultado)).subscribe({
        next: (response) => {
          this.alertService.success(response.message!);
          this.page = 1;
          this.cargarRoles();
        },
        error: (error: HttpErrorResponse) => this.mostrarError(error)
      });
    }).catch(() => {});
  }

  private mostrarError(error: HttpErrorResponse): void {
    this.alertService.error((error.error as { message?: string }).message!);
  }
}
