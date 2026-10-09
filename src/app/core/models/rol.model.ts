import { BaseEntity } from './base-entity.model';
import { Permiso } from './permiso.model';
import { PaginationQuery } from './pagination.model';

export interface Rol extends BaseEntity {
  nombre: string;
  descripcion: string;
  esSistema: boolean;
  cantidadPermisos?: number;
  permisos: Permiso[];
}

export type RolFormData = Pick<
  Rol,
  'nombre' | 'descripcion' | 'permisos'
>;

export interface RolQuery extends PaginationQuery {
  nombre?: string;
  estado?: boolean;
}

export type RolFilter = Omit<
  RolQuery,
  'page' | 'pageSize'
>;
