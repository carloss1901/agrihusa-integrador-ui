import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AgrihusaButtonComponent } from '../../../../shared/components/agrihusa-button/agrihusa-button.component';
import { IChangePaginate } from '../../../../shared/components/agrihusa-table-footer/agrihusa-table-footer.component';
import { AgrihusaTopBarComponent } from '../../../../shared/components/agrihusa-topbar/agrihusa-topbar.component';
import { AccionMantenimiento } from '../../../../shared/enums/accion-mantenimiento.enum';
import { FiltroMantVariedadesComponent } from '../../components/filtro-mant-variedades/filtro-mant-variedades.component';
import { ModalUpsertVariedadComponent } from '../../components/modal-upsert-variedad/modal-upsert-variedad.component';
import { TablaMantVariedadesComponent } from '../../components/tabla-mant-variedades/tabla-mant-variedades.component';

export interface IQueryMantVariedad {
  descripcion?: string;
  estado?: number;
  page?: number;
  size?: number;
}

interface Variedad {
  idVariedad: number;
  descripcion: string;
  activo: boolean;
}

@Component({
  selector: 'app-mantenimiento-variedades',
  standalone: true,
  imports: [CommonModule, AgrihusaTopBarComponent, AgrihusaButtonComponent, FiltroMantVariedadesComponent, TablaMantVariedadesComponent],
  templateUrl: './mantenimiento-variedades.component.html'
})
export class MantenimientoVariedadesComponent implements OnInit {
  readonly AccionMantenimiento = AccionMantenimiento;

  getNombreMantenimiento = 'Mantenimiento de Variedades';
  filaSeleccionada: any = null;
  dataVariedades: Variedad[] = [];
  loading = false;
  totalItems = 0;
  page = 1;
  pageSize = 10;

  private todasVariedades: Variedad[] = [];
  private queryFilter: IQueryMantVariedad = { page: 1, size: 10 };

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    this.todasVariedades = [
      { idVariedad: 1, descripcion: 'HASS', activo: true },
      { idVariedad: 2, descripcion: 'FUERTE', activo: true },
      { idVariedad: 3, descripcion: 'ZUTANO', activo: false },
      { idVariedad: 4, descripcion: 'BACON', activo: true },
      { idVariedad: 5, descripcion: 'PINKERTON', activo: true }
    ];
    this.aplicarGrilla();
  }

  onBuscar(query: IQueryMantVariedad) {
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
    this.filaSeleccionada = this.filaSeleccionada?.idVariedad === item.idVariedad ? null : item;
  }

  onChangePaginate(event: IChangePaginate) {
    this.page = event.page;
    this.pageSize = event.pageSize;
    this.aplicarGrilla();
  }

  mostrarModalUpsert(accion: AccionMantenimiento) {
    const modalRef = this.modalService.open(ModalUpsertVariedadComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
      centered: true
    });

    modalRef.componentInstance.titleModal =
      accion === AccionMantenimiento.CREAR ? 'REGISTRAR VARIEDAD' : 'EDITAR VARIEDAD';
    modalRef.componentInstance.accion = accion;
    modalRef.componentInstance.data =
      accion === AccionMantenimiento.ACTUALIZAR ? this.filaSeleccionada : null;

    modalRef.result
      .then((result: { accion: AccionMantenimiento; descripcion: string }) => {
        if (result) {
          this.onGuardarModal(result.accion, result.descripcion);
        }
      })
      .catch(() => {});
  }

  eliminarVariedad() {
    const target = this.todasVariedades.find((item) => item.idVariedad === this.filaSeleccionada?.idVariedad);
    if (target) target.activo = !target.activo;
    this.aplicarGrilla();
  }

  private aplicarGrilla() {
    this.filaSeleccionada = null;

    const filtrados = this.todasVariedades.filter((item) => {
      if (this.queryFilter.descripcion && !item.descripcion.toUpperCase().includes(this.queryFilter.descripcion.toUpperCase())) return false;
      if (this.queryFilter.estado != null) {
        const activo = this.queryFilter.estado === 1;
        if (item.activo !== activo) return false;
      }
      return true;
    });

    this.totalItems = filtrados.length;
    const inicio = (this.page - 1) * this.pageSize;
    this.dataVariedades = filtrados.slice(inicio, inicio + this.pageSize);
  }

  private onGuardarModal(accion: AccionMantenimiento, descripcion: string) {
    if (accion === AccionMantenimiento.CREAR) {
      const nuevoId = this.todasVariedades.length > 0 ? Math.max(...this.todasVariedades.map((item) => item.idVariedad)) + 1 : 1;
      this.todasVariedades.unshift({ idVariedad: nuevoId, descripcion, activo: true });
    } else {
      const target = this.todasVariedades.find((item) => item.idVariedad === this.filaSeleccionada?.idVariedad);
      if (target) target.descripcion = descripcion;
    }

    this.page = 1;
    this.aplicarGrilla();
  }
}
