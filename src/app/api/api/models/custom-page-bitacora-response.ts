/* tslint:disable */
/* eslint-disable */
import { BitacoraResponse } from './bitacora-response';
import { CustomPageable } from './custom-pageable';
export interface CustomPageBitacoraResponse {
  datos?: Array<BitacoraResponse>;
  paginacion?: CustomPageable;
}
