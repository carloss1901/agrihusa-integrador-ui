/* tslint:disable */
/* eslint-disable */
import { CustomPageable } from './custom-pageable';
import { ProductoResponse } from './producto-response';
export interface CustomPageProductoResponse {
  datos?: Array<ProductoResponse>;
  paginacion?: CustomPageable;
}
