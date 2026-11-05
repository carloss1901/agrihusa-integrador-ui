import { BaseEntity } from './base-entity.model';
import { PaginationQuery } from './pagination.model';

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

export interface UsuarioActualizarData {
  nombreUsuario: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  correo: string;
  telefono: string;
  rolId: number;
}

export interface UsuarioCrearData extends UsuarioActualizarData {
  contraseniaTemporal: string;
}

export interface UsuarioQuery extends PaginationQuery {
  texto?: string;
  rolId?: number;
  estado?: boolean;
}

export type UsuarioFilter = Omit<UsuarioQuery, 'page' | 'pageSize'>;
