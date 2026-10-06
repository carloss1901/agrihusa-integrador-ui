/* tslint:disable */
/* eslint-disable */
import { CustomPageable } from './custom-pageable';
import { OperadorLogisticoResponse } from './operador-logistico-response';
export interface CustomPageOperadorLogisticoResponse {
  datos?: Array<OperadorLogisticoResponse>;
  paginacion?: CustomPageable;
}
