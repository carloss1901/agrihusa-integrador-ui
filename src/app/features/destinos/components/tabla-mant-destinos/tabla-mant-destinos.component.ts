import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AgrihusaLoadingComponent } from '../../../../shared/components/agrihusa-loading/agrihusa-loading.component';
import { AgrihusaNoResultsComponent } from '../../../../shared/components/agrihusa-no-results/agrihusa-no-results.component';
import { TableFooterPaginationComponent, IChangePaginate } from '../../../../shared/components/agrihusa-table-footer/agrihusa-table-footer.component';

interface Destino {
  idDestino: number;
  pais: string;
  ciudad: string;
  activo: boolean;
}

@Component({
  selector: 'app-tabla-mant-destinos',
  standalone: true,
  imports: [
    CommonModule,
    AgrihusaLoadingComponent,
    AgrihusaNoResultsComponent,
    TableFooterPaginationComponent
  ],
  templateUrl: './tabla-mant-destinos.component.html'
})
export class TablaMantDestinosComponent {
  @Input() datasource: Destino[] = [];
  @Input() loading = false;
  @Input() totalItems = 0;
  @Input() page = 1;
  @Input() pageSize = 10;
  @Input() filaSeleccionada: any | null = null;

  @Output() seleccionar = new EventEmitter<any>();
  @Output() paginar = new EventEmitter<IChangePaginate>();

  onSeleccionarFila(fila: any) {
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
    return this.filaSeleccionada?.idDestino ?? 0;
  }
}
