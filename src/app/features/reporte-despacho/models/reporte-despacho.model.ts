import {
  UnidadMedidaDespacho
} from '../../registro-despacho/models/despacho.model';

export interface ReporteDespachoFilter {
  fechaDesde?: string;
  fechaHasta?: string;
  clienteId?: number;
  productoId?: number;
  variedadId?: number;
  viaId?: number;
  situacionId?: number;
  estado?: boolean;
}

export interface ReporteDespachoItem {
  id: number;
  codigo: string;
  fechaDespacho: string;
  fechaEstimadaLlegada: string;
  cliente: string;
  naviera: string;
  destino: string;
  operadorLogistico: string;
  puertoLlegada: string;
  producto: string;
  variedad: string;
  via: string;
  situacion: string;
  cantidad: number;
  unidadMedida: UnidadMedidaDespacho;
  numeroContenedor: string;
  observaciones: string;
  activo: boolean;
}

export interface ResumenReporteDespacho {
  totalRegistros: number;
  totalActivos: number;
  totalEntregados: number;
  totalEnTransito: number;
}