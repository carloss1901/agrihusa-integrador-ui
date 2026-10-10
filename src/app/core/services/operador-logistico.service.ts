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
  OperadorLogistico,
  OperadorLogisticoFormData,
  OperadorLogisticoQuery
} from '../models/operador-logistico.model';
import { CustomPageOperadorLogisticoResponse } from '../../api/api/models/custom-page-operador-logistico-response';
import { OperadorLogisticoResponse } from '../../api/api/models/operador-logistico-response';
import { OperadorLogisticoControllerService } from '../../api/api/services/operador-logistico-controller.service';
import { OperadorLogisticoRegistroRequest } from '../../api/api/models/operador-logistico-registro-request';

@Injectable({
  providedIn: 'root'
})
export class OperadorLogisticoService {
  constructor(
    private operadorControllerService:
      OperadorLogisticoControllerService
  ) {}

  listar(
      query: OperadorLogisticoQuery
    ): Observable<PaginatedResult<OperadorLogistico>> {
      const page = Math.max(1, query.page);
      const pageSize = Math.max(1, query.pageSize);

      return this.consultarOperadores({
        texto: query.texto?.trim() || undefined,
        activo: query.estado,
        pagina: page,
        tamPagina: pageSize
      }).pipe(
        map((response) => ({
          items: (response.datos ?? []).map(
            (item) => this.mapearOperador(item)
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
  ): Observable<OperadorLogistico | null> {
    return this.consultarOperadores({
      pagina: 1,
      tamPagina: 1000
    }).pipe(
      map((response) => {
        const operador = (response.datos ?? [])
          .map((item) =>
            this.mapearOperador(item)
          )
          .find((item) => item.id === id);

        return operador ?? null;
      })
    );
  }

  listarActivos(): Observable<OperadorLogistico[]> {
    return this.consultarOperadores({
      activo: true,
      pagina: 1,
      tamPagina: 1000
    }).pipe(
      map((response) =>
        (response.datos ?? [])
          .map((item) =>
            this.mapearOperador(item)
          )
          .sort((a, b) =>
            a.razonSocial.localeCompare(
              b.razonSocial
            )
          )
      )
    );
  }

  crear(
    data: OperadorLogisticoFormData
  ): Observable<OperadorLogistico> {
    const datos = this.normalizarDatos(data);

    const body: OperadorLogisticoRegistroRequest = {
      operadorLogisticoId: 0,
      ruc: datos.ruc,
      razonSocial: datos.razonSocial,
      nombreComercial:
        datos.nombreComercial || undefined,
      contacto: datos.contacto || undefined,
      correo: datos.correo || undefined,
      telefono: datos.telefono || undefined,
      direccion: datos.direccion || undefined
    };

    return this.operadorControllerService
      .registrar7({ body })
      .pipe(
        switchMap(() =>
          this.consultarOperadores({
            texto: datos.ruc,
            pagina: 1,
            tamPagina: 10
          })
        ),
        map((response) => {
          const operadorCreado =
            (response.datos ?? [])
              .map((item) =>
                this.mapearOperador(item)
              )
              .find(
                (operador) =>
                  operador.ruc === datos.ruc
              );

          if (!operadorCreado) {
            throw new Error(
              'El operador fue registrado, pero no pudo recuperarse.'
            );
          }

          return operadorCreado;
        })
      );
  }

  actualizar(
    id: number,
    data: OperadorLogisticoFormData
  ): Observable<OperadorLogistico | null> {
    const datos = this.normalizarDatos(data);

    const body: OperadorLogisticoRegistroRequest = {
      operadorLogisticoId: id,
      ruc: datos.ruc,
      razonSocial: datos.razonSocial,
      nombreComercial:
        datos.nombreComercial || undefined,
      contacto: datos.contacto || undefined,
      correo: datos.correo || undefined,
      telefono: datos.telefono || undefined,
      direccion: datos.direccion || undefined
    };

    return this.operadorControllerService
      .actualizar7({ body })
      .pipe(
        switchMap(() =>
          this.consultarOperadores({
            texto: datos.ruc,
            pagina: 1,
            tamPagina: 10
          })
        ),
        map((response) => {
          const operadorActualizado =
            (response.datos ?? [])
              .map((item) =>
                this.mapearOperador(item)
              )
              .find(
                (operador) =>
                  operador.id === id
              );

          return operadorActualizado ?? null;
        })
      );
  }

  cambiarEstado(
    operador: OperadorLogistico
  ): Observable<OperadorLogistico | null> {
    const nuevoEstado = !operador.activo;

    return this.operadorControllerService
      .cambiarEstado7({
        operadorLogisticoId: operador.id,
        activo: nuevoEstado
      })
      .pipe(
        map(() => ({
          ...operador,
          activo: nuevoEstado,
          fechaActualizacion:
            new Date().toISOString()
        }))
      );
  }

  existeRuc(
    ruc: string,
    idExcluir?: number
  ): Observable<boolean> {
    const rucNormalizado =
      this.normalizarRuc(ruc);

    return this.consultarOperadores({
      texto: rucNormalizado,
      pagina: 1,
      tamPagina: 100
    }).pipe(
      map((response) =>
        (response.datos ?? []).some(
          (item) =>
            this.normalizarRuc(
              item.ruc ?? ''
            ) === rucNormalizado &&
            item.operadorLogisticoId !== idExcluir
        )
      )
    );
  }

  existeRazonSocial(
    razonSocial: string,
    idExcluir?: number
  ): Observable<boolean> {
    const razonNormalizada =
      razonSocial.trim().toUpperCase();

    return this.consultarOperadores({
      texto: razonSocial.trim(),
      pagina: 1,
      tamPagina: 100
    }).pipe(
      map((response) =>
        (response.datos ?? []).some(
          (item) =>
            (item.razonSocial ?? '')
              .trim()
              .toUpperCase() === razonNormalizada &&
            item.operadorLogisticoId !== idExcluir
        )
      )
    );
  }

  private consultarOperadores(
    params: {
      texto?: string;
      activo?: boolean;
      pagina?: number;
      tamPagina?: number;
    }
  ): Observable<CustomPageOperadorLogisticoResponse> {
    return this.operadorControllerService
      .listarOperadores(params)
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
                ) as CustomPageOperadorLogisticoResponse
            )
          );
        })
      );
  }

  private normalizarDatos(
    data: OperadorLogisticoFormData
  ): OperadorLogisticoFormData {
    return {
      ruc: this.normalizarRuc(data.ruc),
      razonSocial:
        data.razonSocial.trim().toUpperCase(),
      nombreComercial:
        data.nombreComercial.trim().toUpperCase(),
      contacto: data.contacto.trim(),
      correo: data.correo.trim().toLowerCase(),
      telefono: data.telefono.trim(),
      direccion: data.direccion.trim()
    };
  }

  private normalizarRuc(ruc: string): string {
    return ruc.replace(/\D/g, '');
  }

  private mapearOperador(
    response: OperadorLogisticoResponse
  ): OperadorLogistico {
    return {
      id: response.operadorLogisticoId ?? 0,
      ruc: response.ruc ?? '',
      razonSocial: response.razonSocial ?? '',
      nombreComercial:
        response.nombreComercial ?? '',
      contacto: response.contacto ?? '',
      correo: response.correo ?? '',
      telefono: response.telefono ?? '',
      direccion: response.direccion ?? '',
      activo: response.activo ?? false,
      fechaCreacion: '',
      fechaActualizacion: null
    };
  }
}
