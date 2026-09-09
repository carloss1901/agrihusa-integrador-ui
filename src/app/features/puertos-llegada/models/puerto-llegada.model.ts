import { BaseEntity } from '../../../core/models/base-entity.model';
import { PaginationQuery } from '../../../core/models/pagination.model';

export interface PuertoLlegada extends BaseEntity {
  codigo: string;
  puerto: string;
  pais: string;
}

export type PuertoLlegadaFormData = Pick<
  PuertoLlegada,
  'codigo' | 'puerto' | 'pais'
>;

export interface PuertoLlegadaQuery
  extends PaginationQuery {
  texto?: string;
  pais?: string;
  estado?: boolean;
}

export type PuertoLlegadaFilter = Omit<
  PuertoLlegadaQuery,
  'page' | 'pageSize'
>;