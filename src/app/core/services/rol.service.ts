import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { RolControllerService } from '../../api/api/services/rol-controller.service';
import { MessageResponse } from '../../api/api/models/message-response';
import { RolRegistroRequest } from '../../api/api/models/rol-registro-request';
import { PaginatedResult } from '../models/pagination.model';
import { AccionPermiso, ModuloSistema } from '../models/permiso.model';
import { Rol, RolFormData, RolQuery } from '../models/rol.model';

@Injectable({ providedIn: 'root' })
export class RolService {
  constructor(private readonly api: RolControllerService) {}

  listar(query: RolQuery): Observable<PaginatedResult<Rol>> {
    return this.api.listarRoles({
      nombre: query.nombre?.trim() || undefined,
      activo: query.estado,
      pagina: query.page,
      tamPagina: query.pageSize
    }).pipe(
      map((response) => ({
        items: (response.datos ?? []).map((item) => ({
          id: item.rolId ?? 0,
          nombre: item.nombre ?? '',
          descripcion: item.descripcion ?? '',
          esSistema: item.esSistema ?? false,
          cantidadPermisos: item.cantidadPermisos ?? 0,
          permisos: []
          ,activo: item.activo ?? true
          ,fechaCreacion: ''
          ,fechaActualizacion: null
        })),
        totalItems: response.paginacion?.totalElementos ?? 0,
        page: response.paginacion?.numeroPagina ?? query.page,
        pageSize: response.paginacion?.tamanioPagina ?? query.pageSize
      }))
    );
  }

  crear(data: RolFormData): Observable<MessageResponse> {
    return this.api.registrarRol({ body: this.request(data) });
  }

  actualizar(id: number, data: RolFormData): Observable<MessageResponse> {
    return this.api.actualizarRol({ body: this.request(data, id) });
  }

  cambiarEstado(id: number, activo: boolean): Observable<MessageResponse> {
    return this.api.cambiarEstadoRol({ rolId: id, activo });
  }

  obtenerPorId(id: number, base?: Rol): Observable<Rol> {
    return this.api.obtenerRol({ rolId: id }).pipe(
      map((response) => ({
        id,
        nombre: response.nombre ?? base?.nombre ?? '',
        descripcion: response.descripcion ?? base?.descripcion ?? '',
        esSistema: base?.esSistema ?? id === 1,
        cantidadPermisos: base?.cantidadPermisos ?? response.permisos?.length ?? 0,
        permisos: (response.permisos ?? []).map((permiso) => ({
          modulo: permiso.modulo as ModuloSistema,
          acciones: (permiso.acciones ?? []).map((accion) => accion as AccionPermiso)
        })),
        activo: base?.activo ?? true,
        fechaCreacion: base?.fechaCreacion ?? '',
        fechaActualizacion: base?.fechaActualizacion ?? null
      }))
    );
  }

  private request(data: RolFormData, rolId = 0): RolRegistroRequest {
    return {
      rolId,
      nombre: data.nombre.trim(),
      descripcion: data.descripcion.trim(),
      permisos: data.permisos.map((permiso) => ({
        modulo: permiso.modulo,
        acciones: permiso.acciones
      }))
    };
  }
}
