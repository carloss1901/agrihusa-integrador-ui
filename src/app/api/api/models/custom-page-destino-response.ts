/* tslint:disable */
/* eslint-disable */
import { CustomPageable } from './custom-pageable';
import { DestinoResponse } from './destino-response';
export interface CustomPageDestinoResponse {
  datos?: Array<DestinoResponse>;
  paginacion?: CustomPageable;
}
