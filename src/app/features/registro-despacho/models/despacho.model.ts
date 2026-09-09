import { BaseEntity } from '../../../core/models/base-entity.model';
import { PaginationQuery } from '../../../core/models/pagination.model';

export enum UnidadMedidaDespacho {
  CAJAS = 'CAJAS',
  KILOGRAMOS = 'KILOGRAMOS',
  TONELADAS = 'TONELADAS',
  PALETS = 'PALETS'
}

export interface Despacho extends BaseEntity {
  codigo: string;
  fechaDespacho: string;
  fechaEstimadaLlegada: string;
  clienteId: number;
  navieraId: number;
  destinoId: number;
  operadorLogisticoId: number;
  puertoLlegadaId: number;
  productoId: number;
  variedadId: number;
  viaId: number;
  situacionId: number;
  cantidad: number;
  unidadMedida: UnidadMedidaDespacho;
  numeroContenedor: string;
  observaciones: string;
}

export type DespachoFormData = Pick<
  Despacho,
  | 'fechaDespacho'
  | 'fechaEstimadaLlegada'
  | 'clienteId'
  | 'navieraId'
  | 'destinoId'
  | 'operadorLogisticoId'
  | 'puertoLlegadaId'
  | 'productoId'
  | 'variedadId'
  | 'viaId'
  | 'situacionId'
  | 'cantidad'
  | 'unidadMedida'
  | 'numeroContenedor'
  | 'observaciones'
>;

export interface DespachoQuery
  extends PaginationQuery {
  texto?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  clienteId?: number;
  productoId?: number;
  situacionId?: number;
  estado?: boolean;
}

export type DespachoFilter = Omit<
  DespachoQuery,
  'page' | 'pageSize'
>;