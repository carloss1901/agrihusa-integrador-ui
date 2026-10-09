/* tslint:disable */
/* eslint-disable */
export interface DespachoRegistroRequest {
  cantidad: number;
  clienteId: number;
  codigo: string;
  despachoId: number;
  destinoId: number;
  fechaDespacho: string;
  fechaEstimadaLlegada: string;
  navieraId: number;
  numeroContenedor: string;
  observaciones?: string;
  operadorLogisticoId: number;
  productoId: number;
  puertoLlegadaId: number;
  situacionId: number;
  unidadMedida: string;
  variedadId: number;
  viaId: number;
}
