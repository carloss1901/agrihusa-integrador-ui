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
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-tabla-productos',
  standalone: true,
  imports: [
    CommonModule,
    AgrihusaLoadingComponent,
    AgrihusaNoResultsComponent,
    TableFooterPaginationComponent
  ],
  templateUrl: './tabla-productos.component.html'
})
export class TablaProductosComponent {
  @Input() datasource: Producto[] = [];
  @Input() loading = false;
  @Input() totalItems = 0;
  @Input() page = 1;
  @Input() pageSize = 10;
  @Input()
  filaSeleccionada: Producto | null = null;

  @Output()
  seleccionar = new EventEmitter<Producto>();

  @Output()
  paginar = new EventEmitter<IChangePaginate>();

  onSeleccionarFila(
    producto: Producto
  ): void {
    this.seleccionar.emit(producto);
  }

  onChangePaginate(
    event: IChangePaginate
  ): void {
    if (!this.totalItems) {
      return;
    }

    this.paginar.emit(event);
  }

  trackByProductoId(
    _index: number,
    producto: Producto
  ): number {
    return producto.id;
  }

  get itemId(): number {
    return this.filaSeleccionada?.id ?? 0;
  }
}