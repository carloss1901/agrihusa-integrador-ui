import { Injectable } from '@angular/core';
import {
  from,
  map,
  Observable,
  of,
  switchMap
} from 'rxjs';
import { PaginatedResult } from '../models/pagination.model';
import {
  Rol,
  RolFormData,
  RolQuery
} from '../models/rol.model';
import { RolControllerService } from '../../api/api/services/rol-controller.service';
import { CustomPageRolResponse } from '../../api/api/models/custom-page-rol-response';
import { RolResponse } from '../../api/api/models/rol-response';
import { RolDetalleResponse } from '../../api/api/models/rol-detalle-response';
import {
  AccionPermiso,
  ModuloSistema
} from '../models/permiso.model';
import { RolRegistroRequest } from '../../api/api/models/rol-registro-request';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  constructor(
    private rolControllerService: RolControllerService
  ) {}

  listar(
    query: RolQuery
  ): Observable<PaginatedResult<Rol>> {
    const page = Math.max(1, query.page);
    const pageSize = Math.max(1, query.pageSize);

    return this.consultarRoles({
      nombre: query.nombre?.trim() || undefined,
      activo: query.estado,
      pagina: page,
      tamPagina: pageSize
    }).pipe(
      map((response) => ({
        items: (response.datos ?? []).map(
          (item) => this.mapearRol(item)
        ),
        totalItems: Number(
          response.paginacion?.totalElementos ?? 0
        ),
        page: Number(
          response.paginacion?.numeroPagina ?? page
        ),
        pageSize: Number(
          response.paginacion?.tamanioPagina ?? pageSize
        )
      }))
    );
  }

  obtenerPorId(id: number): Observable<Rol | null> {
    return this.rolControllerService
      .obtenerPorId1({ rolId: id })
      .pipe(
        switchMap((response) => {
          const contenido: unknown = response;

          if (!(contenido instanceof Blob)) {
            return of(response);
          }

          return from(contenido.text()).pipe(
            map(
              (texto) =>
                JSON.parse(texto) as RolDetalleResponse
            )
          );
        }),
        map((response) => ({
          id: response.rolId ?? 0,
          nombre: response.nombre ?? '',
          descripcion: response.descripcion ?? '',
          esSistema: response.esSistema ?? false,
          permisos: (response.permisos ?? []).map(
            (permiso) => ({
              modulo:
                (permiso.modulo ?? '') as ModuloSistema,
              acciones:
                (permiso.acciones ?? []) as AccionPermiso[]
            })
          ),
          activo: response.activo ?? false,
          fechaCreacion: '',
          fechaActualizacion: null
        }))
      );
  }

  crear(
    data: RolFormData
  ): Observable<Rol> {
    const nombre = data.nombre.trim();
    const descripcion = data.descripcion.trim();

    const body: RolRegistroRequest = {
      rolId: 0,
      nombre,
      descripcion,
      permisos: data.permisos.map((permiso) => ({
        modulo: permiso.modulo,
        acciones: [...permiso.acciones]
      }))
    };

    return this.rolControllerService
      .registrar4({ body })
      .pipe(
        switchMap(() =>
          this.consultarRoles({
            nombre,
            pagina: 1,
            tamPagina: 100
          })
        ),
        map((response) => {
          const rolCreado = (response.datos ?? [])
            .map((item) => this.mapearRol(item))
            .find(
              (rol) =>
                rol.nombre.trim().toUpperCase() ===
                nombre.toUpperCase()
            );

          if (!rolCreado) {
            throw new Error(
              'El rol fue registrado, pero no pudo recuperarse.'
            );
          }

          return {
            ...rolCreado,
            permisos: this.copiarPermisos(data.permisos)
          };
        })
      );
  }

  actualizar(
    id: number,
    data: RolFormData
  ): Observable<Rol | null> {
    const body: RolRegistroRequest = {
      rolId: id,
      nombre: data.nombre.trim(),
      descripcion: data.descripcion.trim(),
      permisos: data.permisos.map((permiso) => ({
        modulo: permiso.modulo,
        acciones: [...permiso.acciones]
      }))
    };

    return this.rolControllerService
      .actualizar4({ body })
      .pipe(
        switchMap(() =>
          this.obtenerPorId(id)
        )
      );
  }

  cambiarEstado(
    id: number
  ): Observable<Rol | null> {
    return this.obtenerPorId(id).pipe(
      switchMap((rol) => {
        if (!rol || rol.esSistema) {
          return of(null);
        }

        const nuevoEstado = !rol.activo;

        return this.rolControllerService
          .cambiarEstado4({
            rolId: id,
            activo: nuevoEstado
          })
          .pipe(
            map(() => ({
              ...rol,
              activo: nuevoEstado,
              fechaActualizacion:
                new Date().toISOString()
            }))
          );
      })
    );
  }

  existeNombre(
    nombre: string,
    idExcluir?: number
  ): Observable<boolean> {
    const nombreNormalizado =
      nombre.trim().toUpperCase();

    return this.consultarRoles({
      nombre: nombre.trim(),
      pagina: 1,
      tamPagina: 100
    }).pipe(
      map((response) =>
        (response.datos ?? []).some(
          (item) =>
            (item.nombre ?? '')
              .trim()
              .toUpperCase() === nombreNormalizado &&
            item.rolId !== idExcluir
        )
      )
    );
  }

  private consultarRoles(
    params: {
      nombre?: string;
      activo?: boolean;
      pagina?: number;
      tamPagina?: number;
    }
  ): Observable<CustomPageRolResponse> {
    return this.rolControllerService
      .listarRoles(params)
      .pipe(
        switchMap((response) => {
          const contenido: unknown = response;

          if (!(contenido instanceof Blob)) {
            return of(response);
          }

          return from(contenido.text()).pipe(
            map(
              (texto) =>
                JSON.parse(texto) as CustomPageRolResponse
            )
          );
        })
      );
  }

  private mapearRol(
    response: RolResponse
  ): Rol {
    return {
      id: response.rolId ?? 0,
      nombre: response.nombre ?? '',
      descripcion: response.descripcion ?? '',
      esSistema: response.esSistema ?? false,
      permisos: [],
      activo: response.activo ?? false,
      fechaCreacion: '',
      fechaActualizacion: null
    };
  }

  private copiarPermisos(
    permisos: RolFormData['permisos']
  ): RolFormData['permisos'] {
    return permisos.map((permiso) => ({
      ...permiso,
      acciones: [...permiso.acciones]
    }));
  }
}
