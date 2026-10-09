/* tslint:disable */
/* eslint-disable */
import { CustomPageable } from './custom-pageable';
import { VariedadResponse } from './variedad-response';
export interface CustomPageVariedadResponse {
  datos?: Array<VariedadResponse>;
  paginacion?: CustomPageable;
}
