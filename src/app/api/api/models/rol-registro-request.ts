/* tslint:disable */
/* eslint-disable */
import { RolPermisoRequest } from './rol-permiso-request';
export interface RolRegistroRequest {
  descripcion: string;
  nombre: string;
  permisos: Array<RolPermisoRequest>;
  rolId: number;
}
