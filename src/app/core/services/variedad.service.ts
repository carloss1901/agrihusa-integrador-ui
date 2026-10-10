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
  Variedad,
  VariedadFormData,
  VariedadQuery
} from '../models/variedad.model';
import { CustomPageVariedadResponse } from '../../api/api/models/custom-page-variedad-response';
import { VariedadResponse } from '../../api/api/models/variedad-response';
import { VariedadControllerService } from '../../api/api/services/variedad-controller.service';
import { VariedadRegistroRequest } from '../../api/api/models/variedad-registro-request';

@Injectable({
  providedIn: 'root'
})
export class VariedadService {
  constructor(
    private variedadControllerService:
      VariedadControllerService
  ) {}

  listar(
    query: VariedadQuery
  ): Observable<PaginatedResult<Variedad>> {
    const page = Math.max(1, query.page);
    const pageSize = Math.max(1, query.pageSize);

    return this.consultarVariedades({
      texto: query.texto?.trim() || undefined,
      productoId: query.productoId,
      activo: query.estado,
      pagina: page,
      tamPagina: pageSize
    }).pipe(
      map((response) => ({
        items: (response.datos ?? []).map(
          (item) => this.mapearVariedad(item)
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
  ): Observable<Variedad | null> {
    return this.consultarVariedades({
      pagina: 1,
      tamPagina: 1000
    }).pipe(
      map((response) => {
        const variedad = (response.datos ?? [])
          .map((item) =>
            this.mapearVariedad(item)
          )
          .find((item) => item.id === id);

        return variedad ?? null;
      })
    );
  }

  listarPorProducto(
    productoId: number,
    soloActivas = true
  ): Observable<Variedad[]> {
    return this.consultarVariedades({
      productoId,
      activo: soloActivas ? true : undefined,
      pagina: 1,
      tamPagina: 1000
    }).pipe(
      map((response) =>
        (response.datos ?? [])
          .map((item) =>
            this.mapearVariedad(item)
          )
          .sort((a, b) =>
            a.nombre.localeCompare(b.nombre)
          )
      )
    );
  }

  crear(
    data: VariedadFormData
  ): Observable<Variedad> {
    const datos = this.normalizarDatos(data);

    const body: VariedadRegistroRequest = {
      variedadId: 0,
      productoId: datos.productoId,
      nombre: datos.nombre
    };

    return this.variedadControllerService
      .registrar1({ body })
      .pipe(
        switchMap(() =>
          this.consultarVariedades({
            texto: datos.nombre,
            productoId: datos.productoId,
            pagina: 1,
            tamPagina: 10
          })
        ),
        map((response) => {
          const variedadCreada =
            (response.datos ?? [])
              .map((item) =>
                this.mapearVariedad(item)
              )
              .find(
                (variedad) =>
                  variedad.productoId ===
                    datos.productoId &&
                  variedad.nombre === datos.nombre
              );

          if (!variedadCreada) {
            throw new Error(
              'La variedad fue registrada, pero no pudo recuperarse.'
            );
          }

          return variedadCreada;
        })
      );
  }

  actualizar(
    id: number,
    data: VariedadFormData
  ): Observable<Variedad | null> {
    const datos = this.normalizarDatos(data);

    const body: VariedadRegistroRequest = {
      variedadId: id,
      productoId: datos.productoId,
      nombre: datos.nombre
    };

    return this.variedadControllerService
      .actualizar1({ body })
      .pipe(
        switchMap(() =>
          this.consultarVariedades({
            texto: datos.nombre,
            productoId: datos.productoId,
            pagina: 1,
            tamPagina: 10
          })
        ),
        map((response) => {
          const variedadActualizada =
            (response.datos ?? [])
              .map((item) =>
                this.mapearVariedad(item)
              )
              .find(
                (variedad) =>
                  variedad.id === id
              );

          return variedadActualizada ?? null;
        })
      );
  }

  cambiarEstado(
    variedad: Variedad
  ): Observable<Variedad | null> {
    const nuevoEstado = !variedad.activo;

    return this.variedadControllerService
      .cambiarEstado1({
        variedadId: variedad.id,
        activo: nuevoEstado
      })
      .pipe(
        map(() => ({
          ...variedad,
          activo: nuevoEstado,
          fechaActualizacion:
            new Date().toISOString()
        }))
      );
  }

  existeNombre(
    productoId: number,
    nombre: string,
    idExcluir?: number
  ): Observable<boolean> {
    const nombreNormalizado =
      nombre.trim().toUpperCase();

    return this.consultarVariedades({
      texto: nombre.trim(),
      productoId,
      pagina: 1,
      tamPagina: 100
    }).pipe(
      map((response) =>
        (response.datos ?? []).some(
          (item) =>
            item.productoId === productoId &&
            (item.nombre ?? '')
              .trim()
              .toUpperCase() === nombreNormalizado &&
            item.variedadId !== idExcluir
        )
      )
    );
  }

  private consultarVariedades(
    params: {
      texto?: string;
      productoId?: number;
      activo?: boolean;
      pagina?: number;
      tamPagina?: number;
    }
  ): Observable<CustomPageVariedadResponse> {
    return this.variedadControllerService
      .listarVariedades(params)
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
                ) as CustomPageVariedadResponse
            )
          );
        })
      );
  }

  private normalizarDatos(
    data: VariedadFormData
  ): VariedadFormData {
    return {
      productoId: data.productoId,
      nombre: data.nombre.trim().toUpperCase()
    };
  }

  private mapearVariedad(
    response: VariedadResponse
  ): Variedad {
    return {
      id: response.variedadId ?? 0,
      productoId: response.productoId ?? 0,
      nombre: response.nombre ?? '',
      activo: response.activo ?? false,
      fechaCreacion: '',
      fechaActualizacion: null
    };
  }
}
