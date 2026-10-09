/* tslint:disable */
/* eslint-disable */
import { CustomPageable } from './custom-pageable';
import { SituacionResponse } from './situacion-response';
export interface CustomPageSituacionResponse {
  datos?: Array<SituacionResponse>;
  paginacion?: CustomPageable;
}
