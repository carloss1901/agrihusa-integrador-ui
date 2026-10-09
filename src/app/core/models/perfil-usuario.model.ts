export interface PerfilUsuarioActualizarData {
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string;
}

export interface CambioPasswordData {
  passwordActual: string;
  nuevaPassword: string;
  confirmarPassword: string;
}

export interface CambioPasswordServiceData {
  passwordActual: string;
  nuevaPassword: string;
}

export interface CambioPasswordResult {
  success: boolean;
  message: string;
}