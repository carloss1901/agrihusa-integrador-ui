/* tslint:disable */
/* eslint-disable */
import { RolPermisoResponse } from './rol-permiso-response';
export interface RolDetalleResponse {
  activo?: boolean;
  descripcion?: string;
  esSistema?: boolean;
  nombre?: string;
  permisos?: Array<RolPermisoResponse>;
  rolId?: number;
}
