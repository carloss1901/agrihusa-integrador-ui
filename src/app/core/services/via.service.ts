import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ViaControllerService } from '../../api/api/services/via-controller.service';
import { MessageResponse } from '../../api/api/models/message-response';
import { ViaRegistroRequest } from '../../api/api/models/via-registro-request';
import { PaginatedResult } from '../models/pagination.model';
import {
  Via,
  ViaFormData,
  ViaQuery
} from '../models/via.model';

@Injectable({ providedIn: 'root' })
export class ViaService {
  constructor(private readonly api: ViaControllerService) {}

  listar(query: ViaQuery): Observable<PaginatedResult<Via>> {
    return this.api.listarVias({
      descripcion: query.texto?.trim() || undefined,
      activo: query.estado,
      pagina: query.page,
      tamPagina: query.pageSize
    }).pipe(map((response) => ({
      items: (response.datos ?? []).map((item) => ({
        id: item.viaId ?? 0,
        descripcion: item.descripcion ?? '',
        activo: item.activo ?? true,
        fechaCreacion: '',
        fechaActualizacion: null
      })),
      totalItems: response.paginacion?.totalElementos ?? 0,
      page: response.paginacion?.numeroPagina ?? query.page,
      pageSize: response.paginacion?.tamanioPagina ?? query.pageSize
    })));
  }

  crear(data: ViaFormData): Observable<MessageResponse> {
    return this.api.registrarVia({ body: this.request(data) });
  }

  actualizar(id: number, data: ViaFormData): Observable<MessageResponse> {
    return this.api.actualizarVia({ body: this.request(data, id) });
  }

  cambiarEstado(id: number, activo: boolean): Observable<MessageResponse> {
    return this.api.cambiarEstadoVia({ viaId: id, activo });
  }

  private request(data: ViaFormData, viaId = 0): ViaRegistroRequest {
    return {
      viaId,
      descripcion: data.descripcion.trim().toUpperCase()
    };
  }
}
