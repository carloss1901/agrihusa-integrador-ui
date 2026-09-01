import {
  AccionPermiso,
  ModuloSistema
} from '../models/permiso.model';

export interface ModuloSistemaConfig {
  codigo: ModuloSistema;
  nombre: string;
  accionesDisponibles: readonly AccionPermiso[];
}

const ACCIONES_CRUD: readonly AccionPermiso[] = [
  AccionPermiso.CONSULTAR,
  AccionPermiso.CREAR,
  AccionPermiso.EDITAR,
  AccionPermiso.ELIMINAR
];

const ACCIONES_REPORTE: readonly AccionPermiso[] = [
  AccionPermiso.CONSULTAR,
  AccionPermiso.EXPORTAR
];

export const MODULOS_SISTEMA_CONFIG:
  readonly ModuloSistemaConfig[] = [
    {
      codigo: ModuloSistema.ROLES,
      nombre: 'Roles',
      accionesDisponibles: ACCIONES_CRUD
    },
    {
      codigo: ModuloSistema.USUARIOS,
      nombre: 'Usuarios',
      accionesDisponibles: ACCIONES_CRUD
    },
    {
      codigo: ModuloSistema.BITACORA,
      nombre: 'Bitácora',
      accionesDisponibles: ACCIONES_REPORTE
    },
    {
      codigo: ModuloSistema.PERFIL_USUARIO,
      nombre: 'Perfil de usuario',
      accionesDisponibles: [
        AccionPermiso.CONSULTAR,
        AccionPermiso.EDITAR
      ]
    },
    {
      codigo: ModuloSistema.REGISTRO_DESPACHO,
      nombre: 'Registro de despacho',
      accionesDisponibles: ACCIONES_CRUD
    },
    {
      codigo: ModuloSistema.REPORTE_DESPACHO,
      nombre: 'Reporte de despacho',
      accionesDisponibles: ACCIONES_REPORTE
    },
    {
      codigo: ModuloSistema.CLIENTES,
      nombre: 'Clientes',
      accionesDisponibles: ACCIONES_CRUD
    },
    {
      codigo: ModuloSistema.NAVIERAS,
      nombre: 'Navieras',
      accionesDisponibles: ACCIONES_CRUD
    },
    {
      codigo: ModuloSistema.DESTINOS,
      nombre: 'Destinos',
      accionesDisponibles: ACCIONES_CRUD
    },
    {
      codigo: ModuloSistema.OPERADORES_LOGISTICOS,
      nombre: 'Operadores logísticos',
      accionesDisponibles: ACCIONES_CRUD
    },
    {
      codigo: ModuloSistema.PUERTOS_LLEGADA,
      nombre: 'Puertos de llegada',
      accionesDisponibles: ACCIONES_CRUD
    },
    {
      codigo: ModuloSistema.PRODUCTOS,
      nombre: 'Productos',
      accionesDisponibles: ACCIONES_CRUD
    },
    {
      codigo: ModuloSistema.VARIEDADES,
      nombre: 'Variedades',
      accionesDisponibles: ACCIONES_CRUD
    },
    {
      codigo: ModuloSistema.VIAS,
      nombre: 'Vías',
      accionesDisponibles: ACCIONES_CRUD
    },
    {
      codigo: ModuloSistema.SITUACIONES,
      nombre: 'Situaciones',
      accionesDisponibles: ACCIONES_CRUD
    }
  ];