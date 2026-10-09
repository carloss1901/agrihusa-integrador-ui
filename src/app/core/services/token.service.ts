import { Injectable } from '@angular/core';

import { AccionPermiso, ModuloSistema } from '../models/permiso.model';
import {
  TokenModulo,
  TokenPayload,
  TokenRol
} from '../models/token-payload.model';

@Injectable({ providedIn: 'root' })
export class TokenService {
  obtenerPayload(): TokenPayload | null {
  const token =
    localStorage.getItem('token');

  if (!token) {
    return null;
  }

  try {
    const partes = token.split('.');

    if (partes.length !== 3) {
      return null;
    }

    const contenidoBase64 = partes[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const contenidoConRelleno =
      contenidoBase64.padEnd(
        contenidoBase64.length +
          (4 - contenidoBase64.length % 4) % 4,
        '='
      );

    const bytes = Uint8Array.from(
      atob(contenidoConRelleno),
      (caracter) => caracter.charCodeAt(0)
    );

    const json =
      new TextDecoder().decode(bytes);

    return JSON.parse(json) as TokenPayload;
  } catch {
    return null;
  }
}

  obtenerRoles(): TokenRol[] {
    return this.obtenerPayload()?.roles ?? [];
  }

  estaVigente(): boolean {
    const payload = this.obtenerPayload();
    const expiracion = payload?.exp;
    const vigente = typeof expiracion === 'number'
      && expiracion * 1000 > Date.now();

    if (!vigente) {
      localStorage.removeItem('token');
    }

    return vigente;
  }

  obtenerModulos(): TokenModulo[] {
    const modulos = this.obtenerRoles().flatMap((rol) => rol.modulos ?? []);
    const unicos = new Map<string, TokenModulo>();

    for (const modulo of modulos) {
      const clave = String(modulo.moduloId ?? modulo.codigo ?? modulo.nombre);
      const anterior = unicos.get(clave);
      if (!anterior) {
        unicos.set(clave, { ...modulo, permisos: [...(modulo.permisos ?? [])] });
        continue;
      }

      anterior.permisos = [
        ...(anterior.permisos ?? []),
        ...(modulo.permisos ?? [])
      ];
    }

    return [...unicos.values()];
  }

  tienePermiso(modulo: ModuloSistema, accion: AccionPermiso): boolean {
    if (this.esAdministrador()) {
      return true;
    }

    const moduloNormalizado = this.normalizar(modulo);

    return this.obtenerModulos().some((moduloToken) => {
      const coincide = [moduloToken.codigo, moduloToken.nombre]
        .filter(Boolean)
        .some((valor) => this.normalizar(valor as string) === moduloNormalizado);

      return coincide && (moduloToken.permisos ?? []).some((permiso) =>
        this.normalizar(permiso.accion) === this.normalizar(accion)
      );
    });
  }

  obtenerRolPrincipal(): string {
    return this.obtenerRoles()[0]?.nombre ?? 'Sin rol';
  }

  esAdministrador(): boolean {
    return this.obtenerRoles().some((rol) => Number(rol.rolId) === 1);
  }

  obtenerUsuario(): string {
    return this.obtenerPayload()?.sub ?? '';
  }

  private normalizar(valor?: string): string {
    return (valor ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, '-')
      .trim();
  }
}
