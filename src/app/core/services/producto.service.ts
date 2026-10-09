import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ProductoControllerService } from '../../api/api/services/producto-controller.service';
import { MessageResponse } from '../../api/api/models/message-response';
import { ProductoRegistroRequest } from '../../api/api/models/producto-registro-request';
import { PaginatedResult } from '../models/pagination.model';
import { Producto, ProductoFormData, ProductoQuery } from '../../features/productos/models/producto.model';
@Injectable({ providedIn: 'root' })
export class ProductoService {
  constructor(private readonly api: ProductoControllerService) {}
  listar(query: ProductoQuery): Observable<PaginatedResult<Producto>> { return this.api.listarProductos({ texto: query.texto?.trim() || undefined, activo: query.estado, pagina: query.page, tamPagina: query.pageSize }).pipe(map((response) => ({ items: (response.datos ?? []).map((item) => ({ id: item.productoId ?? 0, codigo: item.codigo ?? '', nombre: item.nombre ?? '', descripcion: item.descripcion ?? '', activo: item.activo ?? true, fechaCreacion: '', fechaActualizacion: null })), totalItems: response.paginacion?.totalElementos ?? 0, page: response.paginacion?.numeroPagina ?? query.page, pageSize: response.paginacion?.tamanioPagina ?? query.pageSize })));
  }
  crear(data: ProductoFormData): Observable<MessageResponse> { return this.api.registrarProducto({ body: this.request(data) }); }
  actualizar(id: number, data: ProductoFormData): Observable<MessageResponse> { return this.api.actualizarProducto({ body: this.request(data, id) }); }
  cambiarEstado(id: number, activo: boolean): Observable<MessageResponse> { return this.api.cambiarEstadoProducto({ productoId: id, activo }); }
  private request(data: ProductoFormData, productoId = 0): ProductoRegistroRequest { return { productoId, codigo: data.codigo.trim().toUpperCase(), nombre: data.nombre.trim().toUpperCase(), descripcion: data.descripcion.trim() }; }
}
