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
import { PuertoLlegada } from '../../models/puerto-llegada.model';

@Component({
  selector: 'app-tabla-mant-puertos-llegada',
  standalone: true,
  imports: [
    CommonModule,
    AgrihusaLoadingComponent,
    AgrihusaNoResultsComponent,
    TableFooterPaginationComponent
  ],
  templateUrl:
    './tabla-mant-puertos-llegada.component.html'
})
export class TablaMantPuertosLlegadaComponent {
  @Input() datasource: PuertoLlegada[] = [];
  @Input() loading = false;
  @Input() totalItems = 0;
  @Input() page = 1;
  @Input() pageSize = 10;
  @Input()
  filaSeleccionada: PuertoLlegada | null = null;

  @Output()
  seleccionar = new EventEmitter<PuertoLlegada>();

  @Output()
  paginar = new EventEmitter<IChangePaginate>();

  onSeleccionarFila(
    puerto: PuertoLlegada
  ): void {
    this.seleccionar.emit(puerto);
  }

  onChangePaginate(
    event: IChangePaginate
  ): void {
    if (!this.totalItems) {
      return;
    }

    this.paginar.emit(event);
  }

  trackByPuertoId(
    _index: number,
    puerto: PuertoLlegada
  ): number {
    return puerto.id;
  }

  get itemId(): number {
    return this.filaSeleccionada?.id ?? 0;
  }
}