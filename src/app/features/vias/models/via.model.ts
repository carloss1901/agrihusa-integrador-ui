import { BaseEntity } from '../../../core/models/base-entity.model';
import { PaginationQuery } from '../../../core/models/pagination.model';

export interface Via extends BaseEntity {
  descripcion: string;
}

export type ViaFormData = Pick<
  Via,
  'descripcion'
>;

export interface ViaQuery extends PaginationQuery {
  texto?: string;
  estado?: boolean;
}

export type ViaFilter = Omit<
  ViaQuery,
  'page' | 'pageSize'
>;