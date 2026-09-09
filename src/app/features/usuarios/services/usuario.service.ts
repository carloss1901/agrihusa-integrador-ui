import { Injectable } from '@angular/core';
import {
  Observable,
  from,
  of
} from 'rxjs';

import { STORAGE_KEYS } from '../../../core/constants/storage-keys.constant';
import { PaginatedResult } from '../../../core/models/pagination.model';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { PasswordHashService } from '../../../core/services/password-hash.service';
import {
  Usuario,
  UsuarioActualizarData,
  UsuarioCrearData,
  UsuarioQuery
} from '../models/usuario.model';
import {
  CambioPasswordResult,
  CambioPasswordServiceData,
  PerfilUsuarioActualizarData
} from '../../perfil-usuario/models/perfil-usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  constructor(
    private localStorageService: LocalStorageService,
    private passwordHashService: PasswordHashService
  ) { }

  listar(
    query: UsuarioQuery
  ): Observable<PaginatedResult<Usuario>> {
    const page = Math.max(1, query.page);
    const pageSize = Math.max(1, query.pageSize);
    const texto = query.texto?.trim().toUpperCase();

    const usuariosFiltrados =
      this.obtenerUsuarios().filter((usuario) => {
        const contenido = [
          usuario.nombreUsuario,
          usuario.nombres,
          usuario.apellidos,
          usuario.correo
        ]
          .join(' ')
          .toUpperCase();

        if (
          texto &&
          !contenido.includes(texto)
        ) {
          return false;
        }

        if (
          query.rolId !== undefined &&
          usuario.rolId !== query.rolId
        ) {
          return false;
        }

        if (
          query.estado !== undefined &&
          usuario.activo !== query.estado
        ) {
          return false;
        }

        return true;
      });

    const inicio = (page - 1) * pageSize;
    const items = usuariosFiltrados.slice(
      inicio,
      inicio + pageSize
    );

    return of({
      items,
      totalItems: usuariosFiltrados.length,
      page,
      pageSize
    });
  }

  obtenerPorId(
    id: number
  ): Observable<Usuario | null> {
    const usuario =
      this.obtenerUsuarios().find(
        (item) => item.id === id
      ) ?? null;

    return of(usuario);
  }

  obtenerPorNombreUsuario(
    nombreUsuario: string
  ): Observable<Usuario | null> {
    const nombreNormalizado =
      nombreUsuario.trim().toUpperCase();

    const usuario =
      this.obtenerUsuarios().find(
        (item) =>
          item.nombreUsuario.toUpperCase() ===
          nombreNormalizado
      ) ?? null;

    return of(usuario);
  }

  crear(
    data: UsuarioCrearData
  ): Observable<Usuario> {
    return from(this.crearUsuario(data));
  }

  actualizar(
    id: number,
    data: UsuarioActualizarData
  ): Observable<Usuario | null> {
    const usuarios = this.obtenerUsuarios();
    const posicion = usuarios.findIndex(
      (item) => item.id === id
    );

    if (posicion === -1) {
      return of(null);
    }

    const usuarioActual = usuarios[posicion];

    const usuarioActualizado: Usuario = {
      ...usuarioActual,
      nombreUsuario: usuarioActual.esSistema
        ? usuarioActual.nombreUsuario
        : data.nombreUsuario.trim().toUpperCase(),
      nombres: data.nombres.trim(),
      apellidos: data.apellidos.trim(),
      correo: data.correo.trim().toLowerCase(),
      telefono: data.telefono.trim(),
      rolId: usuarioActual.esSistema
        ? usuarioActual.rolId
        : data.rolId,
      activo: usuarioActual.esSistema
        ? usuarioActual.activo
        : data.activo,
      fechaActualizacion: new Date().toISOString()
    };

    usuarios[posicion] = usuarioActualizado;
    this.guardarUsuarios(usuarios);

    return of(usuarioActualizado);
  }

  actualizarPerfil(
    id: number,
    data: PerfilUsuarioActualizarData
  ): Observable<Usuario | null> {
    const usuarios = this.obtenerUsuarios();
    const posicion = usuarios.findIndex(
      (usuario) => usuario.id === id
    );

    if (
      posicion === -1 ||
      !usuarios[posicion].activo
    ) {
      return of(null);
    }

    const usuarioActualizado: Usuario = {
      ...usuarios[posicion],
      nombres: data.nombres.trim(),
      apellidos: data.apellidos.trim(),
      correo: data.correo.trim().toLowerCase(),
      telefono: data.telefono.trim(),
      fechaActualizacion: new Date().toISOString()
    };

    usuarios[posicion] = usuarioActualizado;
    this.guardarUsuarios(usuarios);

    return of(usuarioActualizado);
  }

  cambiarPassword(
    id: number,
    data: CambioPasswordServiceData
  ): Observable<CambioPasswordResult> {
    return from(
      this.cambiarPasswordUsuario(id, data)
    );
  }

  cambiarEstado(
    id: number
  ): Observable<Usuario | null> {
    const usuarios = this.obtenerUsuarios();
    const posicion = usuarios.findIndex(
      (item) => item.id === id
    );

    if (
      posicion === -1 ||
      usuarios[posicion].esSistema
    ) {
      return of(null);
    }

    usuarios[posicion] = {
      ...usuarios[posicion],
      activo: !usuarios[posicion].activo,
      fechaActualizacion: new Date().toISOString()
    };

    this.guardarUsuarios(usuarios);

    return of(usuarios[posicion]);
  }

  existeNombreUsuario(
    nombreUsuario: string,
    idExcluir?: number
  ): Observable<boolean> {
    const nombreNormalizado =
      nombreUsuario.trim().toUpperCase();

    const existe = this.obtenerUsuarios().some(
      (usuario) =>
        usuario.nombreUsuario.toUpperCase() ===
        nombreNormalizado &&
        usuario.id !== idExcluir
    );

    return of(existe);
  }

  existeCorreo(
    correo: string,
    idExcluir?: number
  ): Observable<boolean> {
    const correoNormalizado =
      correo.trim().toLowerCase();

    const existe = this.obtenerUsuarios().some(
      (usuario) =>
        usuario.correo.toLowerCase() ===
        correoNormalizado &&
        usuario.id !== idExcluir
    );

    return of(existe);
  }

  registrarUltimoAcceso(
    id: number
  ): Observable<Usuario | null> {
    const usuarios = this.obtenerUsuarios();
    const posicion = usuarios.findIndex(
      (item) => item.id === id
    );

    if (posicion === -1) {
      return of(null);
    }

    usuarios[posicion] = {
      ...usuarios[posicion],
      ultimoAcceso: new Date().toISOString()
    };

    this.guardarUsuarios(usuarios);

    return of(usuarios[posicion]);
  }

  private async crearUsuario(
    data: UsuarioCrearData
  ): Promise<Usuario> {
    const usuarios = this.obtenerUsuarios();
    const fechaCreacion = new Date().toISOString();

    const passwordHash =
      await this.passwordHashService.crearHash(
        data.password
      );

    const nuevoUsuario: Usuario = {
      id: this.generarId(usuarios),
      nombreUsuario:
        data.nombreUsuario.trim().toUpperCase(),
      nombres: data.nombres.trim(),
      apellidos: data.apellidos.trim(),
      correo: data.correo.trim().toLowerCase(),
      telefono: data.telefono.trim(),
      rolId: data.rolId,
      passwordHash,
      esSistema: false,
      debeCambiarPassword: true,
      ultimoAcceso: null,
      activo: data.activo,
      fechaCreacion,
      fechaActualizacion: null
    };

    usuarios.push(nuevoUsuario);
    this.guardarUsuarios(usuarios);

    return nuevoUsuario;
  }

  private async cambiarPasswordUsuario(
    id: number,
    data: CambioPasswordServiceData
  ): Promise<CambioPasswordResult> {
    const usuarios = this.obtenerUsuarios();
    const posicion = usuarios.findIndex(
      (usuario) => usuario.id === id
    );

    if (
      posicion === -1 ||
      !usuarios[posicion].activo
    ) {
      return {
        success: false,
        message:
          'No fue posible actualizar la contraseña.'
      };
    }

    const usuario = usuarios[posicion];

    const passwordActualValido =
      await this.passwordHashService.verificar(
        data.passwordActual,
        usuario.passwordHash
      );

    if (!passwordActualValido) {
      return {
        success: false,
        message:
          'La contraseña actual es incorrecta.'
      };
    }

    if (
      data.passwordActual === data.nuevaPassword
    ) {
      return {
        success: false,
        message:
          'La nueva contraseña debe ser diferente.'
      };
    }

    const nuevoPasswordHash =
      await this.passwordHashService.crearHash(
        data.nuevaPassword
      );

    usuarios[posicion] = {
      ...usuario,
      passwordHash: nuevoPasswordHash,
      debeCambiarPassword: false,
      fechaActualizacion: new Date().toISOString()
    };

    this.guardarUsuarios(usuarios);

    return {
      success: true,
      message:
        'La contraseña se actualizó correctamente.'
    };
  }

  private obtenerUsuarios(): Usuario[] {
    return (
      this.localStorageService.obtener<Usuario[]>(
        STORAGE_KEYS.USUARIOS
      ) ?? []
    );
  }

  private guardarUsuarios(
    usuarios: Usuario[]
  ): void {
    this.localStorageService.guardar(
      STORAGE_KEYS.USUARIOS,
      usuarios
    );
  }

  private generarId(
    usuarios: Usuario[]
  ): number {
    return (
      usuarios.reduce(
        (mayorId, usuario) =>
          Math.max(mayorId, usuario.id),
        0
      ) + 1
    );
  }
}