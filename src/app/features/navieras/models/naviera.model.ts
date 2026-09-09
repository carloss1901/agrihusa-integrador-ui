import { BaseEntity } from '../../../core/models/base-entity.model';
import { PaginationQuery } from '../../../core/models/pagination.model';

export interface Naviera extends BaseEntity {
    codigo: string;
    nombre: string;
    pais: string;
    contacto: string;
    correo: string;
    telefono: string;
    sitioWeb: string;
}

export type NavieraFormData = Pick<
    Naviera,
    | 'codigo'
    | 'nombre'
    | 'pais'
    | 'contacto'
    | 'correo'
    | 'telefono'
    | 'sitioWeb'
>;

export interface NavieraQuery extends PaginationQuery {
    texto?: string;
    pais?: string;
    estado?: boolean;
}

export type NavieraFilter = Omit<
    NavieraQuery,
    'page' | 'pageSize'
>;