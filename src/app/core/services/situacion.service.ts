import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { SituacionControllerService } from '../../api/api/services/situacion-controller.service';
import { MessageResponse } from '../../api/api/models/message-response';
import { SituacionRegistroRequest } from '../../api/api/models/situacion-registro-request';
import { PaginatedResult } from '../models/pagination.model';
import { Situacion, SituacionFormData, SituacionQuery } from '../models/situacion.model';

@Injectable({ providedIn: 'root' })
export class SituacionService {
  constructor(private readonly api: SituacionControllerService) {}

  listar(query: SituacionQuery): Observable<PaginatedResult<Situacion>> {
    return this.api.listarSituaciones({ descripcion: query.texto?.trim() || undefined, activo: query.estado, pagina: query.page, tamPagina: query.pageSize }).pipe(
      map((response) => ({
        items: (response.datos ?? []).map((item) => ({ id: item.situacionId ?? 0, descripcion: item.descripcion ?? '', activo: item.activo ?? true, fechaCreacion: '', fechaActualizacion: null })),
        totalItems: response.paginacion?.totalElementos ?? 0,
        page: response.paginacion?.numeroPagina ?? query.page,
        pageSize: response.paginacion?.tamanioPagina ?? query.pageSize
      }))
    );
  }

  crear(data: SituacionFormData): Observable<MessageResponse> {
    return this.api.registrarSituacion({ body: this.request(data) });
  }

  actualizar(id: number, data: SituacionFormData): Observable<MessageResponse> {
    return this.api.actualizarSituacion({ body: this.request(data, id) });
  }

  cambiarEstado(id: number, activo = true): Observable<MessageResponse> {
    return this.api.cambiarEstadoSituacion({ situacionId: id, activo });
  }

  private request(data: SituacionFormData, situacionId = 0): SituacionRegistroRequest {
    return { situacionId, descripcion: data.descripcion.trim() };
  }

}
