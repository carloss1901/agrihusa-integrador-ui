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
import { Situacion } from '../../models/situacion.model';

@Component({
  selector: 'app-tabla-situaciones',
  standalone: true,
  imports: [
    CommonModule,
    AgrihusaLoadingComponent,
    AgrihusaNoResultsComponent,
    TableFooterPaginationComponent
  ],
  templateUrl:
    './tabla-situaciones.component.html'
})
export class TablaSituacionesComponent {
  @Input() datasource: Situacion[] = [];
  @Input() loading = false;
  @Input() totalItems = 0;
  @Input() page = 1;
  @Input() pageSize = 10;
  @Input()
  filaSeleccionada: Situacion | null = null;

  @Output()
  seleccionar = new EventEmitter<Situacion>();

  @Output()
  paginar = new EventEmitter<IChangePaginate>();

  onSeleccionarFila(
    situacion: Situacion
  ): void {
    this.seleccionar.emit(situacion);
  }

  onChangePaginate(
    event: IChangePaginate
  ): void {
    if (!this.totalItems) {
      return;
    }

    this.paginar.emit(event);
  }

  trackBySituacionId(
    _index: number,
    situacion: Situacion
  ): number {
    return situacion.id;
  }

  get itemId(): number {
    return this.filaSeleccionada?.id ?? 0;
  }
}