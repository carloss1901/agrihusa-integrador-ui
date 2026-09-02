import { BaseEntity } from '../../../core/models/base-entity.model';
import { PaginationQuery } from '../../../core/models/pagination.model';

export interface OperadorLogistico extends BaseEntity {
  ruc: string;
  razonSocial: string;
  nombreComercial: string;
  contacto: string;
  correo: string;
  telefono: string;
  direccion: string;
}

export type OperadorLogisticoFormData = Pick<
  OperadorLogistico,
  | 'ruc'
  | 'razonSocial'
  | 'nombreComercial'
  | 'contacto'
  | 'correo'
  | 'telefono'
  | 'direccion'
>;

export interface OperadorLogisticoQuery
  extends PaginationQuery {
  texto?: string;
  estado?: boolean;
}

export type OperadorLogisticoFilter = Omit<
  OperadorLogisticoQuery,
  'page' | 'pageSize'
>;