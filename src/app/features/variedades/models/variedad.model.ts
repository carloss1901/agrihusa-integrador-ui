import { BaseEntity } from '../../../core/models/base-entity.model';
import { PaginationQuery } from '../../../core/models/pagination.model';

export interface Variedad extends BaseEntity {
  productoId: number;
  nombre: string;
}

export type VariedadFormData = Pick<
  Variedad,
  'productoId' | 'nombre'
>;

export interface VariedadQuery extends PaginationQuery {
  texto?: string;
  productoId?: number;
  estado?: boolean;
}

export type VariedadFilter = Omit<
  VariedadQuery,
  'page' | 'pageSize'
>;