export interface TokenPermiso {
  permisoId?: number;
  accion?: string;
  descripcion?: string;
}

export interface TokenModulo {
  moduloId?: number;
  codigo?: string;
  nombre?: string;
  permisos?: TokenPermiso[];
}

export interface TokenRol {
  rolId?: number;
  nombre?: string;
  modulos?: TokenModulo[];
}

export interface TokenPayload {
  sub?: string;
  usuarioId?: number;
  correo?: string;
  roles?: TokenRol[];
  exp?: number;
  iat?: number;
}
