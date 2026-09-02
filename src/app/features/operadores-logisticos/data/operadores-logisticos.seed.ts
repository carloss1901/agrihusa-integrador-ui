import { OperadorLogistico } from '../models/operador-logistico.model';

export function crearOperadoresLogisticosIniciales():
  OperadorLogistico[] {
  const fechaCreacion = new Date().toISOString();

  return [
    {
      id: 1,
      ruc: '20444444441',
      razonSocial: 'LOGÍSTICA ANDINA S.A.C.',
      nombreComercial: 'LOGÍSTICA ANDINA',
      contacto: 'Jorge Mendoza',
      correo: 'operaciones@andina.example',
      telefono: '987111222',
      direccion: 'Av. Industrial 1250, Lima',
      activo: true,
      fechaCreacion,
      fechaActualizacion: null
    },
    {
      id: 2,
      ruc: '20333333332',
      razonSocial: 'TRANSPORTES DEL PACÍFICO S.A.C.',
      nombreComercial: 'TRANSPORTES DEL PACÍFICO',
      contacto: 'Lucía Fernández',
      correo: 'contacto@pacifico-logistica.example',
      telefono: '986222333',
      direccion: 'Av. Néstor Gambetta 720, Callao',
      activo: true,
      fechaCreacion,
      fechaActualizacion: null
    },
    {
      id: 3,
      ruc: '20222222223',
      razonSocial: 'CARGA SEGURA OPERACIONES E.I.R.L.',
      nombreComercial: 'CARGA SEGURA',
      contacto: 'Miguel Salas',
      correo: 'operaciones@cargasegura.example',
      telefono: '985333444',
      direccion: 'Jr. Los Transportistas 410, Lima',
      activo: false,
      fechaCreacion,
      fechaActualizacion: null
    }
  ];
}