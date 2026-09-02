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
import { Naviera } from '../../models/naviera.model';

@Component({
  selector: 'app-tabla-mant-navieras',
  standalone: true,
  imports: [
    CommonModule,
    AgrihusaLoadingComponent,
    AgrihusaNoResultsComponent,
    TableFooterPaginationComponent
  ],
  templateUrl:
    './tabla-mant-navieras.component.html'
})
export class TablaMantNavierasComponent {
  @Input() datasource: Naviera[] = [];
  @Input() loading = false;
  @Input() totalItems = 0;
  @Input() page = 1;
  @Input() pageSize = 10;
  @Input() filaSeleccionada: Naviera | null = null;

  @Output()
  seleccionar = new EventEmitter<Naviera>();

  @Output()
  paginar = new EventEmitter<IChangePaginate>();

  onSeleccionarFila(naviera: Naviera): void {
    this.seleccionar.emit(naviera);
  }

  onChangePaginate(
    event: IChangePaginate
  ): void {
    if (!this.totalItems) {
      return;
    }

    this.paginar.emit(event);
  }

  trackByNavieraId(
    _index: number,
    naviera: Naviera
  ): number {
    return naviera.id;
  }

  get itemId(): number {
    return this.filaSeleccionada?.id ?? 0;
  }
}