import { Injectable } from '@angular/core';
import { Observable, map, of, switchMap } from 'rxjs';

import { MessageResponse } from '../../api/api/models/message-response';
import { CustomPageUsuarioResponse } from '../../api/api/models/custom-page-usuario-response';
import { UsuarioResponse } from '../../api/api/models/usuario-response';
import { UsuarioRegistroRequest } from '../../api/api/models/usuario-registro-request';
import { UsuarioControllerService } from '../../api/api/services/usuario-controller.service';
import { PaginatedResult } from '../models/pagination.model';
import { Usuario, UsuarioActualizarData, UsuarioCrearData, UsuarioQuery } from '../models/usuario.model';
import { PerfilUsuarioActualizarData } from '../models/perfil-usuario.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  constructor(private readonly api: UsuarioControllerService) {}

  listar(query: UsuarioQuery): Observable<PaginatedResult<Usuario>> {
    return this.api.listarUsuarios({
      pagina: query.page,
      tamPagina: query.pageSize,
      texto: query.texto?.trim() || undefined,
      activo: query.estado
    }).pipe(
      map((response: CustomPageUsuarioResponse) => ({
        items: (response.datos ?? []).map((item) => this.mapUsuario(item)),
        totalItems: response.paginacion?.totalElementos ?? 0,
        page: response.paginacion?.numeroPagina ?? query.page,
        pageSize: response.paginacion?.tamanioPagina ?? query.pageSize
      }))
    );
  }

  crear(data: UsuarioCrearData): Observable<MessageResponse> {
    return this.api.registrarUsuario({ body: this.request(data) });
  }

  actualizar(id: number, data: UsuarioActualizarData): Observable<MessageResponse> {
    return this.api.actualizarUsuario({ body: this.request(data, id) });
  }

  cambiarEstado(id: number, activo: boolean): Observable<MessageResponse> {
    return this.api.cambiarEstadoUsuario({ usuarioId: id, activo });
  }

  obtenerPorId(id: number): Observable<Usuario | null> {
    return this.listar({ page: 1, pageSize: 1000 }).pipe(
      map((resultado) => resultado.items.find((usuario) => usuario.id === id) ?? null)
    );
  }

  obtenerPorNombreUsuario(nombreUsuario: string): Observable<Usuario | null> {
    const buscado = nombreUsuario.trim().toUpperCase();
    return this.listar({ page: 1, pageSize: 1000, texto: nombreUsuario }).pipe(
      map((resultado) => resultado.items.find((usuario) => usuario.nombreUsuario.toUpperCase() === buscado) ?? null)
    );
  }

  existeCorreo(correo: string, idExcluir?: number): Observable<boolean> {
    const buscado = correo.trim().toLowerCase();
    return this.listar({ page: 1, pageSize: 1000, texto: correo }).pipe(
      map((resultado) => resultado.items.some((usuario) => usuario.correo.toLowerCase() === buscado && usuario.id !== idExcluir))
    );
  }

  actualizarPerfil(id: number, data: PerfilUsuarioActualizarData): Observable<Usuario | null> {
    return this.obtenerPorId(id).pipe(
      switchMap((usuario) => {
        if (!usuario) return of(null);
        return this.actualizar(id, {
          nombreUsuario: usuario.nombreUsuario,
          nombres: data.nombres,
          apellidoPaterno: data.apellidos.trim().split(/\s+/).shift() ?? '',
          apellidoMaterno: data.apellidos.trim().split(/\s+/).slice(1).join(' '),
          correo: data.correo,
          telefono: data.telefono,
          rolId: usuario.rolId
        }).pipe(switchMap(() => this.obtenerPorId(id)));
      })
    );
  }

  cambiarPassword(id: number, data: { passwordActual: string; nuevaPassword: string }): Observable<{ success: boolean; message: string }> {
    return this.api.cambiarContraseniaUsuario({ body: {
      contraseniaActual: data.passwordActual,
      nuevaContrasenia: data.nuevaPassword,
      confirmarContrasenia: data.nuevaPassword
    }}).pipe(map((response) => ({ success: true, message: response.message ?? '' })));
  }

  registrarUltimoAcceso(id: number): Observable<Usuario | null> {
    return this.obtenerPorId(id);
  }

  private request(data: UsuarioCrearData | UsuarioActualizarData, usuarioId = 0): UsuarioRegistroRequest {
    return {
      usuarioId,
      dni: data.nombreUsuario.trim(),
      nombres: data.nombres.trim(),
      apellidoPaterno: data.apellidoPaterno.trim(),
      apellidoMaterno: data.apellidoMaterno.trim(),
      correo: data.correo.trim().toLowerCase(),
      telefono: data.telefono?.trim() || undefined,
      rolId: data.rolId
    };
  }

  private mapUsuario(item: UsuarioResponse): Usuario {
    return {
      id: item.usuarioId ?? 0,
      nombreUsuario: item.usuario ?? '',
      nombres: item.nombres ?? '',
      apellidos: item.apellidos ?? '',
      correo: item.correo ?? '',
      telefono: '',
      rolId: item.rolId ?? 0,
      passwordHash: '',
      esSistema: item.esSistema ?? false,
      debeCambiarPassword: false,
      ultimoAcceso: item.ultimoAcceso ?? null,
      activo: item.activo ?? true,
      fechaCreacion: '',
      fechaActualizacion: null
    };
  }
}
