import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AgrihusaLoadingComponent } from '../../../../../shared/components/agrihusa-loading/agrihusa-loading.component';
import { AgrihusaNoResultsComponent } from '../../../../../shared/components/agrihusa-no-results/agrihusa-no-results.component';
import {
  IChangePaginate,
  TableFooterPaginationComponent
} from '../../../../../shared/components/agrihusa-table-footer/agrihusa-table-footer.component';
import { MaestroFieldConfig, MaestroItem } from '../../models/mantenimiento-maestro.model';

@Component({
  selector: 'app-tabla-mantenimiento-maestro',
  standalone: true,
  imports: [
    CommonModule,
    AgrihusaLoadingComponent,
    AgrihusaNoResultsComponent,
    TableFooterPaginationComponent
  ],
  templateUrl: './tabla-mantenimiento-maestro.component.html'
})
export class TablaMantenimientoMaestroComponent {
  @Input() datasource: MaestroItem[] = [];
  @Input() fields: MaestroFieldConfig[] = [];
  @Input() caption = '';
  @Input() loading = false;
  @Input() totalItems = 0;
  @Input() page = 1;
  @Input() pageSize = 10;
  @Input() filaSeleccionada: MaestroItem | null = null;

  @Output() seleccionar = new EventEmitter<MaestroItem>();
  @Output() paginar = new EventEmitter<IChangePaginate>();

  onSeleccionarFila(fila: MaestroItem) {
    this.seleccionar.emit(fila);
  }

  onChangePaginate(event: IChangePaginate) {
    if (!this.totalItems) return;
    const { page, pageSize } = event;
    if (pageSize !== this.pageSize && page > 1) {
      return;
    }
    this.paginar.emit(event);
  }

  get itemId() {
    return this.filaSeleccionada?.id ?? 0;
  }
}
