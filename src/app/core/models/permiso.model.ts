export enum ModuloSistema {
  ROLES = 'roles',
  USUARIOS = 'usuarios',
  BITACORA = 'bitacora',
  PERFIL_USUARIO = 'perfil-usuario',
  REGISTRO_DESPACHO = 'registro-despacho',
  REPORTE_DESPACHO = 'reporte-despacho',
  CLIENTES = 'clientes',
  NAVIERAS = 'navieras',
  DESTINOS = 'destinos',
  OPERADORES_LOGISTICOS = 'operadores-logisticos',
  PUERTOS_LLEGADA = 'puertos-llegada',
  PRODUCTOS = 'productos',
  VARIEDADES = 'variedades',
  VIAS = 'vias',
  SITUACIONES = 'situaciones'
}

export enum AccionPermiso {
  CONSULTAR = 'consultar',
  CREAR = 'crear',
  EDITAR = 'editar',
  ELIMINAR = 'eliminar',
  EXPORTAR = 'exportar'
}

export interface Permiso {
  modulo: ModuloSistema;
  acciones: AccionPermiso[];
}