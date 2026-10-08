import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { NavieraControllerService } from '../../api/api/services/naviera-controller.service';
import { MessageResponse } from '../../api/api/models/message-response';
import { NavieraRegistroRequest } from '../../api/api/models/naviera-registro-request';
import { PaginatedResult } from '../models/pagination.model';
import { Naviera, NavieraFormData, NavieraQuery } from '../models/naviera.model';

@Injectable({ providedIn: 'root' })
export class NavieraService {
  constructor(private readonly api: NavieraControllerService) {}

  listar(query: NavieraQuery): Observable<PaginatedResult<Naviera>> {
    return this.api.listarNavieras({
      texto: query.texto?.trim() || undefined,
      pais: query.pais?.trim() || undefined,
      activo: query.estado,
      pagina: query.page,
      tamPagina: query.pageSize
    }).pipe(map((response) => ({
      items: (response.datos ?? []).map((item) => ({
        id: item.navieraId ?? 0,
        codigo: item.codigo ?? '',
        nombre: item.nombre ?? '',
        pais: item.pais ?? '',
        contacto: item.contacto ?? '',
        correo: item.correo ?? '',
        telefono: item.telefono ?? '',
        sitioWeb: item.sitioWeb ?? '',
        activo: item.activo ?? true,
        fechaCreacion: '',
        fechaActualizacion: null
      })),
      totalItems: response.paginacion?.totalElementos ?? 0,
      page: response.paginacion?.numeroPagina ?? query.page,
      pageSize: response.paginacion?.tamanioPagina ?? query.pageSize
    })));
  }

  crear(data: NavieraFormData): Observable<MessageResponse> {
    return this.api.registrarNaviera({ body: this.request(data) });
  }

  actualizar(id: number, data: NavieraFormData): Observable<MessageResponse> {
    return this.api.actualizarNaviera({ body: this.request(data, id) });
  }

  cambiarEstado(id: number, activo: boolean): Observable<MessageResponse> {
    return this.api.cambiarEstadoNaviera({ navieraId: id, activo });
  }

  private request(data: NavieraFormData, navieraId = 0): NavieraRegistroRequest {
    return {
      navieraId,
      codigo: data.codigo.trim().toUpperCase().replace(/\s+/g, ''),
      nombre: data.nombre.trim().toUpperCase(),
      pais: data.pais.trim().toUpperCase(),
      contacto: data.contacto.trim(),
      correo: data.correo.trim().toLowerCase(),
      telefono: data.telefono.trim(),
      sitioWeb: data.sitioWeb.trim()
    };
  }
}
