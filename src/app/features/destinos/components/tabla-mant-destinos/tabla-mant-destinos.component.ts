import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import {
  IChangePaginate,
  TableFooterPaginationComponent
} from '../../../../shared/components/agrihusa-table-footer/agrihusa-table-footer.component';
import { AgrihusaLoadingComponent } from '../../../../shared/components/agrihusa-loading/agrihusa-loading.component';
import { AgrihusaNoResultsComponent } from '../../../../shared/components/agrihusa-no-results/agrihusa-no-results.component';
import { Destino } from '../../models/destino.model';

@Component({
  selector: 'app-tabla-mant-destinos',
  standalone: true,
  imports: [
    CommonModule,
    AgrihusaLoadingComponent,
    AgrihusaNoResultsComponent,
    TableFooterPaginationComponent
  ],
  templateUrl:
    './tabla-mant-destinos.component.html'
})
export class TablaMantDestinosComponent {
  @Input() datasource: Destino[] = [];
  @Input() loading = false;
  @Input() totalItems = 0;
  @Input() page = 1;
  @Input() pageSize = 10;
  @Input() filaSeleccionada: Destino | null = null;

  @Output()
  seleccionar = new EventEmitter<Destino>();

  @Output()
  paginar = new EventEmitter<IChangePaginate>();

  onSeleccionarFila(destino: Destino): void {
    this.seleccionar.emit(destino);
  }

  onChangePaginate(
    event: IChangePaginate
  ): void {
    if (!this.totalItems) {
      return;
    }

    this.paginar.emit(event);
  }

  trackByDestinoId(
    _index: number,
    destino: Destino
  ): number {
    return destino.id;
  }

  get itemId(): number {
    return this.filaSeleccionada?.id ?? 0;
  }
}