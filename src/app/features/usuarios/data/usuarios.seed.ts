import { Usuario } from '../models/usuario.model';

export const CREDENCIALES_ADMIN_INICIAL = {
  nombreUsuario: 'ADMIN',
  password: 'Admin123*'
} as const;

export function crearUsuariosIniciales(
  passwordHash: string
): Usuario[] {
  const fechaCreacion = new Date().toISOString();

  return [
    {
      id: 1,
      nombreUsuario:
        CREDENCIALES_ADMIN_INICIAL.nombreUsuario,
      nombres: 'Administrador',
      apellidos: 'Sistema',
      correo: 'admin@agrihusa.local',
      telefono: '',
      rolId: 1,
      passwordHash,
      esSistema: true,
      debeCambiarPassword: false,
      ultimoAcceso: null,
      activo: true,
      fechaCreacion,
      fechaActualizacion: null
    }
  ];
}