export const STORAGE_KEYS = {
  STORAGE_VERSION: 'agrihusa_storage_version',
  ROLES: 'agrihusa_roles',
  USUARIOS: 'agrihusa_usuarios',
  SESION: 'agrihusa_sesion',
  BITACORA: 'agrihusa_bitacora',
  CLIENTES: 'agrihusa_clientes',
  NAVIERAS: 'agrihusa_navieras',
  DESTINOS: 'agrihusa_destinos',
  OPERADORES_LOGISTICOS: 'agrihusa_operadores_logisticos',
  PUERTOS_LLEGADA: 'agrihusa_puertos_llegada',
  PRODUCTOS: 'agrihusa_productos',
  VARIEDADES: 'agrihusa_variedades',
  VIAS: 'agrihusa_vias',
  SITUACIONES: 'agrihusa_situaciones',
  DESPACHOS: 'agrihusa_despachos'
} as const;

export type StorageKey =
  (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];