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
  PuertoLlegada,
  PuertoLlegadaFormData,
  PuertoLlegadaQuery
} from '../models/puerto-llegada.model';
import { CustomPagePuertoLlegadaResponse } from '../../../api/api/models/custom-page-puerto-llegada-response';
import { PuertoLlegadaResponse } from '../../../api/api/models/puerto-llegada-response';
import { PuertoLlegadaControllerService } from '../../../api/api/services/puerto-llegada-controller.service';
import { PuertoLlegadaRegistroRequest } from '../../../api/api/models/puerto-llegada-registro-request';

@Injectable({
  providedIn: 'root'
})
export class PuertoLlegadaService {
  constructor(
    private puertoControllerService:
      PuertoLlegadaControllerService
  ) {}

  listar(
      query: PuertoLlegadaQuery
    ): Observable<PaginatedResult<PuertoLlegada>> {
      const page = Math.max(1, query.page);
      const pageSize = Math.max(1, query.pageSize);

      return this.consultarPuertos({
        texto: query.texto?.trim() || undefined,
        pais: query.pais?.trim() || undefined,
        activo: query.estado,
        pagina: page,
        tamPagina: pageSize
      }).pipe(
        map((response) => ({
          items: (response.datos ?? []).map(
            (item) => this.mapearPuerto(item)
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
  ): Observable<PuertoLlegada | null> {
    return this.consultarPuertos({
      pagina: 1,
      tamPagina: 1000
    }).pipe(
      map((response) => {
        const puerto = (response.datos ?? [])
          .map((item) =>
            this.mapearPuerto(item)
          )
          .find((item) => item.id === id);

        return puerto ?? null;
      })
    );
  }

  listarActivos(): Observable<PuertoLlegada[]> {
    return this.consultarPuertos({
      activo: true,
      pagina: 1,
      tamPagina: 1000
    }).pipe(
      map((response) =>
        (response.datos ?? [])
          .map((item) =>
            this.mapearPuerto(item)
          )
          .sort((a, b) =>
            `${a.pais} ${a.puerto}`.localeCompare(
              `${b.pais} ${b.puerto}`
            )
          )
      )
    );
  }

  crear(
    data: PuertoLlegadaFormData
  ): Observable<PuertoLlegada> {
    const datos = this.normalizarDatos(data);

    const body: PuertoLlegadaRegistroRequest = {
      puertoLlegadaId: 0,
      codigo: datos.codigo,
      puerto: datos.puerto,
      pais: datos.pais
    };

    return this.puertoControllerService
      .registrar5({ body })
      .pipe(
        switchMap(() =>
          this.consultarPuertos({
            texto: datos.codigo,
            pagina: 1,
            tamPagina: 10
          })
        ),
        map((response) => {
          const puertoCreado =
            (response.datos ?? [])
              .map((item) =>
                this.mapearPuerto(item)
              )
              .find(
                (puerto) =>
                  puerto.codigo === datos.codigo
              );

          if (!puertoCreado) {
            throw new Error(
              'El puerto fue registrado, pero no pudo recuperarse.'
            );
          }

          return puertoCreado;
        })
      );
  }

  actualizar(
    id: number,
    data: PuertoLlegadaFormData
  ): Observable<PuertoLlegada | null> {
    const datos = this.normalizarDatos(data);

    const body: PuertoLlegadaRegistroRequest = {
      puertoLlegadaId: id,
      codigo: datos.codigo,
      puerto: datos.puerto,
      pais: datos.pais
    };

    return this.puertoControllerService
      .actualizar5({ body })
      .pipe(
        switchMap(() =>
          this.consultarPuertos({
            texto: datos.codigo,
            pagina: 1,
            tamPagina: 10
          })
        ),
        map((response) => {
          const puertoActualizado =
            (response.datos ?? [])
              .map((item) =>
                this.mapearPuerto(item)
              )
              .find(
                (puerto) =>
                  puerto.id === id
              );

          return puertoActualizado ?? null;
        })
      );
  }

  cambiarEstado(
    puerto: PuertoLlegada
  ): Observable<PuertoLlegada | null> {
    const nuevoEstado = !puerto.activo;

    return this.puertoControllerService
      .cambiarEstado5({
        puertoLlegadaId: puerto.id,
        activo: nuevoEstado
      })
      .pipe(
        map(() => ({
          ...puerto,
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

    return this.consultarPuertos({
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
            item.puertoLlegadaId !== idExcluir
        )
      )
    );
  }

  existePuerto(
    pais: string,
    nombrePuerto: string,
    idExcluir?: number
  ): Observable<boolean> {
    const datos = this.normalizarDatos({
      codigo: '',
      pais,
      puerto: nombrePuerto
    });

    return this.consultarPuertos({
      texto: datos.puerto,
      pais: datos.pais,
      pagina: 1,
      tamPagina: 100
    }).pipe(
      map((response) =>
        (response.datos ?? []).some(
          (item) =>
            (item.pais ?? '')
              .trim()
              .toUpperCase() === datos.pais &&
            (item.puerto ?? '')
              .trim()
              .toUpperCase() === datos.puerto &&
            item.puertoLlegadaId !== idExcluir
        )
      )
    );
  }

  private consultarPuertos(
    params: {
      texto?: string;
      pais?: string;
      activo?: boolean;
      pagina?: number;
      tamPagina?: number;
    }
  ): Observable<CustomPagePuertoLlegadaResponse> {
    return this.puertoControllerService
      .listarPuertos(params)
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
                ) as CustomPagePuertoLlegadaResponse
            )
          );
        })
      );
  }

  private normalizarDatos(
    data: PuertoLlegadaFormData
  ): PuertoLlegadaFormData {
    return {
      codigo: this.normalizarCodigo(data.codigo),
      puerto: data.puerto.trim().toUpperCase(),
      pais: data.pais.trim().toUpperCase()
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

  private mapearPuerto(
    response: PuertoLlegadaResponse
  ): PuertoLlegada {
    return {
      id: response.puertoLlegadaId ?? 0,
      codigo: response.codigo ?? '',
      puerto: response.puerto ?? '',
      pais: response.pais ?? '',
      activo: response.activo ?? false,
      fechaCreacion: '',
      fechaActualizacion: null
    };
  }
}