import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AgrihusaTopBarComponent } from '../../../../shared/components/agrihusa-topbar/agrihusa-topbar.component';
import { AgrihusaButtonComponent } from '../../../../shared/components/agrihusa-button/agrihusa-button.component';
import { IChangePaginate } from '../../../../shared/components/agrihusa-table-footer/agrihusa-table-footer.component';
import { AccionMantenimiento } from '../../../../shared/enums/accion-mantenimiento.enum';
import { FiltroMantViasComponent } from '../../components/filtro-mant-vias/filtro-mant-vias.component';
import { ModalUpsertViaComponent } from '../../components/modal-upsert-via/modal-upsert-via.component';
import { TablaMantViasComponent } from '../../components/tabla-mant-vias/tabla-mant-vias.component';

export interface IQueryMantVia {
  descripcion?: string;
  estado?: number;
  page?: number;
  size?: number;
}

interface Via {
  idVia: number;
  descripcion: string;
  activo: boolean;
}

@Component({
  selector: 'app-mantenimiento-vias',
  standalone: true,
  imports: [
    CommonModule,
    AgrihusaTopBarComponent,
    AgrihusaButtonComponent,
    FiltroMantViasComponent,
    TablaMantViasComponent
  ],
  templateUrl: './mantenimiento-vias.component.html'
})
export class MantenimientoViasComponent implements OnInit {
  readonly AccionMantenimiento = AccionMantenimiento;

  getNombreMantenimiento = 'Mantenimiento de Vias';

  filaSeleccionada: any = null;
  dataVias: Via[] = [];
  loading = false;
  totalItems = 0;
  page = 1;
  pageSize = 10;

  private todasVias: Via[] = [];
  private queryFilter: IQueryMantVia = { page: 1, size: 10 };

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    this.todasVias = [
      { idVia: 1, descripcion: 'MARITIMA', activo: true },
      { idVia: 2, descripcion: 'AEREA', activo: true },
      { idVia: 3, descripcion: 'TERRESTRE', activo: true },
      { idVia: 4, descripcion: 'FERROVIARIA', activo: false },
      { idVia: 5, descripcion: 'FLUVIAL', activo: true }
    ];
    this.aplicarGrilla();
  }

  onBuscar(query: IQueryMantVia) {
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
    this.filaSeleccionada = this.filaSeleccionada?.idVia === item.idVia ? null : item;
  }

  onChangePaginate(event: IChangePaginate) {
    this.page = event.page;
    this.pageSize = event.pageSize;
    this.aplicarGrilla();
  }

  mostrarModalUpsert(accion: AccionMantenimiento) {
    const modalRef = this.modalService.open(ModalUpsertViaComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
      centered: true
    });

    modalRef.componentInstance.titleModal =
      accion === AccionMantenimiento.CREAR ? 'REGISTRAR VIA' : 'EDITAR VIA';
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

  eliminarVia() {
    const target = this.todasVias.find((item) => item.idVia === this.filaSeleccionada?.idVia);
    if (target) {
      target.activo = !target.activo;
    }
    this.aplicarGrilla();
  }

  private aplicarGrilla() {
    this.filaSeleccionada = null;

    const filtrados = this.todasVias.filter((item) => {
      if (this.queryFilter.descripcion && !item.descripcion.toUpperCase().includes(this.queryFilter.descripcion.toUpperCase())) {
        return false;
      }
      if (this.queryFilter.estado != null) {
        const activo = this.queryFilter.estado === 1;
        if (item.activo !== activo) return false;
      }
      return true;
    });

    this.totalItems = filtrados.length;
    const inicio = (this.page - 1) * this.pageSize;
    this.dataVias = filtrados.slice(inicio, inicio + this.pageSize);
  }

  private onGuardarModal(accion: AccionMantenimiento, descripcion: string) {
    if (accion === AccionMantenimiento.CREAR) {
      const nuevoId = this.todasVias.length > 0 ? Math.max(...this.todasVias.map((item) => item.idVia)) + 1 : 1;
      this.todasVias.unshift({ idVia: nuevoId, descripcion, activo: true });
    } else {
      const target = this.todasVias.find((item) => item.idVia === this.filaSeleccionada?.idVia);
      if (target) {
        target.descripcion = descripcion;
      }
    }

    this.page = 1;
    this.aplicarGrilla();
  }
}
