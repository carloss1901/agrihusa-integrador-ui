export interface LoginCredentials {
  nombreUsuario: string;
  password: string;
}

export interface SesionUsuario {
  token: string;
  usuarioId: number;
  nombreUsuario: string;
  nombreCompleto: string;
  rolId: number;
  fechaInicio: string;
  fechaExpiracion: string;
  debeCambiarPassword: boolean;
}

export interface LoginResult {
  success: boolean;
  message: string;
  sesion: SesionUsuario | null;
}