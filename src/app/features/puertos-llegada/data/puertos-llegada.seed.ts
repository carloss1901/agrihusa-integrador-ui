import { PuertoLlegada } from '../models/puerto-llegada.model';

export function crearPuertosLlegadaIniciales():
  PuertoLlegada[] {
  const fechaCreacion = new Date().toISOString();

  return [
    {
      id: 1,
      codigo: 'PECLL',
      puerto: 'CALLAO',
      pais: 'PERÚ',
      activo: true,
      fechaCreacion,
      fechaActualizacion: null
    },
    {
      id: 2,
      codigo: 'CLVAP',
      puerto: 'VALPARAÍSO',
      pais: 'CHILE',
      activo: true,
      fechaCreacion,
      fechaActualizacion: null
    },
    {
      id: 3,
      codigo: 'COBUN',
      puerto: 'BUENAVENTURA',
      pais: 'COLOMBIA',
      activo: true,
      fechaCreacion,
      fechaActualizacion: null
    },
    {
      id: 4,
      codigo: 'ECGYE',
      puerto: 'GUAYAQUIL',
      pais: 'ECUADOR',
      activo: false,
      fechaCreacion,
      fechaActualizacion: null
    },
    {
      id: 5,
      codigo: 'MXZLO',
      puerto: 'MANZANILLO',
      pais: 'MÉXICO',
      activo: true,
      fechaCreacion,
      fechaActualizacion: null
    }
  ];
}