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
  Situacion,
  SituacionFormData,
  SituacionQuery
} from '../models/situacion.model';
import { CustomPageSituacionResponse } from '../../api/api/models/custom-page-situacion-response';
import { SituacionResponse } from '../../api/api/models/situacion-response';
import { SituacionControllerService } from '../../api/api/services/situacion-controller.service';
import { SituacionRegistroRequest } from '../../api/api/models/situacion-registro-request';

@Injectable({
  providedIn: 'root'
})
export class SituacionService {
  constructor(
    private situacionControllerService:
      SituacionControllerService
  ) {}

  listar(
    query: SituacionQuery
  ): Observable<PaginatedResult<Situacion>> {
    const page = Math.max(1, query.page);
    const pageSize = Math.max(1, query.pageSize);

    return this.consultarSituaciones({
      texto: query.texto?.trim() || undefined,
      activo: query.estado,
      pagina: page,
      tamPagina: pageSize
    }).pipe(
      map((response) => ({
        items: (response.datos ?? []).map(
          (item) => this.mapearSituacion(item)
        ),
        totalItems: Number(
          response.paginacion?.totalElementos ?? 0
        ),
        page: Number(
          response.paginacion?.numeroPagina ?? page
        ),
        pageSize: Number(
          response.paginacion?.tamanioPagina ??
            pageSize
        )
      }))
    );
  }

  obtenerPorId(
    id: number
  ): Observable<Situacion | null> {
    return this.consultarSituaciones({
      pagina: 1,
      tamPagina: 1000
    }).pipe(
      map((response) => {
        const situacion = (response.datos ?? [])
          .map((item) =>
            this.mapearSituacion(item)
          )
          .find((item) => item.id === id);

        return situacion ?? null;
      })
    );
  }

  listarActivas(): Observable<Situacion[]> {
    return this.consultarSituaciones({
      activo: true,
      pagina: 1,
      tamPagina: 1000
    }).pipe(
      map((response) =>
        (response.datos ?? [])
          .map((item) =>
            this.mapearSituacion(item)
          )
          .sort((a, b) =>
            a.descripcion.localeCompare(
              b.descripcion
            )
          )
      )
    );
  }

  crear(
    data: SituacionFormData
  ): Observable<Situacion> {
    const datos = this.normalizarDatos(data);

    const body: SituacionRegistroRequest = {
      situacionId: 0,
      descripcion: datos.descripcion
    };

    return this.situacionControllerService
      .registrar3({ body })
      .pipe(
        switchMap(() =>
          this.consultarSituaciones({
            texto: datos.descripcion,
            pagina: 1,
            tamPagina: 10
          })
        ),
        map((response) => {
          const situacionCreada =
            (response.datos ?? [])
              .map((item) =>
                this.mapearSituacion(item)
              )
              .find(
                (situacion) =>
                  situacion.descripcion ===
                    datos.descripcion
              );

          if (!situacionCreada) {
            throw new Error(
              'La situación fue registrada, pero no pudo recuperarse.'
            );
          }

          return situacionCreada;
        })
      );
  }

  actualizar(
    id: number,
    data: SituacionFormData
  ): Observable<Situacion | null> {
    const datos = this.normalizarDatos(data);

    const body: SituacionRegistroRequest = {
      situacionId: id,
      descripcion: datos.descripcion
    };

    return this.situacionControllerService
      .actualizar3({ body })
      .pipe(
        switchMap(() =>
          this.consultarSituaciones({
            texto: datos.descripcion,
            pagina: 1,
            tamPagina: 10
          })
        ),
        map((response) => {
          const situacionActualizada =
            (response.datos ?? [])
              .map((item) =>
                this.mapearSituacion(item)
              )
              .find(
                (situacion) =>
                  situacion.id === id
              );

          return situacionActualizada ?? null;
        })
      );
  }

  cambiarEstado(
    situacion: Situacion
  ): Observable<Situacion | null> {
    const nuevoEstado = !situacion.activo;

    return this.situacionControllerService
      .cambiarEstado3({
        situacionId: situacion.id,
        activo: nuevoEstado
      })
      .pipe(
        map(() => ({
          ...situacion,
          activo: nuevoEstado,
          fechaActualizacion:
            new Date().toISOString()
        }))
      );
  }

  existeDescripcion(
    descripcion: string,
    idExcluir?: number
  ): Observable<boolean> {
    const descripcionNormalizada =
      descripcion.trim().toUpperCase();

    return this.consultarSituaciones({
      texto: descripcion.trim(),
      pagina: 1,
      tamPagina: 100
    }).pipe(
      map((response) =>
        (response.datos ?? []).some(
          (item) =>
            (item.descripcion ?? '')
              .trim()
              .toUpperCase() ===
                descripcionNormalizada &&
            item.situacionId !== idExcluir
        )
      )
    );
  }


  private consultarSituaciones(
    params: {
      texto?: string;
      activo?: boolean;
      pagina?: number;
      tamPagina?: number;
    }
  ): Observable<CustomPageSituacionResponse> {
    return this.situacionControllerService
      .listarSituaciones(params)
      .pipe(
        switchMap((response) => {
          const contenido: unknown = response;

          if (!(contenido instanceof Blob)) {
            return of(response);
          }

          return from(contenido.text()).pipe(
            map(
              (texto) =>
                JSON.parse(
                  texto
                ) as CustomPageSituacionResponse
            )
          );
        })
      );
  }

  private normalizarDatos(
    data: SituacionFormData
  ): SituacionFormData {
    return {
      descripcion:
        data.descripcion.trim().toUpperCase()
    };
  }

  private mapearSituacion(
    response: SituacionResponse
  ): Situacion {
    return {
      id: response.situacionId ?? 0,
      descripcion: response.descripcion ?? '',
      activo: response.activo ?? false,
      fechaCreacion: '',
      fechaActualizacion: null
    };
  }
}
