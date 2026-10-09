import { Injectable } from '@angular/core';
import {
  from,
  map,
  Observable,
  of,
  switchMap
} from 'rxjs';
import { PaginatedResult } from '../../../core/models/pagination.model';
import { VariedadService } from '../../variedades/services/variedad.service';
import {
  Despacho,
  DespachoFormData,
  DespachoQuery,
  UnidadMedidaDespacho
} from '../models/despacho.model';
import { DespachoControllerService } from '../../../api/api/services/despacho-controller.service';
import { CustomPageDespachoResponse } from '../../../api/api/models/custom-page-despacho-response';
import { DespachoResponse } from '../../../api/api/models/despacho-response';
import { DespachoRegistroRequest } from '../../../api/api/models/despacho-registro-request';

@Injectable({
  providedIn: 'root'
})
export class DespachoService {
  constructor(
    private despachoControllerService:
      DespachoControllerService,
    private variedadService: VariedadService
  ) {}

  listar(
    query: DespachoQuery
  ): Observable<PaginatedResult<Despacho>> {
    const page = Math.max(1, query.page);
    const pageSize = Math.max(1, query.pageSize);

    return this.consultarDespachos({
      texto: query.texto?.trim() || undefined,
      clienteId: query.clienteId,
      productoId: query.productoId,
      situacionId: query.situacionId,
      activo: query.estado,
      fechaDesde: query.fechaDesde,
      fechaHasta: query.fechaHasta,
      pagina: page,
      tamPagina: pageSize
    }).pipe(
      map((response) => ({
        items: (response.datos ?? []).map(
          (item) => this.mapearDespacho(item)
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

  listarTodos(): Observable<Despacho[]> {
    return this.consultarDespachos({
      pagina: 1,
      tamPagina: 1000
    }).pipe(
      map((response) =>
        (response.datos ?? [])
          .map((item) =>
            this.mapearDespacho(item)
          )
          .sort((a, b) =>
            b.fechaDespacho.localeCompare(
              a.fechaDespacho
            )
          )
      )
    );
  }

  obtenerPorId(
    id: number
  ): Observable<Despacho | null> {
    return this.consultarDespachos({
      pagina: 1,
      tamPagina: 1000
    }).pipe(
      map((response) => {
        const despacho = (response.datos ?? [])
          .map((item) =>
            this.mapearDespacho(item)
          )
          .find((item) => item.id === id);

        return despacho ?? null;
      })
    );
  }

  crear(
    data: DespachoFormData
  ): Observable<Despacho> {
    const datos = this.normalizarDatos(data);

    return this.listarTodos().pipe(
      switchMap((despachos) => {
        const codigo =
          this.generarCodigo(despachos);

        const body: DespachoRegistroRequest = {
          despachoId: 0,
          codigo,
          fechaDespacho: datos.fechaDespacho,
          fechaEstimadaLlegada:
            datos.fechaEstimadaLlegada,
          clienteId: datos.clienteId,
          navieraId: datos.navieraId,
          destinoId: datos.destinoId,
          operadorLogisticoId:
            datos.operadorLogisticoId,
          puertoLlegadaId:
            datos.puertoLlegadaId,
          productoId: datos.productoId,
          variedadId: datos.variedadId,
          viaId: datos.viaId,
          situacionId: datos.situacionId,
          cantidad: datos.cantidad,
          unidadMedida: datos.unidadMedida,
          numeroContenedor:
            datos.numeroContenedor,
          observaciones:
            datos.observaciones || undefined
        };

        return this.despachoControllerService
          .registrar10({ body })
          .pipe(
            switchMap(() =>
              this.consultarDespachos({
                texto: codigo,
                pagina: 1,
                tamPagina: 10
              })
            ),
            map((response) => {
              const despachoCreado =
                (response.datos ?? [])
                  .map((item) =>
                    this.mapearDespacho(item)
                  )
                  .find(
                    (despacho) =>
                      despacho.codigo === codigo
                  );

              if (!despachoCreado) {
                throw new Error(
                  'El despacho fue registrado, pero no pudo recuperarse.'
                );
              }

              return despachoCreado;
            })
          );
      })
    );
  }

  actualizar(
    id: number,
    data: DespachoFormData
  ): Observable<Despacho | null> {
    const datos = this.normalizarDatos(data);

    return this.obtenerPorId(id).pipe(
      switchMap((despachoActual) => {
        if (!despachoActual) {
          return of(null);
        }

        const body: DespachoRegistroRequest = {
          despachoId: id,
          codigo: despachoActual.codigo,
          fechaDespacho: datos.fechaDespacho,
          fechaEstimadaLlegada:
            datos.fechaEstimadaLlegada,
          clienteId: datos.clienteId,
          navieraId: datos.navieraId,
          destinoId: datos.destinoId,
          operadorLogisticoId:
            datos.operadorLogisticoId,
          puertoLlegadaId:
            datos.puertoLlegadaId,
          productoId: datos.productoId,
          variedadId: datos.variedadId,
          viaId: datos.viaId,
          situacionId: datos.situacionId,
          cantidad: datos.cantidad,
          unidadMedida: datos.unidadMedida,
          numeroContenedor:
            datos.numeroContenedor,
          observaciones:
            datos.observaciones || undefined
        };

        return this.despachoControllerService
          .actualizar10({ body })
          .pipe(
            switchMap(() =>
              this.obtenerPorId(id)
            )
          );
      })
    );
  }

  cambiarEstado(
    id: number
  ): Observable<Despacho | null> {
    return this.obtenerPorId(id).pipe(
      switchMap((despacho) => {
        if (!despacho) {
          return of(null);
        }

        const nuevoEstado = !despacho.activo;

        return this.despachoControllerService
          .cambiarEstado10({
            despachoId: id,
            activo: nuevoEstado
          })
          .pipe(
            map(() => ({
              ...despacho,
              activo: nuevoEstado,
              fechaActualizacion:
                new Date().toISOString()
            }))
          );
      })
    );
  }

  relacionProductoVariedadValida(
    productoId: number,
    variedadId: number
  ): Observable<boolean> {
    const productoIdNumero = Number(productoId);
    const variedadIdNumero = Number(variedadId);

    return this.variedadService
      .listarPorProducto(productoIdNumero, true)
      .pipe(
        map((variedades) =>
          variedades.some(
            (variedad) =>
              Number(variedad.id) === variedadIdNumero &&
              Number(variedad.productoId) === productoIdNumero
          )
        )
      );
  }

  private consultarDespachos(
    params: {
      texto?: string;
      clienteId?: number;
      productoId?: number;
      situacionId?: number;
      activo?: boolean;
      fechaDesde?: string;
      fechaHasta?: string;
      pagina?: number;
      tamPagina?: number;
    }
  ): Observable<CustomPageDespachoResponse> {
    return this.despachoControllerService
      .listar1(params)
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
                ) as CustomPageDespachoResponse
            )
          );
        })
      );
  }

private mapearDespacho(
    response: DespachoResponse
  ): Despacho {
    return {
      id: response.despachoId ?? 0,
      codigo: response.codigo ?? '',
      fechaDespacho: response.fechaDespacho ?? '',
      fechaEstimadaLlegada:
        response.fechaEstimadaLlegada ?? '',
      clienteId: response.clienteId ?? 0,
      navieraId: response.navieraId ?? 0,
      destinoId: response.destinoId ?? 0,
      operadorLogisticoId:
        response.operadorLogisticoId ?? 0,
      puertoLlegadaId:
        response.puertoLlegadaId ?? 0,
      productoId: response.productoId ?? 0,
      variedadId: response.variedadId ?? 0,
      viaId: response.viaId ?? 0,
      situacionId: response.situacionId ?? 0,
      cantidad: Number(response.cantidad ?? 0),
      unidadMedida: (
        response.unidadMedida ??
        UnidadMedidaDespacho.CAJAS
      ) as UnidadMedidaDespacho,
      numeroContenedor:
        response.numeroContenedor ?? '',
      observaciones: response.observaciones ?? '',
      activo: response.activo ?? false,
      fechaCreacion: '',
      fechaActualizacion: null
    };
  }

  private generarCodigo(
    despachos: Despacho[]
  ): string {
    const anio = new Date().getFullYear();
    const prefijo = `DES-${anio}-`;

    const ultimoCorrelativo = despachos
      .filter((despacho) =>
        despacho.codigo.startsWith(prefijo)
      )
      .reduce((mayor, despacho) => {
        const correlativo = Number(
          despacho.codigo.replace(prefijo, '')
        );

        return Number.isNaN(correlativo)
          ? mayor
          : Math.max(mayor, correlativo);
      }, 0);

    const siguiente = String(
      ultimoCorrelativo + 1
    ).padStart(4, '0');

    return `${prefijo}${siguiente}`;
  }

  private normalizarDatos(
    data: DespachoFormData
  ): DespachoFormData {
    return {
      fechaDespacho: data.fechaDespacho,
      fechaEstimadaLlegada:
        data.fechaEstimadaLlegada,
      clienteId: data.clienteId,
      navieraId: data.navieraId,
      destinoId: data.destinoId,
      operadorLogisticoId:
        data.operadorLogisticoId,
      puertoLlegadaId: data.puertoLlegadaId,
      productoId: data.productoId,
      variedadId: data.variedadId,
      viaId: data.viaId,
      situacionId: data.situacionId,
      cantidad: data.cantidad,
      unidadMedida: data.unidadMedida,
      numeroContenedor:
        data.numeroContenedor
          .trim()
          .toUpperCase(),
      observaciones:
        data.observaciones
          .trim()
          .toUpperCase()
    };
  }
}