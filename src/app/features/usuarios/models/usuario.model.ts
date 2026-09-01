import { BaseEntity } from '../../../core/models/base-entity.model';
import { PaginationQuery } from '../../../core/models/pagination.model';

export interface Usuario extends BaseEntity {
  nombreUsuario: string;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string;
  rolId: number;
  passwordHash: string;
  esSistema: boolean;
  debeCambiarPassword: boolean;
  ultimoAcceso: string | null;
}

export interface UsuarioCrearData {
  nombreUsuario: string;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string;
  rolId: number;
  password: string;
  activo: boolean;
}

export type UsuarioActualizarData = Omit<
  UsuarioCrearData,
  'password'
>;

export interface UsuarioQuery extends PaginationQuery {
  texto?: string;
  rolId?: number;
  estado?: boolean;
}

export type UsuarioFilter = Omit<
  UsuarioQuery,
  'page' | 'pageSize'
>;