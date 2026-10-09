import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { PuertoLlegadaControllerService } from '../../api/api/services/puerto-llegada-controller.service';
import { MessageResponse } from '../../api/api/models/message-response';
import { PuertoLlegadaRegistroRequest } from '../../api/api/models/puerto-llegada-registro-request';
import { PaginatedResult } from '../models/pagination.model';
import { PuertoLlegada, PuertoLlegadaFormData, PuertoLlegadaQuery } from '../models/puerto-llegada.model';
@Injectable({ providedIn: 'root' })
export class PuertoLlegadaService {
  constructor(private readonly api: PuertoLlegadaControllerService) {}
  listar(query: PuertoLlegadaQuery): Observable<PaginatedResult<PuertoLlegada>> {
    return this.api.listarPuertos({ texto: query.texto?.trim() || undefined, pais: query.pais?.trim() || undefined, activo: query.estado, pagina: query.page, tamPagina: query.pageSize }).pipe(map((response) => ({ items: (response.datos ?? []).map((item) => ({ id: item.puertoLlegadaId ?? 0, codigo: item.codigo ?? '', puerto: item.puerto ?? '', pais: item.pais ?? '', activo: item.activo ?? true, fechaCreacion: '', fechaActualizacion: null })), totalItems: response.paginacion?.totalElementos ?? 0, page: response.paginacion?.numeroPagina ?? query.page, pageSize: response.paginacion?.tamanioPagina ?? query.pageSize })));
  }
  crear(data: PuertoLlegadaFormData): Observable<MessageResponse> { return this.api.registrarPuertoLlegada({ body: this.request(data) }); }
  actualizar(id: number, data: PuertoLlegadaFormData): Observable<MessageResponse> { return this.api.actualizarPuertoLlegada({ body: this.request(data, id) }); }
  cambiarEstado(id: number, activo: boolean): Observable<MessageResponse> { return this.api.cambiarEstadoPuertoLlegada({ puertoLlegadaId: id, activo }); }
  private request(data: PuertoLlegadaFormData, puertoLlegadaId = 0): PuertoLlegadaRegistroRequest { return { puertoLlegadaId, codigo: data.codigo.trim().toUpperCase(), puerto: data.puerto.trim().toUpperCase(), pais: data.pais.trim().toUpperCase() }; }
}
