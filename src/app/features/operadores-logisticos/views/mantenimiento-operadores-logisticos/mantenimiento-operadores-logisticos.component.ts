import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { AlertService } from '../../../../core/services/alert.service';
import { AccionPermiso, ModuloSistema } from '../../../../core/models/permiso.model';
import { TokenService } from '../../../../core/services/token.service';
import { OperadorLogisticoService } from '../../../../core/services/operador-logistico.service';
import { OperadorLogistico, OperadorLogisticoFilter, OperadorLogisticoFormData, OperadorLogisticoQuery } from '../../models/operador-logistico.model';
import { AgrihusaButtonComponent } from '../../../../shared/components/agrihusa-button/agrihusa-button.component';
import { IChangePaginate } from '../../../../shared/components/agrihusa-table-footer/agrihusa-table-footer.component';
import { AgrihusaTopBarComponent } from '../../../../shared/components/agrihusa-topbar/agrihusa-topbar.component';
import { FiltroOperadoresLogisticosComponent } from '../../components/filtro-operadores-logisticos/filtro-operadores-logisticos.component';
import { ModalConfirmacionComponent } from '../../../../shared/components/modal-confirmacion/modal-confirmacion.component';
import { ModalOperadorLogisticoComponent } from '../../components/modal-operador-logistico/modal-operador-logistico.component';
import { TablaOperadoresLogisticosComponent } from '../../components/tabla-operadores-logisticos/tabla-operadores-logisticos.component';
@Component({ selector: 'app-mantenimiento-operadores-logisticos', standalone: true, imports: [CommonModule, AgrihusaTopBarComponent, AgrihusaButtonComponent, FiltroOperadoresLogisticosComponent, TablaOperadoresLogisticosComponent], templateUrl: './mantenimiento-operadores-logisticos.component.html' })
export class MantenimientoOperadoresLogisticosComponent implements OnInit {
  private readonly tokenService = inject(TokenService);
  readonly puedeRegistrar = this.tokenService.tienePermiso(ModuloSistema.OPERADORES_LOGISTICOS, AccionPermiso.CREAR);
  readonly puedeEditar = this.tokenService.tienePermiso(ModuloSistema.OPERADORES_LOGISTICOS, AccionPermiso.EDITAR);
  readonly puedeEliminar = this.tokenService.tienePermiso(ModuloSistema.OPERADORES_LOGISTICOS, AccionPermiso.ELIMINAR);
  readonly titulo = 'Operadores Logísticos'; operadores: OperadorLogistico[] = []; filaSeleccionada: OperadorLogistico | null = null; loading = false; totalItems = 0; page = 1; pageSize = 10; private filtro: OperadorLogisticoFilter = {};
  constructor(private readonly operadorService: OperadorLogisticoService, private readonly modalService: NgbModal, private readonly alertService: AlertService) {}
  ngOnInit(): void { this.cargarOperadores(); }
  onBuscar(filtro: OperadorLogisticoFilter): void { this.filtro = { ...filtro }; this.page = 1; this.cargarOperadores(); }
  onLimpiarFiltro(): void { this.filtro = {}; this.page = 1; this.cargarOperadores(); }
  onSeleccionarOperador(item: OperadorLogistico): void { this.filaSeleccionada = this.filaSeleccionada?.id === item.id ? null : item; }
  onChangePaginate(event: IChangePaginate): void { this.page = event.page; this.pageSize = event.pageSize; this.cargarOperadores(); }
  mostrarModalCrear(): void { this.abrirModal(null); }
  mostrarModalEditar(): void { if (!this.filaSeleccionada || !this.filaSeleccionada.activo) return; this.abrirModal(this.filaSeleccionada); }
  cambiarEstado(): void { const item = this.filaSeleccionada; if (!item) return; const modalRef = this.modalService.open(ModalConfirmacionComponent, { backdrop: 'static', keyboard: false, centered: true }); modalRef.componentInstance.titulo = item.activo ? 'Confirmar eliminación' : 'Confirmar activación'; modalRef.componentInstance.mensaje = `¿Deseas ${item.activo ? 'desactivar' : 'activar'} el operador "${item.razonSocial}"?`; modalRef.result.then((confirmado: boolean) => { if (!confirmado) return; this.operadorService.cambiarEstado(item.id, !item.activo).subscribe({ next: (response) => { this.alertService.success(response.message!); this.cargarOperadores(); }, error: (error: HttpErrorResponse) => this.mostrarError(error) }); }).catch(() => {}); }
  private cargarOperadores(): void { const query: OperadorLogisticoQuery = { ...this.filtro, page: this.page, pageSize: this.pageSize }; this.loading = true; this.filaSeleccionada = null; this.operadorService.listar(query).pipe(finalize(() => { this.loading = false; })).subscribe({ next: (resultado) => { this.operadores = resultado.items; this.totalItems = resultado.totalItems; }, error: (error: HttpErrorResponse) => this.mostrarError(error) }); }
  private abrirModal(item: OperadorLogistico | null): void { const modalRef = this.modalService.open(ModalOperadorLogisticoComponent, { backdrop: 'static', keyboard: false, size: 'lg', centered: true, scrollable: true }); modalRef.componentInstance.titleModal = item ? 'EDITAR OPERADOR LOGÍSTICO' : 'REGISTRAR OPERADOR LOGÍSTICO'; modalRef.componentInstance.data = item; modalRef.result.then((resultado: OperadorLogisticoFormData) => { if (resultado) this.guardar(resultado, item); }).catch(() => {}); }
  private guardar(data: OperadorLogisticoFormData, item: OperadorLogistico | null): void { (item ? this.operadorService.actualizar(item.id, data) : this.operadorService.crear(data)).subscribe({ next: (response) => { this.alertService.success(response.message!); this.page = 1; this.cargarOperadores(); }, error: (error: HttpErrorResponse) => this.mostrarError(error) }); }
  private mostrarError(error: HttpErrorResponse): void { this.alertService.error((error.error as { message?: string }).message!); }
}
