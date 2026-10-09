/* tslint:disable */
/* eslint-disable */
import { CustomPageable } from './custom-pageable';
import { PuertoLlegadaResponse } from './puerto-llegada-response';
export interface CustomPagePuertoLlegadaResponse {
  datos?: Array<PuertoLlegadaResponse>;
  paginacion?: CustomPageable;
}
