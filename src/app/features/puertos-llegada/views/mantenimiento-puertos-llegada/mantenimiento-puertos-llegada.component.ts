import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { AlertService } from '../../../../core/services/alert.service';
import { AccionPermiso, ModuloSistema } from '../../../../core/models/permiso.model';
import { TokenService } from '../../../../core/services/token.service';
import { PuertoLlegadaService } from '../../../../core/services/puerto-llegada.service';
import { PuertoLlegada, PuertoLlegadaFilter, PuertoLlegadaFormData, PuertoLlegadaQuery } from '../../models/puerto-llegada.model';
import { AgrihusaButtonComponent } from '../../../../shared/components/agrihusa-button/agrihusa-button.component';
import { IChangePaginate } from '../../../../shared/components/agrihusa-table-footer/agrihusa-table-footer.component';
import { AgrihusaTopBarComponent } from '../../../../shared/components/agrihusa-topbar/agrihusa-topbar.component';
import { FiltroMantPuertosLlegadaComponent } from '../../components/filtro-mant-puertos-llegada/filtro-mant-puertos-llegada.component';
import { ModalConfirmacionComponent } from '../../../../shared/components/modal-confirmacion/modal-confirmacion.component';
import { ModalUpsertPuertoLlegadaComponent } from '../../components/modal-upsert-puerto-llegada/modal-upsert-puerto-llegada.component';
import { TablaMantPuertosLlegadaComponent } from '../../components/tabla-mant-puertos-llegada/tabla-mant-puertos-llegada.component';
@Component({ selector: 'app-mantenimiento-puertos-llegada', standalone: true, imports: [CommonModule, AgrihusaTopBarComponent, AgrihusaButtonComponent, FiltroMantPuertosLlegadaComponent, TablaMantPuertosLlegadaComponent], templateUrl: './mantenimiento-puertos-llegada.component.html' })
export class MantenimientoPuertosLlegadaComponent implements OnInit {
  private readonly tokenService = inject(TokenService);
  readonly puedeRegistrar = this.tokenService.tienePermiso(ModuloSistema.PUERTOS_LLEGADA, AccionPermiso.CREAR);
  readonly puedeEditar = this.tokenService.tienePermiso(ModuloSistema.PUERTOS_LLEGADA, AccionPermiso.EDITAR);
  readonly puedeEliminar = this.tokenService.tienePermiso(ModuloSistema.PUERTOS_LLEGADA, AccionPermiso.ELIMINAR);
  readonly titulo = 'Puertos de Llegada'; puertos: PuertoLlegada[] = []; filaSeleccionada: PuertoLlegada | null = null; loading = false; totalItems = 0; page = 1; pageSize = 10; private filtro: PuertoLlegadaFilter = {};
  constructor(private readonly puertoService: PuertoLlegadaService, private readonly modalService: NgbModal, private readonly alertService: AlertService) {}
  ngOnInit(): void { this.cargarPuertos(); }
  onBuscar(filtro: PuertoLlegadaFilter): void { this.filtro = { ...filtro }; this.page = 1; this.cargarPuertos(); }
  onLimpiarFiltro(): void { this.filtro = {}; this.page = 1; this.cargarPuertos(); }
  onSeleccionarPuerto(item: PuertoLlegada): void { this.filaSeleccionada = this.filaSeleccionada?.id === item.id ? null : item; }
  onChangePaginate(event: IChangePaginate): void { this.page = event.page; this.pageSize = event.pageSize; this.cargarPuertos(); }
  mostrarModalCrear(): void { this.abrirModal(null); }
  mostrarModalEditar(): void { if (!this.filaSeleccionada || !this.filaSeleccionada.activo) return; this.abrirModal(this.filaSeleccionada); }
  cambiarEstado(): void { const item = this.filaSeleccionada; if (!item) return; const modalRef = this.modalService.open(ModalConfirmacionComponent, { backdrop: 'static', keyboard: false, centered: true }); modalRef.componentInstance.titulo = item.activo ? 'Confirmar eliminación' : 'Confirmar activación'; modalRef.componentInstance.mensaje = `¿Deseas ${item.activo ? 'desactivar' : 'activar'} el puerto "${item.puerto}"?`; modalRef.result.then((confirmado: boolean) => { if (!confirmado) return; this.puertoService.cambiarEstado(item.id, !item.activo).subscribe({ next: (response) => { this.alertService.success(response.message!); this.cargarPuertos(); }, error: (error: HttpErrorResponse) => this.mostrarError(error) }); }).catch(() => {}); }
  private cargarPuertos(): void { const query: PuertoLlegadaQuery = { ...this.filtro, page: this.page, pageSize: this.pageSize }; this.loading = true; this.filaSeleccionada = null; this.puertoService.listar(query).pipe(finalize(() => { this.loading = false; })).subscribe({ next: (resultado) => { this.puertos = resultado.items; this.totalItems = resultado.totalItems; }, error: (error: HttpErrorResponse) => this.mostrarError(error) }); }
  private abrirModal(item: PuertoLlegada | null): void { const modalRef = this.modalService.open(ModalUpsertPuertoLlegadaComponent, { backdrop: 'static', keyboard: false, size: 'lg', centered: true, scrollable: true }); modalRef.componentInstance.titleModal = item ? 'EDITAR PUERTO DE LLEGADA' : 'REGISTRAR PUERTO DE LLEGADA'; modalRef.componentInstance.data = item; modalRef.result.then((resultado: PuertoLlegadaFormData) => { if (resultado) this.guardar(resultado, item); }).catch(() => {}); }
  private guardar(data: PuertoLlegadaFormData, item: PuertoLlegada | null): void { (item ? this.puertoService.actualizar(item.id, data) : this.puertoService.crear(data)).subscribe({ next: (response) => { this.alertService.success(response.message!); this.page = 1; this.cargarPuertos(); }, error: (error: HttpErrorResponse) => this.mostrarError(error) }); }
  private mostrarError(error: HttpErrorResponse): void { this.alertService.error((error.error as { message?: string }).message!); }
}
