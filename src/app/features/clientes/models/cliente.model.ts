import { BaseEntity } from '../../../core/models/base-entity.model';
import { PaginationQuery } from '../../../core/models/pagination.model';

export enum TipoDocumentoCliente {
    RUC = 'RUC',
    DNI = 'DNI',
    CARNET_EXTRANJERIA = 'CARNET_EXTRANJERIA',
    PASAPORTE = 'PASAPORTE',
    OTRO = 'OTRO'
}

export interface Cliente extends BaseEntity {
    tipoDocumento: TipoDocumentoCliente;
    numeroDocumento: string;
    razonSocial: string;
    nombreComercial: string;
    contacto: string;
    correo: string;
    telefono: string;
    direccion: string;
    pais: string;
}

export type ClienteFormData = Pick<
    Cliente,
    | 'tipoDocumento'
    | 'numeroDocumento'
    | 'razonSocial'
    | 'nombreComercial'
    | 'contacto'
    | 'correo'
    | 'telefono'
    | 'direccion'
    | 'pais'
>;

export interface ClienteQuery extends PaginationQuery {
    texto?: string;
    tipoDocumento?: TipoDocumentoCliente;
    estado?: boolean;
}

export type ClienteFilter = Omit<
    ClienteQuery,
    'page' | 'pageSize'
>;