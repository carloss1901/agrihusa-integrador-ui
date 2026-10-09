/* tslint:disable */
/* eslint-disable */
import { RolPermisoResponse } from './rol-permiso-response';
export interface RolDetalleResponse {
  descripcion?: string;
  nombre?: string;
  permisos?: Array<RolPermisoResponse>;
}
