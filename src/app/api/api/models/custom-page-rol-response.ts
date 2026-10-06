/* tslint:disable */
/* eslint-disable */
import { CustomPageable } from './custom-pageable';
import { RolResponse } from './rol-response';
export interface CustomPageRolResponse {
  datos?: Array<RolResponse>;
  paginacion?: CustomPageable;
}
