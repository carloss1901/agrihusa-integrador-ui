/* tslint:disable */
/* eslint-disable */
import { CustomPageable } from './custom-pageable';
import { NavieraResponse } from './naviera-response';
export interface CustomPageNavieraResponse {
  datos?: Array<NavieraResponse>;
  paginacion?: CustomPageable;
}
