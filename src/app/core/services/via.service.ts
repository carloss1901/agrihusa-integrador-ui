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
  Via,
  ViaFormData,
  ViaQuery
} from '../models/via.model';
import { CustomPageViaResponse } from '../../api/api/models/custom-page-via-response';
import { ViaResponse } from '../../api/api/models/via-response';
import { ViaControllerService } from '../../api/api/services/via-controller.service';
import { ViaRegistroRequest } from '../../api/api/models/via-registro-request';

@Injectable({
  providedIn: 'root'
})
export class ViaService {
  constructor(
    private viaControllerService:
      ViaControllerService
  ) {}

  listar(
    query: ViaQuery
  ): Observable<PaginatedResult<Via>> {
    const page = Math.max(1, query.page);
    const pageSize = Math.max(1, query.pageSize);

    return this.consultarVias({
      texto: query.texto?.trim() || undefined,
      activo: query.estado,
      pagina: page,
      tamPagina: pageSize
    }).pipe(
      map((response) => ({
        items: (response.datos ?? []).map(
          (item) => this.mapearVia(item)
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

  listarActivas(): Observable<Via[]> {
    return this.consultarVias({
      activo: true,
      pagina: 1,
      tamPagina: 1000
    }).pipe(
      map((response) =>
        (response.datos ?? [])
          .map((item) =>
            this.mapearVia(item)
          )
          .sort((a, b) =>
            a.descripcion.localeCompare(
              b.descripcion
            )
          )
      )
    );
  }

  obtenerPorId(
    id: number
  ): Observable<Via | null> {
    return this.consultarVias({
      pagina: 1,
      tamPagina: 1000
    }).pipe(
      map((response) => {
        const via = (response.datos ?? [])
          .map((item) =>
            this.mapearVia(item)
          )
          .find((item) => item.id === id);

        return via ?? null;
      })
    );
  }

  crear(
    data: ViaFormData
  ): Observable<Via> {
    const datos = this.normalizarDatos(data);

    const body: ViaRegistroRequest = {
      viaId: 0,
      descripcion: datos.descripcion
    };

    return this.viaControllerService
      .registrar({ body })
      .pipe(
        switchMap(() =>
          this.consultarVias({
            texto: datos.descripcion,
            pagina: 1,
            tamPagina: 10
          })
        ),
        map((response) => {
          const viaCreada =
            (response.datos ?? [])
              .map((item) =>
                this.mapearVia(item)
              )
              .find(
                (via) =>
                  via.descripcion ===
                    datos.descripcion
              );

          if (!viaCreada) {
            throw new Error(
              'La vía fue registrada, pero no pudo recuperarse.'
            );
          }

          return viaCreada;
        })
      );
  }

  actualizar(
    id: number,
    data: ViaFormData
  ): Observable<Via | null> {
    const datos = this.normalizarDatos(data);

    const body: ViaRegistroRequest = {
      viaId: id,
      descripcion: datos.descripcion
    };

    return this.viaControllerService
      .actualizar({ body })
      .pipe(
        switchMap(() =>
          this.consultarVias({
            texto: datos.descripcion,
            pagina: 1,
            tamPagina: 10
          })
        ),
        map((response) => {
          const viaActualizada =
            (response.datos ?? [])
              .map((item) =>
                this.mapearVia(item)
              )
              .find(
                (via) =>
                  via.id === id
              );

          return viaActualizada ?? null;
        })
      );
  }

  cambiarEstado(
    via: Via
  ): Observable<Via | null> {
    const nuevoEstado = !via.activo;

    return this.viaControllerService
      .cambiarEstado({
        viaId: via.id,
        activo: nuevoEstado
      })
      .pipe(
        map(() => ({
          ...via,
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

    return this.consultarVias({
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
            item.viaId !== idExcluir
        )
      )
    );
  }

  private consultarVias(
    params: {
      texto?: string;
      activo?: boolean;
      pagina?: number;
      tamPagina?: number;
    }
  ): Observable<CustomPageViaResponse> {
    return this.viaControllerService
      .listarVias(params)
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
                ) as CustomPageViaResponse
            )
          );
        })
      );
  }

  private normalizarDatos(
    data: ViaFormData
  ): ViaFormData {
    return {
      descripcion:
        data.descripcion.trim().toUpperCase()
    };
  }

  private mapearVia(
    response: ViaResponse
  ): Via {
    return {
      id: response.viaId ?? 0,
      descripcion: response.descripcion ?? '',
      activo: response.activo ?? false,
      fechaCreacion: '',
      fechaActualizacion: null
    };
  }
}
