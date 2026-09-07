import {
  Despacho,
  UnidadMedidaDespacho
} from '../models/despacho.model';

function obtenerFecha(
  diasDiferencia: number
): string {
  const fecha = new Date();

  fecha.setDate(
    fecha.getDate() + diasDiferencia
  );

  return fecha.toISOString().slice(0, 10);
}

export function crearDespachosIniciales():
  Despacho[] {
  const fechaCreacion = new Date().toISOString();
  const anio = new Date().getFullYear();

  return [
    {
      id: 1,
      codigo: `DES-${anio}-0001`,
      fechaDespacho: obtenerFecha(2),
      fechaEstimadaLlegada: obtenerFecha(20),
      clienteId: 1,
      navieraId: 1,
      destinoId: 4,
      operadorLogisticoId: 1,
      puertoLlegadaId: 2,
      productoId: 2,
      variedadId: 1,
      viaId: 1,
      situacionId: 1,
      cantidad: 1200,
      unidadMedida: UnidadMedidaDespacho.CAJAS,
      numeroContenedor: 'MSKU1234567',
      observaciones:
        'DESPACHO DE PALTA HASS A VALPARAÍSO',
      activo: true,
      fechaCreacion,
      fechaActualizacion: null
    },
    {
      id: 2,
      codigo: `DES-${anio}-0002`,
      fechaDespacho: obtenerFecha(-5),
      fechaEstimadaLlegada: obtenerFecha(12),
      clienteId: 2,
      navieraId: 2,
      destinoId: 3,
      operadorLogisticoId: 2,
      puertoLlegadaId: 3,
      productoId: 1,
      variedadId: 3,
      viaId: 1,
      situacionId: 3,
      cantidad: 950,
      unidadMedida: UnidadMedidaDespacho.CAJAS,
      numeroContenedor: 'MSCU7654321',
      observaciones:
        'DESPACHO DE UVA RED GLOBE A BUENAVENTURA',
      activo: true,
      fechaCreacion,
      fechaActualizacion: null
    },
    {
      id: 3,
      codigo: `DES-${anio}-0003`,
      fechaDespacho: obtenerFecha(-12),
      fechaEstimadaLlegada: obtenerFecha(5),
      clienteId: 1,
      navieraId: 3,
      destinoId: 6,
      operadorLogisticoId: 1,
      puertoLlegadaId: 5,
      productoId: 3,
      variedadId: 6,
      viaId: 1,
      situacionId: 4,
      cantidad: 720,
      unidadMedida: UnidadMedidaDespacho.CAJAS,
      numeroContenedor: 'HLCU2468101',
      observaciones:
        'DESPACHO DE ARÁNDANO BILOXI A MANZANILLO',
      activo: true,
      fechaCreacion,
      fechaActualizacion: null
    }
  ];
}