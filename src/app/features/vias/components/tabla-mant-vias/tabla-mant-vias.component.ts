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
import { Via } from '../../models/via.model';

@Component({
  selector: 'app-tabla-mant-vias',
  standalone: true,
  imports: [
    CommonModule,
    AgrihusaLoadingComponent,
    AgrihusaNoResultsComponent,
    TableFooterPaginationComponent
  ],
  templateUrl:
    './tabla-mant-vias.component.html'
})
export class TablaMantViasComponent {
  @Input() datasource: Via[] = [];
  @Input() loading = false;
  @Input() totalItems = 0;
  @Input() page = 1;
  @Input() pageSize = 10;
  @Input()
  filaSeleccionada: Via | null = null;

  @Output()
  seleccionar = new EventEmitter<Via>();

  @Output()
  paginar = new EventEmitter<IChangePaginate>();

  onSeleccionarFila(
    via: Via
  ): void {
    this.seleccionar.emit(via);
  }

  onChangePaginate(
    event: IChangePaginate
  ): void {
    if (!this.totalItems) {
      return;
    }

    this.paginar.emit(event);
  }

  trackByViaId(
    _index: number,
    via: Via
  ): number {
    return via.id;
  }

  get itemId(): number {
    return this.filaSeleccionada?.id ?? 0;
  }
}