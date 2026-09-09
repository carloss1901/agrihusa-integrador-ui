import { BaseEntity } from '../../../core/models/base-entity.model';
import { PaginationQuery } from '../../../core/models/pagination.model';

export interface Situacion extends BaseEntity {
  descripcion: string;
}

export type SituacionFormData = Pick<
  Situacion,
  'descripcion'
>;

export interface SituacionQuery
  extends PaginationQuery {
  texto?: string;
  estado?: boolean;
}

export type SituacionFilter = Omit<
  SituacionQuery,
  'page' | 'pageSize'
>;