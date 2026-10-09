import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { AlertService } from '../../../../core/services/alert.service';
import { AccionPermiso, ModuloSistema } from '../../../../core/models/permiso.model';
import { TokenService } from '../../../../core/services/token.service';
import { VariedadService } from '../../../../core/services/variedad.service';
import { Variedad, VariedadFilter, VariedadQuery } from '../../../../core/models/variedad.model';
import { Producto } from '../../../../core/models/producto.model';
import { ProductoService } from '../../../../core/services/producto.service';
import { AgrihusaButtonComponent } from '../../../../shared/components/agrihusa-button/agrihusa-button.component';
import { IChangePaginate } from '../../../../shared/components/agrihusa-table-footer/agrihusa-table-footer.component';
import { AgrihusaTopBarComponent } from '../../../../shared/components/agrihusa-topbar/agrihusa-topbar.component';
import { FiltroMantVariedadesComponent } from '../../components/filtro-mant-variedades/filtro-mant-variedades.component';
import { ModalConfirmacionComponent } from '../../../../shared/components/modal-confirmacion/modal-confirmacion.component';
import { ModalUpsertVariedadComponent } from '../../components/modal-upsert-variedad/modal-upsert-variedad.component';
import { TablaMantVariedadesComponent } from '../../components/tabla-mant-variedades/tabla-mant-variedades.component';
@Component({ selector: 'app-mantenimiento-variedades', standalone: true, imports: [CommonModule, AgrihusaTopBarComponent, AgrihusaButtonComponent, FiltroMantVariedadesComponent, TablaMantVariedadesComponent], templateUrl: './mantenimiento-variedades.component.html' })
export class MantenimientoVariedadesComponent implements OnInit {
  private readonly tokenService = inject(TokenService);
  readonly puedeRegistrar = this.tokenService.tienePermiso(ModuloSistema.VARIEDADES, AccionPermiso.CREAR);
  readonly puedeEditar = this.tokenService.tienePermiso(ModuloSistema.VARIEDADES, AccionPermiso.EDITAR);
  readonly puedeEliminar = this.tokenService.tienePermiso(ModuloSistema.VARIEDADES, AccionPermiso.ELIMINAR);
  readonly titulo = 'Variedades'; variedades: Variedad[] = []; productos: Producto[] = []; filaSeleccionada: Variedad | null = null; loading = false; totalItems = 0; page = 1; pageSize = 10; private filtro: VariedadFilter = {};
  constructor(private readonly variedadService: VariedadService, private readonly productoService: ProductoService, private readonly modalService: NgbModal, private readonly alertService: AlertService) {}
  ngOnInit(): void { this.cargarProductos(); this.cargarVariedades(); }
  onBuscar(filtro: VariedadFilter): void { this.filtro = { ...filtro }; this.page = 1; this.cargarVariedades(); }
  onLimpiarFiltro(): void { this.filtro = {}; this.page = 1; this.cargarVariedades(); }
  onSeleccionarVariedad(item: Variedad): void { this.filaSeleccionada = this.filaSeleccionada?.id === item.id ? null : item; }
  onChangePaginate(event: IChangePaginate): void { this.page = event.page; this.pageSize = event.pageSize; this.cargarVariedades(); }
  mostrarModalCrear(): void { this.abrirModal(null); }
  mostrarModalEditar(): void { if (!this.filaSeleccionada || !this.filaSeleccionada.activo) return; this.abrirModal(this.filaSeleccionada); }
  cambiarEstado(): void { const item = this.filaSeleccionada; if (!item) return; const modalRef = this.modalService.open(ModalConfirmacionComponent, { backdrop: 'static', keyboard: false, centered: true }); modalRef.componentInstance.titulo = item.activo ? 'Confirmar eliminación' : 'Confirmar activación'; modalRef.componentInstance.mensaje = `¿Deseas ${item.activo ? 'desactivar' : 'activar'} la variedad "${item.nombre}"?`; modalRef.result.then((confirmado: boolean) => { if (!confirmado) return; this.variedadService.cambiarEstado(item.id, !item.activo).subscribe({ next: (response) => { this.alertService.success(response.message!); this.cargarVariedades(); }, error: (error: HttpErrorResponse) => this.mostrarError(error) }); }).catch(() => {}); }
  private cargarVariedades(): void { const query: VariedadQuery = { ...this.filtro, page: this.page, pageSize: this.pageSize }; this.loading = true; this.filaSeleccionada = null; this.variedadService.listar(query).pipe(finalize(() => { this.loading = false; })).subscribe({ next: (resultado) => { this.variedades = resultado.items; this.totalItems = resultado.totalItems; }, error: (error: HttpErrorResponse) => this.mostrarError(error) }); }
  private abrirModal(item: Variedad | null): void { const modalRef = this.modalService.open(ModalUpsertVariedadComponent, { backdrop: 'static', keyboard: false, size: 'lg', centered: true, scrollable: true }); modalRef.componentInstance.titleModal = item ? 'EDITAR VARIEDAD' : 'REGISTRAR VARIEDAD'; modalRef.componentInstance.data = item; modalRef.componentInstance.productos = this.productos; modalRef.result.then((guardado: boolean) => { if (guardado) { this.page = 1; this.cargarVariedades(); } }).catch(() => {}); }
  private mostrarError(error: HttpErrorResponse): void { this.alertService.error((error.error as { message?: string }).message!); }
  private cargarProductos(): void { this.productoService.listarActivos().subscribe({ next: (productos) => { this.productos = productos; }, error: (error: HttpErrorResponse) => this.mostrarError(error) }); }
}
