import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AgrihusaButtonComponent } from '../../../../../shared/components/agrihusa-button/agrihusa-button.component';
import {
  AgrihusaTopBarComponent
} from '../../../../../shared/components/agrihusa-topbar/agrihusa-topbar.component';
import {
  IChangePaginate
} from '../../../../../shared/components/agrihusa-table-footer/agrihusa-table-footer.component';
import { AccionMantenimiento } from '../../../../../shared/enums/accion-mantenimiento.enum';
import {
  MantenimientoMaestroConfig,
  MaestroItem,
  MaestroQuery
} from '../../models/mantenimiento-maestro.model';
import { FiltroMantenimientoMaestroComponent } from '../filtro-mantenimiento-maestro/filtro-mantenimiento-maestro.component';
import { ModalUpsertMaestroComponent } from '../modal-upsert-maestro/modal-upsert-maestro.component';
import { TablaMantenimientoMaestroComponent } from '../tabla-mantenimiento-maestro/tabla-mantenimiento-maestro.component';

@Component({
  selector: 'app-mantenimiento-maestro',
  standalone: true,
  imports: [
    CommonModule,
    AgrihusaTopBarComponent,
    AgrihusaButtonComponent,
    FiltroMantenimientoMaestroComponent,
    TablaMantenimientoMaestroComponent
  ],
  templateUrl: './mantenimiento-maestro.component.html'
})
export class MantenimientoMaestroComponent implements OnInit {
  readonly AccionMantenimiento = AccionMantenimiento;

  @Input({ required: true }) config!: MantenimientoMaestroConfig;

  filaSeleccionada: MaestroItem | null = null;
  datasource: MaestroItem[] = [];
  loading = false;
  totalItems = 0;
  page = 1;
  pageSize = 10;

  private allItems: MaestroItem[] = [];
  private queryFilter: MaestroQuery = { page: 1, size: 10 };

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    this.allItems = this.config.mockData.map((item) => ({ ...item }));
    this.aplicarGrilla();
  }

  onBuscar(query: MaestroQuery) {
    this.queryFilter = { ...query, page: 1, size: this.pageSize };
    this.page = 1;
    this.aplicarGrilla();
  }

  onLimpiarFiltro() {
    this.queryFilter = { page: 1, size: this.pageSize };
    this.page = 1;
    this.aplicarGrilla();
  }

  onSeleccionarItem(item: MaestroItem) {
    if (this.filaSeleccionada?.id === item.id) {
      this.filaSeleccionada = null;
    } else {
      this.filaSeleccionada = item;
    }
  }

  onChangePaginate(event: IChangePaginate) {
    this.page = event.page;
    this.pageSize = event.pageSize;
    this.aplicarGrilla();
  }

  mostrarModalUpsert(accion: AccionMantenimiento) {
    const modalRef = this.modalService.open(ModalUpsertMaestroComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
      centered: true
    });

    modalRef.componentInstance.titleModal =
      accion === AccionMantenimiento.CREAR
        ? `REGISTRAR ${this.config.entidadSingular.toUpperCase()}`
        : `EDITAR ${this.config.entidadSingular.toUpperCase()}`;
    modalRef.componentInstance.accion = accion;
    modalRef.componentInstance.data =
      accion === AccionMantenimiento.ACTUALIZAR ? this.filaSeleccionada : null;
    modalRef.componentInstance.fields = this.config.fields;

    modalRef.result
      .then((result: { accion: AccionMantenimiento; values: Record<string, string | number> }) => {
        if (result) {
          this.onGuardarModal(result.accion, result.values);
        }
      })
      .catch(() => {});
  }

  eliminar() {
    const fila = this.filaSeleccionada;
    if (!fila) return;

    const target = this.allItems.find((item) => item.id === fila.id);
    if (target) {
      target.activo = !target.activo;
    }
    this.aplicarGrilla();
  }

  private aplicarGrilla() {
    this.filaSeleccionada = null;

    const filtrados = this.allItems.filter((item) => {
      if (this.queryFilter.estado != null) {
        const activo = this.queryFilter.estado === 1;
        if (item.activo !== activo) return false;
      }

      return this.config.fields.every((field) => {
        const queryValue = this.queryFilter[field.key];
        if (queryValue == null || queryValue === '') return true;

        const itemValue = String(item[field.key] ?? '').toUpperCase();
        const normalizedQuery = String(queryValue).toUpperCase();

        if (field.options) {
          return itemValue === normalizedQuery;
        }

        return itemValue.includes(normalizedQuery);
      });
    });

    this.totalItems = filtrados.length;
    const inicio = (this.page - 1) * this.pageSize;
    this.datasource = filtrados.slice(inicio, inicio + this.pageSize);
  }

  private onGuardarModal(
    accion: AccionMantenimiento,
    values: Record<string, string | number>
  ) {
    if (accion === AccionMantenimiento.CREAR) {
      const nuevoId =
        this.allItems.length > 0
          ? Math.max(...this.allItems.map((item) => item.id)) + 1
          : 1;

      this.allItems.unshift({
        id: nuevoId,
        activo: true,
        ...values
      });
    } else {
      const target = this.allItems.find((item) => item.id === this.filaSeleccionada?.id);
      if (target) {
        Object.assign(target, values);
      }
    }

    this.page = 1;
    this.aplicarGrilla();
  }
}
