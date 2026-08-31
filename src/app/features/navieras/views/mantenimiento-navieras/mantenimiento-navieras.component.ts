import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AgrihusaButtonComponent } from '../../../../shared/components/agrihusa-button/agrihusa-button.component';
import { IChangePaginate } from '../../../../shared/components/agrihusa-table-footer/agrihusa-table-footer.component';
import { AgrihusaTopBarComponent } from '../../../../shared/components/agrihusa-topbar/agrihusa-topbar.component';
import { AccionMantenimiento } from '../../../../shared/enums/accion-mantenimiento.enum';
import { FiltroMantNavierasComponent } from '../../components/filtro-mant-navieras/filtro-mant-navieras.component';
import { ModalUpsertNavieraComponent } from '../../components/modal-upsert-naviera/modal-upsert-naviera.component';
import { TablaMantNavierasComponent } from '../../components/tabla-mant-navieras/tabla-mant-navieras.component';

export interface IQueryMantNaviera {
  descripcion?: string;
  estado?: number;
  page?: number;
  size?: number;
}

interface Naviera {
  idNaviera: number;
  descripcion: string;
  activo: boolean;
}

@Component({
  selector: 'app-mantenimiento-navieras',
  standalone: true,
  imports: [CommonModule, AgrihusaTopBarComponent, AgrihusaButtonComponent, FiltroMantNavierasComponent, TablaMantNavierasComponent],
  templateUrl: './mantenimiento-navieras.component.html'
})
export class MantenimientoNavierasComponent implements OnInit {
  readonly AccionMantenimiento = AccionMantenimiento;

  getNombreMantenimiento = 'Mantenimiento de Navieras';
  filaSeleccionada: any = null;
  dataNavieras: Naviera[] = [];
  loading = false;
  totalItems = 0;
  page = 1;
  pageSize = 10;

  private todasNavieras: Naviera[] = [];
  private queryFilter: IQueryMantNaviera = { page: 1, size: 10 };

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    this.todasNavieras = [
      { idNaviera: 1, descripcion: 'MAERSK', activo: true },
      { idNaviera: 2, descripcion: 'MSC', activo: true },
      { idNaviera: 3, descripcion: 'HAPAG-LLOYD', activo: true },
      { idNaviera: 4, descripcion: 'CMA CGM', activo: false },
      { idNaviera: 5, descripcion: 'EVERGREEN', activo: true }
    ];
    this.aplicarGrilla();
  }

  onBuscar(query: IQueryMantNaviera) {
    this.queryFilter = { ...query, page: 1, size: this.pageSize };
    this.page = 1;
    this.aplicarGrilla();
  }

  onLimpiarFiltro() {
    this.queryFilter = { page: 1, size: this.pageSize };
    this.page = 1;
    this.aplicarGrilla();
  }

  onSeleccionarItem(item: any) {
    this.filaSeleccionada = this.filaSeleccionada?.idNaviera === item.idNaviera ? null : item;
  }

  onChangePaginate(event: IChangePaginate) {
    this.page = event.page;
    this.pageSize = event.pageSize;
    this.aplicarGrilla();
  }

  mostrarModalUpsert(accion: AccionMantenimiento) {
    const modalRef = this.modalService.open(ModalUpsertNavieraComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
      centered: true
    });

    modalRef.componentInstance.titleModal =
      accion === AccionMantenimiento.CREAR ? 'REGISTRAR NAVIERA' : 'EDITAR NAVIERA';
    modalRef.componentInstance.accion = accion;
    modalRef.componentInstance.data =
      accion === AccionMantenimiento.ACTUALIZAR ? this.filaSeleccionada : null;

    modalRef.result
      .then((result: { accion: AccionMantenimiento; descripcion: string }) => {
        if (result) this.onGuardarModal(result.accion, result.descripcion);
      })
      .catch(() => {});
  }

  eliminarNaviera() {
    const target = this.todasNavieras.find((item) => item.idNaviera === this.filaSeleccionada?.idNaviera);
    if (target) target.activo = !target.activo;
    this.aplicarGrilla();
  }

  private aplicarGrilla() {
    this.filaSeleccionada = null;
    const filtrados = this.todasNavieras.filter((item) => {
      if (this.queryFilter.descripcion && !item.descripcion.toUpperCase().includes(this.queryFilter.descripcion.toUpperCase())) return false;
      if (this.queryFilter.estado != null) {
        const activo = this.queryFilter.estado === 1;
        if (item.activo !== activo) return false;
      }
      return true;
    });

    this.totalItems = filtrados.length;
    const inicio = (this.page - 1) * this.pageSize;
    this.dataNavieras = filtrados.slice(inicio, inicio + this.pageSize);
  }

  private onGuardarModal(accion: AccionMantenimiento, descripcion: string) {
    if (accion === AccionMantenimiento.CREAR) {
      const nuevoId = this.todasNavieras.length > 0 ? Math.max(...this.todasNavieras.map((item) => item.idNaviera)) + 1 : 1;
      this.todasNavieras.unshift({ idNaviera: nuevoId, descripcion, activo: true });
    } else {
      const target = this.todasNavieras.find((item) => item.idNaviera === this.filaSeleccionada?.idNaviera);
      if (target) target.descripcion = descripcion;
    }

    this.page = 1;
    this.aplicarGrilla();
  }
}
