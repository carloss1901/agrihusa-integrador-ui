import { Situacion } from '../models/situacion.model';

export function crearSituacionesIniciales():
  Situacion[] {
  const fechaCreacion = new Date().toISOString();

  return [
    {
      id: 1,
      descripcion: 'PROGRAMADO',
      activo: true,
      fechaCreacion,
      fechaActualizacion: null
    },
    {
      id: 2,
      descripcion: 'EN PREPARACIÓN',
      activo: true,
      fechaCreacion,
      fechaActualizacion: null
    },
    {
      id: 3,
      descripcion: 'DESPACHADO',
      activo: true,
      fechaCreacion,
      fechaActualizacion: null
    },
    {
      id: 4,
      descripcion: 'EN TRÁNSITO',
      activo: true,
      fechaCreacion,
      fechaActualizacion: null
    },
    {
      id: 5,
      descripcion: 'ENTREGADO',
      activo: true,
      fechaCreacion,
      fechaActualizacion: null
    },
    {
      id: 6,
      descripcion: 'CANCELADO',
      activo: true,
      fechaCreacion,
      fechaActualizacion: null
    },
    {
      id: 7,
      descripcion: 'OBSERVADO',
      activo: false,
      fechaCreacion,
      fechaActualizacion: null
    }
  ];
}