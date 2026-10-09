/* tslint:disable */
/* eslint-disable */
import { ClienteResponse } from './cliente-response';
import { CustomPageable } from './custom-pageable';
export interface CustomPageClienteResponse {
  datos?: Array<ClienteResponse>;
  paginacion?: CustomPageable;
}
