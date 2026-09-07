import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { Producto } from '../../../productos/models/producto.model';
import {
  IChangePaginate,
  TableFooterPaginationComponent
} from '../../../../shared/components/agrihusa-table-footer/agrihusa-table-footer.component';
import { AgrihusaLoadingComponent } from '../../../../shared/components/agrihusa-loading/agrihusa-loading.component';
import { AgrihusaNoResultsComponent } from '../../../../shared/components/agrihusa-no-results/agrihusa-no-results.component';
import { Variedad } from '../../models/variedad.model';

@Component({
  selector: 'app-tabla-mant-variedades',
  standalone: true,
  imports: [
    CommonModule,
    AgrihusaLoadingComponent,
    AgrihusaNoResultsComponent,
    TableFooterPaginationComponent
  ],
  templateUrl:
    './tabla-mant-variedades.component.html'
})
export class TablaMantVariedadesComponent {
  @Input() datasource: Variedad[] = [];
  @Input() productos: Producto[] = [];
  @Input() loading = false;
  @Input() totalItems = 0;
  @Input() page = 1;
  @Input() pageSize = 10;
  @Input()
  filaSeleccionada: Variedad | null = null;

  @Output()
  seleccionar = new EventEmitter<Variedad>();

  @Output()
  paginar = new EventEmitter<IChangePaginate>();

  onSeleccionarFila(
    variedad: Variedad
  ): void {
    this.seleccionar.emit(variedad);
  }

  onChangePaginate(
    event: IChangePaginate
  ): void {
    if (!this.totalItems) {
      return;
    }

    this.paginar.emit(event);
  }

  obtenerNombreProducto(
    productoId: number
  ): string {
    return (
      this.productos.find(
        (producto) => producto.id === productoId
      )?.nombre ?? 'PRODUCTO NO DISPONIBLE'
    );
  }

  trackByVariedadId(
    _index: number,
    variedad: Variedad
  ): number {
    return variedad.id;
  }

  get itemId(): number {
    return this.filaSeleccionada?.id ?? 0;
  }
}