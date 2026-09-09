import { MODULOS_SISTEMA_CONFIG } from '../../../core/constants/modulos-sistema.constant';
import {
  AccionPermiso,
  ModuloSistema,
  Permiso
} from '../../../core/models/permiso.model';
import { Rol } from '../models/rol.model';

const MODULOS_CATALOGO: readonly ModuloSistema[] = [
  ModuloSistema.CLIENTES,
  ModuloSistema.NAVIERAS,
  ModuloSistema.DESTINOS,
  ModuloSistema.OPERADORES_LOGISTICOS,
  ModuloSistema.PUERTOS_LLEGADA,
  ModuloSistema.PRODUCTOS,
  ModuloSistema.VARIEDADES,
  ModuloSistema.VIAS,
  ModuloSistema.SITUACIONES
];

function crearPermiso(
  modulo: ModuloSistema,
  acciones: readonly AccionPermiso[]
): Permiso {
  return {
    modulo,
    acciones: [...acciones]
  };
}

function crearPermisosAdministrador(): Permiso[] {
  return MODULOS_SISTEMA_CONFIG.map((modulo) =>
    crearPermiso(
      modulo.codigo,
      modulo.accionesDisponibles
    )
  );
}

function crearPermisosOperador(): Permiso[] {
  const permisosCatalogos = MODULOS_CATALOGO.map((modulo) =>
    crearPermiso(modulo, [AccionPermiso.CONSULTAR])
  );

  return [
    crearPermiso(ModuloSistema.PERFIL_USUARIO, [
      AccionPermiso.CONSULTAR,
      AccionPermiso.EDITAR
    ]),
    crearPermiso(ModuloSistema.REGISTRO_DESPACHO, [
      AccionPermiso.CONSULTAR,
      AccionPermiso.CREAR,
      AccionPermiso.EDITAR,
      AccionPermiso.ELIMINAR
    ]),
    crearPermiso(ModuloSistema.REPORTE_DESPACHO, [
      AccionPermiso.CONSULTAR,
      AccionPermiso.EXPORTAR
    ]),
    ...permisosCatalogos
  ];
}

function crearPermisosConsulta(): Permiso[] {
  const permisosCatalogos = MODULOS_CATALOGO.map((modulo) =>
    crearPermiso(modulo, [AccionPermiso.CONSULTAR])
  );

  return [
    crearPermiso(ModuloSistema.PERFIL_USUARIO, [
      AccionPermiso.CONSULTAR,
      AccionPermiso.EDITAR
    ]),
    crearPermiso(ModuloSistema.REGISTRO_DESPACHO, [
      AccionPermiso.CONSULTAR
    ]),
    crearPermiso(ModuloSistema.REPORTE_DESPACHO, [
      AccionPermiso.CONSULTAR,
      AccionPermiso.EXPORTAR
    ]),
    ...permisosCatalogos
  ];
}

export function crearRolesIniciales(): Rol[] {
  const fechaCreacion = new Date().toISOString();

  return [
    {
      id: 1,
      nombre: 'Administrador',
      descripcion: 'Acceso completo al sistema',
      esSistema: true,
      activo: true,
      fechaCreacion,
      fechaActualizacion: null,
      permisos: crearPermisosAdministrador()
    },
    {
      id: 2,
      nombre: 'Operador',
      descripcion: 'Gestiona despachos y consulta catálogos',
      esSistema: false,
      activo: true,
      fechaCreacion,
      fechaActualizacion: null,
      permisos: crearPermisosOperador()
    },
    {
      id: 3,
      nombre: 'Consulta',
      descripcion: 'Acceso de consulta y reportes',
      esSistema: false,
      activo: true,
      fechaCreacion,
      fechaActualizacion: null,
      permisos: crearPermisosConsulta()
    }
  ];
}