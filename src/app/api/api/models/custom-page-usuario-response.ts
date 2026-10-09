/* tslint:disable */
/* eslint-disable */
import { CustomPageable } from './custom-pageable';
import { UsuarioResponse } from './usuario-response';
export interface CustomPageUsuarioResponse {
  datos?: Array<UsuarioResponse>;
  paginacion?: CustomPageable;
}
