/* tslint:disable */
/* eslint-disable */
import { CustomPageable } from './custom-pageable';
import { DespachoResponse } from './despacho-response';
export interface CustomPageDespachoResponse {
  datos?: Array<DespachoResponse>;
  paginacion?: CustomPageable;
}
