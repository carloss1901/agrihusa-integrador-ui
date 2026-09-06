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
import { Cliente } from '../../../clientes/models/cliente.model';
import { Destino } from '../../../destinos/models/destino.model';
import { Producto } from '../../../productos/models/producto.model';
import { Situacion } from '../../../situaciones/models/situacion.model';
import { Variedad } from '../../../variedades/models/variedad.model';
import { Despacho } from '../../models/despacho.model';

@Component({
  selector: 'app-tabla-despachos',
  standalone: true,
  imports: [
    CommonModule,
    AgrihusaLoadingComponent,
    AgrihusaNoResultsComponent,
    TableFooterPaginationComponent
  ],
  templateUrl:
  './tabla-despachos.component.html',
styleUrls: [
  './tabla-despachos.component.scss'
]
})
export class TablaDespachosComponent {
  @Input() datasource: Despacho[] = [];
  @Input() clientes: Cliente[] = [];
  @Input() destinos: Destino[] = [];
  @Input() productos: Producto[] = [];
  @Input() variedades: Variedad[] = [];
  @Input() situaciones: Situacion[] = [];
  @Input() loading = false;
  @Input() totalItems = 0;
  @Input() page = 1;
  @Input() pageSize = 10;
  @Input()
  filaSeleccionada: Despacho | null = null;

  @Output()
  seleccionar = new EventEmitter<Despacho>();

  @Output()
  paginar = new EventEmitter<IChangePaginate>();

  onSeleccionarFila(
    despacho: Despacho
  ): void {
    this.seleccionar.emit(despacho);
  }

  onChangePaginate(
    event: IChangePaginate
  ): void {
    if (!this.totalItems) {
      return;
    }

    this.paginar.emit(event);
  }

  obtenerNombreCliente(
    clienteId: number
  ): string {
    const cliente = this.clientes.find(
      (item) => item.id === clienteId
    );

    return (
      cliente?.nombreComercial ||
      cliente?.razonSocial ||
      'CLIENTE NO DISPONIBLE'
    );
  }

  obtenerNombreProducto(
    productoId: number
  ): string {
    return (
      this.productos.find(
        (item) => item.id === productoId
      )?.nombre ?? 'PRODUCTO NO DISPONIBLE'
    );
  }

  obtenerNombreVariedad(
    variedadId: number
  ): string {
    return (
      this.variedades.find(
        (item) => item.id === variedadId
      )?.nombre ?? 'VARIEDAD NO DISPONIBLE'
    );
  }

  obtenerNombreDestino(
    destinoId: number
  ): string {
    const destino = this.destinos.find(
      (item) => item.id === destinoId
    );

    return destino
      ? `${destino.ciudad}, ${destino.pais}`
      : 'DESTINO NO DISPONIBLE';
  }

  obtenerNombreSituacion(
    situacionId: number
  ): string {
    return (
      this.situaciones.find(
        (item) => item.id === situacionId
      )?.descripcion ?? 'NO DISPONIBLE'
    );
  }

  formatearFecha(
    fecha: string
  ): string {
    return new Date(
      `${fecha}T00:00:00`
    ).toLocaleDateString('es-PE');
  }

  trackByDespachoId(
    _index: number,
    despacho: Despacho
  ): number {
    return despacho.id;
  }

  get itemId(): number {
    return this.filaSeleccionada?.id ?? 0;
  }

  obtenerClaseSituacion(
  situacionId: number
): string {
  const descripcion =
    this.obtenerNombreSituacion(situacionId)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase();

  switch (descripcion) {
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
}