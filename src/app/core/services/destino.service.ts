import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { DestinoControllerService } from '../../api/api/services/destino-controller.service';
import { DestinoRegistroRequest } from '../../api/api/models/destino-registro-request';
import { DestinoResponse } from '../../api/api/models/destino-response';
import { MessageResponse } from '../../api/api/models/message-response';
import { PaginatedResult } from '../models/pagination.model';
import {
  Destino,
  DestinoFormData,
  DestinoQuery
} from '../models/destino.model';

@Injectable({ providedIn: 'root' })
export class DestinoService {
  constructor(private readonly api: DestinoControllerService) {}

  listar(query: DestinoQuery): Observable<PaginatedResult<Destino>> {
    return this.api.listarDestinos({
      pais: query.pais?.trim() || undefined,
      ciudad: query.texto?.trim() || undefined,
      activo: query.estado,
      pagina: query.page,
      tamPagina: query.pageSize
    }).pipe(map((response) => ({
        items: (response.datos ?? []).map((item) => this.map(item)),
        totalItems: response.paginacion?.totalElementos ?? 0,
        page: response.paginacion?.numeroPagina ?? query.page,
        pageSize: response.paginacion?.tamanioPagina ?? query.pageSize
    })));
  }

  listarActivos(): Observable<Destino[]> {
    return this.listar({ page: 1, pageSize: 1000, estado: true })
      .pipe(map((response) => response.items));
  }

  crear(data: DestinoFormData): Observable<MessageResponse> {
    return this.api.registrarDestino({ body: this.request(data) });
  }

  actualizar(id: number, data: DestinoFormData): Observable<MessageResponse> {
    return this.api.actualizarDestino({ body: this.request(data, id) });
  }

  cambiarEstado(id: number, activo: boolean): Observable<MessageResponse> {
    return this.api.cambiarEstadoDestino({ destinoId: id, activo });
  }

  private request(data: DestinoFormData, destinoId = 0): DestinoRegistroRequest {
    return {
      destinoId,
      pais: data.pais.trim().toUpperCase(),
      ciudad: data.ciudad.trim().toUpperCase()
    };
  }

  private map(item: DestinoResponse, data?: DestinoFormData, id = 0): Destino {
    return {
      id: item.destinoId ?? id,
      pais: item.pais ?? data?.pais.trim().toUpperCase() ?? '',
      ciudad: item.ciudad ?? data?.ciudad.trim().toUpperCase() ?? '',
      activo: item.activo ?? true,
      fechaCreacion: '',
      fechaActualizacion: null
    };
  }

}
