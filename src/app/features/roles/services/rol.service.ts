import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { STORAGE_KEYS } from '../../../core/constants/storage-keys.constant';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { PaginatedResult } from '../../../core/models/pagination.model';
import {
  Rol,
  RolFormData,
  RolQuery
} from '../models/rol.model';


@Injectable({
  providedIn: 'root'
})
export class RolService {
  constructor(private localStorageService: LocalStorageService) {}

  listar(
    query: RolQuery
  ): Observable<PaginatedResult<Rol>> {
    const page = Math.max(1, query.page);
    const pageSize = Math.max(1, query.pageSize);
    const nombre = query.nombre?.trim().toUpperCase();

    const rolesFiltrados = this.obtenerRoles().filter((rol) => {
      if (
        nombre &&
        !rol.nombre.toUpperCase().includes(nombre)
      ) {
        return false;
      }

      if (
        query.estado !== undefined &&
        rol.activo !== query.estado
      ) {
        return false;
      }

      return true;
    });

    const inicio = (page - 1) * pageSize;
    const items = rolesFiltrados.slice(
      inicio,
      inicio + pageSize
    );

    return of({
      items,
      totalItems: rolesFiltrados.length,
      page,
      pageSize
    });
  }

  obtenerPorId(id: number): Observable<Rol | null> {
    const rol = this.obtenerRoles().find((item) => item.id === id) ?? null;

    return of(rol);
  }

  crear(data: RolFormData): Observable<Rol> {
    const roles = this.obtenerRoles();
    const fechaActual = new Date().toISOString();

    const nuevoRol: Rol = {
      id: this.generarId(roles),
      nombre: data.nombre.trim(),
      descripcion: data.descripcion.trim(),
      esSistema: false,
      permisos: this.copiarPermisos(data.permisos),
      activo: true,  
      fechaCreacion: fechaActual,
      fechaActualizacion: null
    };

    roles.push(nuevoRol);
    this.guardarRoles(roles);

    return of(nuevoRol);
  }

  actualizar(
    id: number,
    data: RolFormData
  ): Observable<Rol | null> {
    const roles = this.obtenerRoles();
    const posicion = roles.findIndex((item) => item.id === id);

    if (posicion === -1) {
      return of(null);
    }

    if (roles[posicion].esSistema) {
      return of(null);
    }

    const rolActualizado: Rol = {
      ...roles[posicion],
      nombre: data.nombre.trim(),
      descripcion: data.descripcion.trim(),
      permisos: this.copiarPermisos(data.permisos),
      fechaActualizacion: new Date().toISOString()
    };

    roles[posicion] = rolActualizado;
    this.guardarRoles(roles);

    return of(rolActualizado);
  }

  cambiarEstado(id: number): Observable<Rol | null> {
    const roles = this.obtenerRoles();
    const posicion = roles.findIndex((item) => item.id === id);

    if (posicion === -1) {
      return of(null);
    }
    
    if (roles[posicion].esSistema) {
    return of(null);
    }

    roles[posicion] = {
      ...roles[posicion],
      activo: !roles[posicion].activo,
      fechaActualizacion: new Date().toISOString()
    };

    this.guardarRoles(roles);

    return of(roles[posicion]);
  }

  existeNombre(
    nombre: string,
    idExcluir?: number
  ): Observable<boolean> {
    const nombreNormalizado = nombre.trim().toUpperCase();

    const existe = this.obtenerRoles().some(
      (item) =>
        item.nombre.trim().toUpperCase() === nombreNormalizado &&
        item.id !== idExcluir
    );

    return of(existe);
  }

  private obtenerRoles(): Rol[] {
    return this.localStorageService.obtener<Rol[]>(STORAGE_KEYS.ROLES) ?? [];
  }

  private guardarRoles(roles: Rol[]): void {
    this.localStorageService.guardar(STORAGE_KEYS.ROLES, roles);
  }

  private generarId(roles: Rol[]): number {
    return roles.reduce(
      (mayorId, rol) => Math.max(mayorId, rol.id),
      0
    ) + 1;
  }

  private copiarPermisos(
    permisos: RolFormData['permisos']
  ): RolFormData['permisos'] {
    return permisos.map((permiso) => ({
      ...permiso,
      acciones: [...permiso.acciones]
    }));
  }
}