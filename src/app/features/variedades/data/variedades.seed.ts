import { Variedad } from '../models/variedad.model';

export function crearVariedadesIniciales(): Variedad[] {
  const fechaCreacion = new Date().toISOString();

  return [
    {
      id: 1,
      productoId: 2,
      nombre: 'HASS',
      activo: true,
      fechaCreacion,
      fechaActualizacion: null
    },
    {
      id: 2,
      productoId: 2,
      nombre: 'FUERTE',
      activo: true,
      fechaCreacion,
      fechaActualizacion: null
    },
    {
      id: 3,
      productoId: 1,
      nombre: 'RED GLOBE',
      activo: true,
      fechaCreacion,
      fechaActualizacion: null
    },
    {
      id: 4,
      productoId: 1,
      nombre: 'SWEET GLOBE',
      activo: true,
      fechaCreacion,
      fechaActualizacion: null
    },
    {
      id: 5,
      productoId: 1,
      nombre: 'AUTUMN CRISP',
      activo: false,
      fechaCreacion,
      fechaActualizacion: null
    },
    {
      id: 6,
      productoId: 3,
      nombre: 'BILOXI',
      activo: true,
      fechaCreacion,
      fechaActualizacion: null
    },
    {
      id: 7,
      productoId: 3,
      nombre: 'VENTURA',
      activo: true,
      fechaCreacion,
      fechaActualizacion: null
    },
    {
      id: 8,
      productoId: 4,
      nombre: 'UC 157 F1',
      activo: true,
      fechaCreacion,
      fechaActualizacion: null
    }
  ];
}