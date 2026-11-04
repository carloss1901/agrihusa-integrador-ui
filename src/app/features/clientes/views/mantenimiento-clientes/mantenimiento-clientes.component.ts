import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { AlertService } from '../../../../core/services/alert.service';
import { AccionPermiso, ModuloSistema } from '../../../../core/models/permiso.model';
import { TokenService } from '../../../../core/services/token.service';
import { ClienteService } from '../../../../core/services/cliente.service';
import { Cliente, ClienteFilter, ClienteFormData, ClienteQuery } from '../../../../core/models/cliente.model';
import { AgrihusaButtonComponent } from '../../../../shared/components/agrihusa-button/agrihusa-button.component';
import { IChangePaginate } from '../../../../shared/components/agrihusa-table-footer/agrihusa-table-footer.component';
import { AgrihusaTopBarComponent } from '../../../../shared/components/agrihusa-topbar/agrihusa-topbar.component';
import { FiltroClientesComponent } from '../../components/filtro-clientes/filtro-clientes.component';
import { ModalConfirmacionComponent } from '../../../../shared/components/modal-confirmacion/modal-confirmacion.component';
import { ModalClienteComponent } from '../../components/modal-cliente/modal-cliente.component';
import { TablaClientesComponent } from '../../components/tabla-clientes/tabla-clientes.component';
@Component({ selector: 'app-mantenimiento-clientes', standalone: true, imports: [CommonModule, AgrihusaTopBarComponent, AgrihusaButtonComponent, FiltroClientesComponent, TablaClientesComponent], templateUrl: './mantenimiento-clientes.component.html' })
export class MantenimientoClientesComponent implements OnInit {
  private readonly tokenService = inject(TokenService);
  readonly puedeRegistrar = this.tokenService.tienePermiso(ModuloSistema.CLIENTES, AccionPermiso.CREAR);
  readonly puedeEditar = this.tokenService.tienePermiso(ModuloSistema.CLIENTES, AccionPermiso.EDITAR);
  readonly puedeEliminar = this.tokenService.tienePermiso(ModuloSistema.CLIENTES, AccionPermiso.ELIMINAR);
  readonly titulo = 'Clientes'; clientes: Cliente[] = []; filaSeleccionada: Cliente | null = null; loading = false; totalItems = 0; page = 1; pageSize = 10; private filtro: ClienteFilter = {};
  constructor(private readonly clienteService: ClienteService, private readonly modalService: NgbModal, private readonly alertService: AlertService) {}
  ngOnInit(): void { this.cargarClientes(); }
  onBuscar(filtro: ClienteFilter): void { this.filtro = { ...filtro }; this.page = 1; this.cargarClientes(); }
  onLimpiarFiltro(): void { this.filtro = {}; this.page = 1; this.cargarClientes(); }
  onSeleccionarCliente(item: Cliente): void { this.filaSeleccionada = this.filaSeleccionada?.id === item.id ? null : item; }
  onChangePaginate(event: IChangePaginate): void { this.page = event.page; this.pageSize = event.pageSize; this.cargarClientes(); }
  mostrarModalCrear(): void { this.abrirModal(null); }
  mostrarModalEditar(): void { if (!this.filaSeleccionada || !this.filaSeleccionada.activo) return; this.abrirModal(this.filaSeleccionada); }
  cambiarEstado(): void { const item = this.filaSeleccionada; if (!item) return; const modalRef = this.modalService.open(ModalConfirmacionComponent, { backdrop: 'static', keyboard: false, centered: true }); modalRef.componentInstance.titulo = item.activo ? 'Confirmar eliminación' : 'Confirmar activación'; modalRef.componentInstance.mensaje = `¿Deseas ${item.activo ? 'desactivar' : 'activar'} el cliente "${item.razonSocial}"?`; modalRef.result.then((confirmado: boolean) => { if (!confirmado) return; this.clienteService.cambiarEstado(item.id, !item.activo).subscribe({ next: (response) => { this.alertService.success(response.message!); this.cargarClientes(); }, error: (error: HttpErrorResponse) => this.mostrarError(error) }); }).catch(() => {}); }
  private cargarClientes(): void { const query: ClienteQuery = { ...this.filtro, page: this.page, pageSize: this.pageSize }; this.loading = true; this.filaSeleccionada = null; this.clienteService.listar(query).pipe(finalize(() => { this.loading = false; })).subscribe({ next: (resultado) => { this.clientes = resultado.items; this.totalItems = resultado.totalItems; }, error: (error: HttpErrorResponse) => this.mostrarError(error) }); }
  private abrirModal(item: Cliente | null): void { const modalRef = this.modalService.open(ModalClienteComponent, { backdrop: 'static', keyboard: false, size: 'lg', centered: true, scrollable: true }); modalRef.componentInstance.titleModal = item ? 'EDITAR CLIENTE' : 'REGISTRAR CLIENTE'; modalRef.componentInstance.data = item; modalRef.result.then((resultado: ClienteFormData) => { if (resultado) this.guardar(resultado, item); }).catch(() => {}); }
  private guardar(data: ClienteFormData, item: Cliente | null): void { (item ? this.clienteService.actualizar(item.id, data) : this.clienteService.crear(data)).subscribe({ next: (response) => { this.alertService.success(response.message!); this.page = 1; this.cargarClientes(); }, error: (error: HttpErrorResponse) => this.mostrarError(error) }); }
  private mostrarError(error: HttpErrorResponse): void { this.alertService.error((error.error as { message?: string }).message!); }
}
