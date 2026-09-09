import { BaseEntity } from '../../../core/models/base-entity.model';
import { PaginationQuery } from '../../../core/models/pagination.model';

export interface Producto extends BaseEntity {
  codigo: string;
  nombre: string;
  descripcion: string;
}

export type ProductoFormData = Pick<
  Producto,
  'codigo' | 'nombre' | 'descripcion'
>;

export interface ProductoQuery extends PaginationQuery {
  texto?: string;
  estado?: boolean;
}

export type ProductoFilter = Omit<
  ProductoQuery,
  'page' | 'pageSize'
>;