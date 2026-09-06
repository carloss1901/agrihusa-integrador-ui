import { Producto } from '../models/producto.model';

export function crearProductosIniciales(): Producto[] {
  const fechaCreacion = new Date().toISOString();

  return [
    {
      id: 1,
      codigo: 'P001',
      nombre: 'UVA',
      descripcion: 'UVA FRESCA DE EXPORTACIÓN',
      activo: true,
      fechaCreacion,
      fechaActualizacion: null
    },
    {
      id: 2,
      codigo: 'P002',
      nombre: 'PALTA',
      descripcion: 'PALTA FRESCA DE EXPORTACIÓN',
      activo: true,
      fechaCreacion,
      fechaActualizacion: null
    },
    {
      id: 3,
      codigo: 'P003',
      nombre: 'ARÁNDANO',
      descripcion: 'ARÁNDANO FRESCO DE EXPORTACIÓN',
      activo: true,
      fechaCreacion,
      fechaActualizacion: null
    },
    {
      id: 4,
      codigo: 'P004',
      nombre: 'ESPÁRRAGO',
      descripcion: 'ESPÁRRAGO FRESCO DE EXPORTACIÓN',
      activo: true,
      fechaCreacion,
      fechaActualizacion: null
    },
    {
      id: 5,
      codigo: 'P005',
      nombre: 'MANGO',
      descripcion: 'MANGO FRESCO DE EXPORTACIÓN',
      activo: false,
      fechaCreacion,
      fechaActualizacion: null
    }
  ];
}