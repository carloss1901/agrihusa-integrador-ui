import { BaseEntity } from '../../../core/models/base-entity.model';
import { PaginationQuery } from '../../../core/models/pagination.model';

export interface Destino extends BaseEntity {
  pais: string;
  ciudad: string;
}

export type DestinoFormData = Pick<
  Destino,
  'pais' | 'ciudad'
>;

export interface DestinoQuery extends PaginationQuery {
  texto?: string;
  pais?: string;
  estado?: boolean;
}

export type DestinoFilter = Omit<
  DestinoQuery,
  'page' | 'pageSize'
>;