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
import { OperadorLogistico } from '../../models/operador-logistico.model';

@Component({
  selector: 'app-tabla-operadores-logisticos',
  standalone: true,
  imports: [
    CommonModule,
    AgrihusaLoadingComponent,
    AgrihusaNoResultsComponent,
    TableFooterPaginationComponent
  ],
  templateUrl:
    './tabla-operadores-logisticos.component.html'
})
export class TablaOperadoresLogisticosComponent {
  @Input() datasource: OperadorLogistico[] = [];
  @Input() loading = false;
  @Input() totalItems = 0;
  @Input() page = 1;
  @Input() pageSize = 10;
  @Input()
  filaSeleccionada: OperadorLogistico | null = null;

  @Output()
  seleccionar =
    new EventEmitter<OperadorLogistico>();

  @Output()
  paginar = new EventEmitter<IChangePaginate>();

  onSeleccionarFila(
    operador: OperadorLogistico
  ): void {
    this.seleccionar.emit(operador);
  }

  onChangePaginate(
    event: IChangePaginate
  ): void {
    if (!this.totalItems) {
      return;
    }

    this.paginar.emit(event);
  }

  trackByOperadorId(
    _index: number,
    operador: OperadorLogistico
  ): number {
    return operador.id;
  }

  get itemId(): number {
    return this.filaSeleccionada?.id ?? 0;
  }
}