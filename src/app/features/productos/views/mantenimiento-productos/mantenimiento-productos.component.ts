import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { AlertService } from '../../../../core/services/alert.service';
import { AccionPermiso, ModuloSistema } from '../../../../core/models/permiso.model';
import { TokenService } from '../../../../core/services/token.service';
import { ProductoService } from '../../../../core/services/producto.service';
import { Producto, ProductoFilter, ProductoFormData, ProductoQuery } from '../../../../core/models/producto.model';
import { AgrihusaButtonComponent } from '../../../../shared/components/agrihusa-button/agrihusa-button.component';
import { IChangePaginate } from '../../../../shared/components/agrihusa-table-footer/agrihusa-table-footer.component';
import { AgrihusaTopBarComponent } from '../../../../shared/components/agrihusa-topbar/agrihusa-topbar.component';
import { FiltroProductosComponent } from '../../components/filtro-productos/filtro-productos.component';
import { ModalConfirmacionComponent } from '../../../../shared/components/modal-confirmacion/modal-confirmacion.component';
import { ModalProductoComponent } from '../../components/modal-producto/modal-producto.component';
import { TablaProductosComponent } from '../../components/tabla-productos/tabla-productos.component';
@Component({ selector: 'app-mantenimiento-productos', standalone: true, imports: [CommonModule, AgrihusaTopBarComponent, AgrihusaButtonComponent, FiltroProductosComponent, TablaProductosComponent], templateUrl: './mantenimiento-productos.component.html' })
export class MantenimientoProductosComponent implements OnInit {
  private readonly tokenService = inject(TokenService);
  readonly puedeRegistrar = this.tokenService.tienePermiso(ModuloSistema.PRODUCTOS, AccionPermiso.CREAR);
  readonly puedeEditar = this.tokenService.tienePermiso(ModuloSistema.PRODUCTOS, AccionPermiso.EDITAR);
  readonly puedeEliminar = this.tokenService.tienePermiso(ModuloSistema.PRODUCTOS, AccionPermiso.ELIMINAR);
  readonly titulo = 'Productos'; productos: Producto[] = []; filaSeleccionada: Producto | null = null; loading = false; totalItems = 0; page = 1; pageSize = 10; private filtro: ProductoFilter = {};
  constructor(private readonly productoService: ProductoService, private readonly modalService: NgbModal, private readonly alertService: AlertService) {}
  ngOnInit(): void { this.cargarProductos(); }
  onBuscar(filtro: ProductoFilter): void { this.filtro = { ...filtro }; this.page = 1; this.cargarProductos(); }
  onLimpiarFiltro(): void { this.filtro = {}; this.page = 1; this.cargarProductos(); }
  onSeleccionarProducto(item: Producto): void { this.filaSeleccionada = this.filaSeleccionada?.id === item.id ? null : item; }
  onChangePaginate(event: IChangePaginate): void { this.page = event.page; this.pageSize = event.pageSize; this.cargarProductos(); }
  mostrarModalCrear(): void { this.abrirModal(null); }
  mostrarModalEditar(): void { if (!this.filaSeleccionada || !this.filaSeleccionada.activo) return; this.abrirModal(this.filaSeleccionada); }
  cambiarEstado(): void { const item = this.filaSeleccionada; if (!item) return; const modalRef = this.modalService.open(ModalConfirmacionComponent, { backdrop: 'static', keyboard: false, centered: true }); modalRef.componentInstance.titulo = item.activo ? 'Confirmar eliminación' : 'Confirmar activación'; modalRef.componentInstance.mensaje = `¿Deseas ${item.activo ? 'desactivar' : 'activar'} el producto "${item.nombre}"?`; modalRef.result.then((confirmado: boolean) => { if (!confirmado) return; this.productoService.cambiarEstado(item.id, !item.activo).subscribe({ next: (response) => { this.alertService.success(response.message!); this.cargarProductos(); }, error: (error: HttpErrorResponse) => this.mostrarError(error) }); }).catch(() => {}); }
  private cargarProductos(): void { const query: ProductoQuery = { ...this.filtro, page: this.page, pageSize: this.pageSize }; this.loading = true; this.filaSeleccionada = null; this.productoService.listar(query).pipe(finalize(() => { this.loading = false; })).subscribe({ next: (resultado) => { this.productos = resultado.items; this.totalItems = resultado.totalItems; }, error: (error: HttpErrorResponse) => this.mostrarError(error) }); }
  private abrirModal(item: Producto | null): void { const modalRef = this.modalService.open(ModalProductoComponent, { backdrop: 'static', keyboard: false, size: 'lg', centered: true, scrollable: true }); modalRef.componentInstance.titleModal = item ? 'EDITAR PRODUCTO' : 'REGISTRAR PRODUCTO'; modalRef.componentInstance.data = item; modalRef.result.then((guardado: boolean) => { if (guardado) { this.page = 1; this.cargarProductos(); } }).catch(() => {}); }
  private guardar(data: ProductoFormData, item: Producto | null): void { (item ? this.productoService.actualizar(item.id, data) : this.productoService.crear(data)).subscribe({ next: (response) => { this.alertService.success(response.message!); this.page = 1; this.cargarProductos(); }, error: (error: HttpErrorResponse) => this.mostrarError(error) }); }
  private mostrarError(error: HttpErrorResponse): void { this.alertService.error((error.error as { message?: string }).message!); }
}
