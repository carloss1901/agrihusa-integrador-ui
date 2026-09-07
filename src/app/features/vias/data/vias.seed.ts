import { Via } from '../models/via.model';

export function crearViasIniciales(): Via[] {
  const fechaCreacion = new Date().toISOString();

  return [
    {
      id: 1,
      descripcion: 'MARÍTIMA',
      activo: true,
      fechaCreacion,
      fechaActualizacion: null
    },
    {
      id: 2,
      descripcion: 'AÉREA',
      activo: true,
      fechaCreacion,
      fechaActualizacion: null
    },
    {
      id: 3,
      descripcion: 'TERRESTRE',
      activo: true,
      fechaCreacion,
      fechaActualizacion: null
    },
    {
      id: 4,
      descripcion: 'FERROVIARIA',
      activo: false,
      fechaCreacion,
      fechaActualizacion: null
    },
    {
      id: 5,
      descripcion: 'FLUVIAL',
      activo: true,
      fechaCreacion,
      fechaActualizacion: null
    }
  ];
}