import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { VariedadControllerService } from '../../api/api/services/variedad-controller.service';
import { MessageResponse } from '../../api/api/models/message-response';
import { VariedadRegistroRequest } from '../../api/api/models/variedad-registro-request';
import { PaginatedResult } from '../models/pagination.model';
import { Variedad, VariedadFormData, VariedadQuery } from '../../features/variedades/models/variedad.model';
@Injectable({ providedIn: 'root' })
export class VariedadService {
  constructor(private readonly api: VariedadControllerService) {}
  listar(query: VariedadQuery): Observable<PaginatedResult<Variedad>> { return this.api.listarVariedades({ texto: query.texto?.trim() || undefined, productoId: query.productoId, activo: query.estado, pagina: query.page, tamPagina: query.pageSize }).pipe(map((response) => ({ items: (response.datos ?? []).map((item) => ({ id: item.variedadId ?? 0, productoId: item.productoId ?? 0, nombre: item.nombre ?? '', activo: item.activo ?? true, fechaCreacion: '', fechaActualizacion: null })), totalItems: response.paginacion?.totalElementos ?? 0, page: response.paginacion?.numeroPagina ?? query.page, pageSize: response.paginacion?.tamanioPagina ?? query.pageSize })));
  }
  crear(data: VariedadFormData): Observable<MessageResponse> { return this.api.registrar1({ body: this.request(data) }); }
  actualizar(id: number, data: VariedadFormData): Observable<MessageResponse> { return this.api.actualizar1({ body: this.request(data, id) }); }
  cambiarEstado(id: number, activo: boolean): Observable<MessageResponse> { return this.api.cambiarEstado1({ variedadId: id, activo }); }
  private request(data: VariedadFormData, variedadId = 0): VariedadRegistroRequest { return { variedadId, productoId: data.productoId, nombre: data.nombre.trim().toUpperCase() }; }
}