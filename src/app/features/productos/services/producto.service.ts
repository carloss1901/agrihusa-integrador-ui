import { Injectable } from '@angular/core';
import {
  from,
  map,
  Observable,
  of,
  switchMap
} from 'rxjs';
import { PaginatedResult } from '../../../core/models/pagination.model';
import {
  Producto,
  ProductoFormData,
  ProductoQuery
} from '../models/producto.model';
import { CustomPageProductoResponse } from '../../../api/api/models/custom-page-producto-response';
import { ProductoResponse } from '../../../api/api/models/producto-response';
import { ProductoControllerService } from '../../../api/api/services/producto-controller.service';
import { ProductoRegistroRequest } from '../../../api/api/models/producto-registro-request';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  constructor(
    private productoControllerService:
      ProductoControllerService
  ) {}

  listar(
    query: ProductoQuery
  ): Observable<PaginatedResult<Producto>> {
    const page = Math.max(1, query.page);
    const pageSize = Math.max(1, query.pageSize);

    return this.consultarProductos({
      texto: query.texto?.trim() || undefined,
      activo: query.estado,
      pagina: page,
      tamPagina: pageSize
    }).pipe(
      map((response) => ({
        items: (response.datos ?? []).map(
          (item) => this.mapearProducto(item)
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
  ): Observable<Producto | null> {
    return this.consultarProductos({
      pagina: 1,
      tamPagina: 1000
    }).pipe(
      map((response) => {
        const producto = (response.datos ?? [])
          .map((item) =>
            this.mapearProducto(item)
          )
          .find((item) => item.id === id);

        return producto ?? null;
      })
    );
  }

  listarActivos(): Observable<Producto[]> {
    return this.consultarProductos({
      activo: true,
      pagina: 1,
      tamPagina: 1000
    }).pipe(
      map((response) =>
        (response.datos ?? [])
          .map((item) =>
            this.mapearProducto(item)
          )
          .sort((a, b) =>
            a.nombre.localeCompare(b.nombre)
          )
      )
    );
  }

  crear(
    data: ProductoFormData
  ): Observable<Producto> {
    const datos = this.normalizarDatos(data);

    const body: ProductoRegistroRequest = {
      productoId: 0,
      codigo: datos.codigo,
      nombre: datos.nombre,
      descripcion: datos.descripcion
    };

    return this.productoControllerService
      .registrar6({ body })
      .pipe(
        switchMap(() =>
          this.consultarProductos({
            texto: datos.codigo,
            pagina: 1,
            tamPagina: 10
          })
        ),
        map((response) => {
          const productoCreado =
            (response.datos ?? [])
              .map((item) =>
                this.mapearProducto(item)
              )
              .find(
                (producto) =>
                  producto.codigo === datos.codigo
              );

          if (!productoCreado) {
            throw new Error(
              'El producto fue registrado, pero no pudo recuperarse.'
            );
          }

          return productoCreado;
        })
      );
  }

  actualizar(
    id: number,
    data: ProductoFormData
  ): Observable<Producto | null> {
    const datos = this.normalizarDatos(data);

    const body: ProductoRegistroRequest = {
      productoId: id,
      codigo: datos.codigo,
      nombre: datos.nombre,
      descripcion: datos.descripcion
    };

    return this.productoControllerService
      .actualizar6({ body })
      .pipe(
        switchMap(() =>
          this.consultarProductos({
            texto: datos.codigo,
            pagina: 1,
            tamPagina: 10
          })
        ),
        map((response) => {
          const productoActualizado =
            (response.datos ?? [])
              .map((item) =>
                this.mapearProducto(item)
              )
              .find(
                (producto) =>
                  producto.id === id
              );

          return productoActualizado ?? null;
        })
      );
  }

  cambiarEstado(
    producto: Producto
  ): Observable<Producto | null> {
    const nuevoEstado = !producto.activo;

    return this.productoControllerService
      .cambiarEstado6({
        productoId: producto.id,
        activo: nuevoEstado
      })
      .pipe(
        map(() => ({
          ...producto,
          activo: nuevoEstado,
          fechaActualizacion:
            new Date().toISOString()
        }))
      );
  }

  existeCodigo(
    codigo: string,
    idExcluir?: number
  ): Observable<boolean> {
    const codigoNormalizado =
      this.normalizarCodigo(codigo);

    return this.consultarProductos({
      texto: codigoNormalizado,
      pagina: 1,
      tamPagina: 100
    }).pipe(
      map((response) =>
        (response.datos ?? []).some(
          (item) =>
            this.normalizarCodigo(
              item.codigo ?? ''
            ) === codigoNormalizado &&
            item.productoId !== idExcluir
        )
      )
    );
  }

  existeNombre(
    nombre: string,
    idExcluir?: number
  ): Observable<boolean> {
    const nombreNormalizado =
      nombre.trim().toUpperCase();

    return this.consultarProductos({
      texto: nombre.trim(),
      pagina: 1,
      tamPagina: 100
    }).pipe(
      map((response) =>
        (response.datos ?? []).some(
          (item) =>
            (item.nombre ?? '')
              .trim()
              .toUpperCase() === nombreNormalizado &&
            item.productoId !== idExcluir
        )
      )
    );
  }

  private consultarProductos(
    params: {
      texto?: string;
      activo?: boolean;
      pagina?: number;
      tamPagina?: number;
    }
  ): Observable<CustomPageProductoResponse> {
    return this.productoControllerService
      .listarProductos(params)
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
                ) as CustomPageProductoResponse
            )
          );
        })
      );
  }

  private normalizarDatos(
    data: ProductoFormData
  ): ProductoFormData {
    return {
      codigo: this.normalizarCodigo(data.codigo),
      nombre: data.nombre.trim().toUpperCase(),
      descripcion:
        data.descripcion.trim().toUpperCase()
    };
  }

  private normalizarCodigo(
    codigo: string
  ): string {
    return codigo
      .trim()
      .toUpperCase()
      .replace(/\s+/g, '');
  }

  private mapearProducto(
    response: ProductoResponse
  ): Producto {
    return {
      id: response.productoId ?? 0,
      codigo: response.codigo ?? '',
      nombre: response.nombre ?? '',
      descripcion: response.descripcion ?? '',
      activo: response.activo ?? false,
      fechaCreacion: '',
      fechaActualizacion: null
    };
  }
}