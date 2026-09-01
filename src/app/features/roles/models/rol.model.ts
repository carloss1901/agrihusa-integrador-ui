import { BaseEntity } from '../../../core/models/base-entity.model';
import { Permiso } from '../../../core/models/permiso.model';
import { PaginationQuery } from '../../../core/models/pagination.model';

export interface Rol extends BaseEntity {
  nombre: string;
  descripcion: string;
  esSistema: boolean;
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