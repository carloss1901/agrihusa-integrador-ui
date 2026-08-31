import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AgrihusaLoadingComponent } from '../../../../shared/components/agrihusa-loading/agrihusa-loading.component';
import { AgrihusaNoResultsComponent } from '../../../../shared/components/agrihusa-no-results/agrihusa-no-results.component';
import { IChangePaginate, TableFooterPaginationComponent } from '../../../../shared/components/agrihusa-table-footer/agrihusa-table-footer.component';

interface PuertoLlegada {
  idPuertoLlegada: number;
  pais: string;
  puerto: string;
  activo: boolean;
}

@Component({
  selector: 'app-tabla-mant-puertos-llegada',
  standalone: true,
  imports: [CommonModule, AgrihusaLoadingComponent, AgrihusaNoResultsComponent, TableFooterPaginationComponent],
  templateUrl: './tabla-mant-puertos-llegada.component.html'
})
export class TablaMantPuertosLlegadaComponent {
  @Input() datasource: PuertoLlegada[] = [];
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
    if (pageSize !== this.pageSize && page > 1) return;
    this.paginar.emit(event);
  }

  get itemId() {
    return this.filaSeleccionada?.idPuertoLlegada ?? 0;
  }
}
