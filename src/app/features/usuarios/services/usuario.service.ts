import { Injectable } from '@angular/core';
import {
  catchError,
  from,
  map,
  Observable,
  of,
  switchMap
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
import { UsuarioControllerService } from '../../../api/api/services/usuario-controller.service';
import { CustomPageUsuarioResponse } from '../../../api/api/models/custom-page-usuario-response';
import { UsuarioResponse } from '../../../api/api/models/usuario-response';
import { UsuarioRegistroRequest } from '../../../api/api/models/usuario-registro-request';
import { UsuarioActualizarRequest } from '../../../api/api/models/usuario-actualizar-request';
import { CambiarContraseniaRequest } from '../../../api/api/models/cambiar-contrasenia-request';
import { PerfilUsuarioActualizarRequest } from '../../../api/api/models/perfil-usuario-actualizar-request';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  constructor(
    private localStorageService: LocalStorageService,
    private passwordHashService: PasswordHashService,
    private usuarioControllerService:
      UsuarioControllerService
  ) {}

  listar(
    query: UsuarioQuery
  ): Observable<PaginatedResult<Usuario>> {
    const page = Math.max(1, query.page);
    const pageSize = Math.max(1, query.pageSize);

    return this.consultarUsuarios({
      texto: query.texto?.trim() || undefined,
      rolId: query.rolId,
      activo: query.estado,
      pagina: page,
      tamPagina: pageSize
    }).pipe(
      map((response) => ({
        items: (response.datos ?? []).map(
          (item) => this.mapearUsuario(item)
        ),
        totalItems: Number(
          response.paginacion?.totalElementos ?? 0
        ),
        page: Number(
          response.paginacion?.numeroPagina ?? page
        ),
        pageSize: Number(
          response.paginacion?.tamanioPagina ??
            pageSize
        )
      }))
    );
  }

  obtenerPorId(
    id: number
  ): Observable<Usuario | null> {
    return this.usuarioControllerService
      .obtenerPorId({
        usuarioId: id
      })
      .pipe(
        switchMap((response) => {
          const contenido: unknown = response;

          if (!(contenido instanceof Blob)) {
            return of(response);
          }

          return from(contenido.text()).pipe(
            map(
              (texto) =>
                JSON.parse(texto) as UsuarioResponse
            )
          );
        }),
        map((response) =>
          this.mapearUsuario(response)
        )
      );
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
    const apellidos = data.apellidos
      .trim()
      .split(/\s+/);

    const apellidoPaterno =
      apellidos.shift() ?? '';

    const apellidoMaterno =
      apellidos.join(' ') || '-';

    const dni = data.nombreUsuario.trim();

    const body: UsuarioRegistroRequest = {
      dni,
      nombres: data.nombres.trim(),
      apellidoPaterno,
      apellidoMaterno,
      correo: data.correo.trim().toLowerCase(),
      telefono: data.telefono.trim() || undefined,
      rolId: data.rolId,
      contrasenia: data.password,
      activo: data.activo
    };

    return this.usuarioControllerService
      .registrar2({ body })
      .pipe(
        switchMap(() =>
          this.consultarUsuarios({
            texto: dni,
            pagina: 1,
            tamPagina: 10
          })
        ),
        map((response) => {
          const usuarioCreado =
            (response.datos ?? [])
              .map((item) =>
                this.mapearUsuario(item)
              )
              .find(
                (usuario) =>
                  usuario.nombreUsuario === dni
              );

          if (!usuarioCreado) {
            throw new Error(
              'El usuario fue registrado, pero no pudo recuperarse.'
            );
          }

          return usuarioCreado;
        })
      );
  }

  actualizar(
    id: number,
    data: UsuarioActualizarData
  ): Observable<Usuario | null> {
    const apellidos = data.apellidos
      .trim()
      .split(/\s+/);

    const apellidoPaterno =
      apellidos.shift() ?? '';

    const apellidoMaterno =
      apellidos.join(' ') || '-';

    const body: UsuarioActualizarRequest = {
      usuarioId: id,
      dni: data.nombreUsuario.trim(),
      nombres: data.nombres.trim(),
      apellidoPaterno,
      apellidoMaterno,
      correo: data.correo.trim().toLowerCase(),
      telefono: data.telefono.trim() || undefined,
      rolId: data.rolId,
      activo: data.activo
    };

    return this.usuarioControllerService
      .actualizar2({ body })
      .pipe(
        switchMap(() =>
          this.obtenerPorId(id)
        )
      );
  }

  actualizarPerfil(
    id: number,
    data: PerfilUsuarioActualizarData
  ): Observable<Usuario | null> {
    const apellidos = data.apellidos
      .trim()
      .split(/\s+/);

    const apellidoPaterno =
      apellidos.shift() ?? '';

    const apellidoMaterno =
      apellidos.join(' ') || '-';

    const body: PerfilUsuarioActualizarRequest = {
      nombres: data.nombres.trim(),
      apellidoPaterno,
      apellidoMaterno,
      correo: data.correo.trim().toLowerCase(),
      telefono: data.telefono.trim() || undefined
    };

    return this.usuarioControllerService
      .actualizarPerfil({ body })
      .pipe(
        switchMap(() =>
          this.obtenerPorId(id)
        )
      );
  }

  cambiarPassword(
    _id: number,
    data: CambioPasswordServiceData
  ): Observable<CambioPasswordResult> {
    const body: CambiarContraseniaRequest = {
      contraseniaActual: data.passwordActual,
      nuevaContrasenia: data.nuevaPassword,
      confirmarContrasenia: data.nuevaPassword
    };

    return this.usuarioControllerService
      .cambiarContrasenia({ body })
      .pipe(
        map(() => ({
          success: true,
          message:
            'La contraseña se actualizó correctamente.'
        })),
        catchError(() =>
          of({
            success: false,
            message:
              'No fue posible cambiar la contraseña. Verifica la contraseña actual.'
          })
        )
      );
  }

  cambiarEstado(
    id: number
  ): Observable<Usuario | null> {
    return this.obtenerPorId(id).pipe(
      switchMap((usuario) => {
        if (!usuario || usuario.esSistema) {
          return of(null);
        }

        const nuevoEstado = !usuario.activo;

        return this.usuarioControllerService
          .cambiarEstado2({
            usuarioId: id,
            activo: nuevoEstado
          })
          .pipe(
            map(() => ({
              ...usuario,
              activo: nuevoEstado,
              fechaActualizacion:
                new Date().toISOString()
            }))
          );
      })
    );
  }

  existeNombreUsuario(
    nombreUsuario: string,
    idExcluir?: number
  ): Observable<boolean> {
    const nombreNormalizado =
      nombreUsuario.trim().toUpperCase();

    return this.consultarUsuarios({
      texto: nombreUsuario.trim(),
      pagina: 1,
      tamPagina: 100
    }).pipe(
      map((response) =>
        (response.datos ?? []).some(
          (usuario) =>
            (usuario.usuario ?? usuario.dni ?? '')
              .trim()
              .toUpperCase() === nombreNormalizado &&
            usuario.usuarioId !== idExcluir
        )
      )
    );
  }

  existeCorreo(
    correo: string,
    idExcluir?: number
  ): Observable<boolean> {
    const correoNormalizado =
      correo.trim().toLowerCase();

    return this.consultarUsuarios({
      texto: correo.trim(),
      pagina: 1,
      tamPagina: 100
    }).pipe(
      map((response) =>
        (response.datos ?? []).some(
          (usuario) =>
            (usuario.correo ?? '')
              .trim()
              .toLowerCase() === correoNormalizado &&
            usuario.usuarioId !== idExcluir
        )
      )
    );
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

  private consultarUsuarios(
  params: {
    texto?: string;
    rolId?: number;
    activo?: boolean;
    pagina?: number;
    tamPagina?: number;
  }
): Observable<CustomPageUsuarioResponse> {
  return this.usuarioControllerService
    .listarUsuarios(params)
    .pipe(
      switchMap((response) => {
        const contenido: unknown = response;

        if (!(contenido instanceof Blob)) {
          return of(response);
        }

        return from(contenido.text()).pipe(
          map(
            (texto) =>
              JSON.parse(
                texto
              ) as CustomPageUsuarioResponse
          )
        );
      })
    );
}

private mapearUsuario(
    response: UsuarioResponse
  ): Usuario {
    const apellidos = [
      response.apellidoPaterno,
      response.apellidoMaterno
    ]
      .filter(Boolean)
      .join(' ')
      .trim();

    return {
      id: response.usuarioId ?? 0,
      nombreUsuario:
        response.usuario ?? response.dni ?? '',
      nombres: response.nombres ?? '',
      apellidos,
      correo: response.correo ?? '',
      telefono: response.telefono ?? '',
      rolId: response.rolId ?? 0,
      passwordHash: '',
      esSistema: response.esSistema ?? false,
      debeCambiarPassword:
        response.resetContrasenia ?? false,
      ultimoAcceso: response.ultimoAcceso ?? null,
      activo: response.activo ?? false,
      fechaCreacion: response.fechaCreacion ?? '',
      fechaActualizacion:
        response.fechaModificacion ?? null
    };
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