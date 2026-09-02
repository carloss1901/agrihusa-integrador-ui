import { ModuloSistema } from '../../../core/models/permiso.model';
import { PaginationQuery } from '../../../core/models/pagination.model';

export const MODULO_AUTENTICACION =
    'autenticacion' as const;

export type ModuloBitacora =
    | ModuloSistema
    | typeof MODULO_AUTENTICACION;

export enum AccionBitacora {
    INICIO_SESION = 'inicio-sesion',
    INICIO_SESION_FALLIDO = 'inicio-sesion-fallido',
    CIERRE_SESION = 'cierre-sesion',
    CREAR = 'crear',
    EDITAR = 'editar',
    ACTIVAR = 'activar',
    DESACTIVAR = 'desactivar',
    CONSULTAR = 'consultar',
    EXPORTAR = 'exportar'
}

export enum ResultadoBitacora {
    EXITO = 'exito',
    ERROR = 'error'
}

export interface RegistroBitacora {
    id: number;
    fecha: string;
    usuarioId: number | null;
    nombreUsuario: string;
    modulo: ModuloBitacora;
    accion: AccionBitacora;
    entidad: string;
    registroId: number | null;
    detalle: string;
    resultado: ResultadoBitacora;
}

export type RegistroBitacoraCrearData = Omit<
    RegistroBitacora,
    'id' | 'fecha'
>;

export interface BitacoraQuery
    extends PaginationQuery {
    usuario?: string;
    accion?: AccionBitacora;
    modulo?: ModuloBitacora;
    resultado?: ResultadoBitacora;
    fechaDesde?: string;
    fechaHasta?: string;
}

export type BitacoraFilter = Omit<
    BitacoraQuery,
    'page' | 'pageSize'
>;