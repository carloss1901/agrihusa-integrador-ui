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
import { ReporteDespachoItem } from '../../models/reporte-despacho.model';

@Component({
  selector: 'app-tabla-reporte-despacho',
  standalone: true,
  imports: [
    CommonModule,
    AgrihusaLoadingComponent,
    AgrihusaNoResultsComponent,
    TableFooterPaginationComponent
  ],
  templateUrl:
    './tabla-reporte-despacho.component.html',
  styleUrls: [
    './tabla-reporte-despacho.component.scss'
  ]
})
export class TablaReporteDespachoComponent {
  @Input() datasource: ReporteDespachoItem[] = [];
  @Input() loading = false;
  @Input() totalItems = 0;
  @Input() page = 1;
  @Input() pageSize = 10;

  @Output()
  paginar = new EventEmitter<IChangePaginate>();

  onChangePaginate(
    event: IChangePaginate
  ): void {
    if (!this.totalItems) {
      return;
    }

    this.paginar.emit(event);
  }

  formatearFecha(
    fecha: string
  ): string {
    return new Date(
      `${fecha}T00:00:00`
    ).toLocaleDateString('es-PE');
  }

  obtenerClaseSituacion(
    situacion: string
  ): string {
    const valor = situacion
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase();

    switch (valor) {
      case 'PROGRAMADO':
        return 'situacion-programado';

      case 'EN PREPARACION':
        return 'situacion-preparacion';

      case 'DESPACHADO':
        return 'situacion-despachado';

      case 'EN TRANSITO':
        return 'situacion-transito';

      case 'ENTREGADO':
        return 'situacion-entregado';

      case 'CANCELADO':
        return 'situacion-cancelado';

      case 'OBSERVADO':
        return 'situacion-observado';

      default:
        return 'situacion-default';
    }
  }

  trackByReporteId(
    _index: number,
    item: ReporteDespachoItem
  ): number {
    return item.id;
  }
}