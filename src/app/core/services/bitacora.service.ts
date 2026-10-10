import { Injectable } from '@angular/core';
import {
  from,
  map,
  Observable,
  of,
  switchMap
} from 'rxjs';
import { BitacoraControllerService } from '../../api/api/services/bitacora-controller.service';
import { BitacoraRegistroRequest } from '../../api/api/models/bitacora-registro-request';
import { BitacoraResponse } from '../../api/api/models/bitacora-response';
import { CustomPageBitacoraResponse } from '../../api/api/models/custom-page-bitacora-response';
import { PaginatedResult } from '../models/pagination.model';
import {
  AccionBitacora,
  BitacoraQuery,
  ModuloBitacora,
  RegistroBitacora,
  RegistroBitacoraCrearData,
  ResultadoBitacora
} from '../models/bitacora.model';

@Injectable({
  providedIn: 'root'
})
export class BitacoraService {
  constructor(
    private bitacoraControllerService:
      BitacoraControllerService
  ) {}

  listar(
    query: BitacoraQuery
  ): Observable<PaginatedResult<RegistroBitacora>> {
    const page = Math.max(1, query.page);
    const pageSize = Math.max(1, query.pageSize);

    return this.consultarBitacoras({
      usuario: query.usuario?.trim() || undefined,
      modulo: query.modulo,
      accion: query.accion,
      resultado: query.resultado,
      fechaDesde: query.fechaDesde,
      fechaHasta: query.fechaHasta,
      pagina: page,
      tamPagina: pageSize
    }).pipe(
      map((response) => ({
        items: (response.datos ?? []).map(
          (item) => this.mapearBitacora(item)
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
  ): Observable<RegistroBitacora | null> {
    return this.consultarBitacoras({
      pagina: 1,
      tamPagina: 1000
    }).pipe(
      map((response) => {
        const registro = (response.datos ?? [])
          .map((item) =>
            this.mapearBitacora(item)
          )
          .find((item) => item.id === id);

        return registro ?? null;
      })
    );
  }

  registrar(
    data: RegistroBitacoraCrearData
  ): Observable<RegistroBitacora> {
    const body: BitacoraRegistroRequest = {
      usuarioId: data.usuarioId ?? undefined,
      modulo: data.modulo,
      accion: data.accion,
      entidad: data.entidad.trim(),
      registroId: data.registroId ?? undefined,
      detalle: data.detalle.trim().slice(0, 500),
      resultado: data.resultado
    };

    return this.bitacoraControllerService
      .registrar12({ body })
      .pipe(
        map(() => ({
          id: 0,
          fecha: new Date().toISOString(),
          usuarioId: data.usuarioId,
          nombreUsuario:
            data.nombreUsuario.trim() || 'SISTEMA',
          modulo: data.modulo,
          accion: data.accion,
          entidad: data.entidad.trim(),
          registroId: data.registroId,
          detalle: data.detalle.trim().slice(0, 500),
          resultado: data.resultado
        }))
      );
  }

  private consultarBitacoras(
    params: {
      usuario?: string;
      modulo?: string;
      accion?: string;
      entidad?: string;
      resultado?: string;
      activo?: boolean;
      fechaDesde?: string;
      fechaHasta?: string;
      pagina?: number;
      tamPagina?: number;
    }
  ): Observable<CustomPageBitacoraResponse> {
    return this.bitacoraControllerService
      .listar3(params)
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
                ) as CustomPageBitacoraResponse
            )
          );
        })
      );
  }

  private mapearBitacora(
    response: BitacoraResponse
  ): RegistroBitacora {
    return {
      id: response.bitacoraId ?? 0,
      fecha:
        response.fecha ??
        response.fechaCreacion ??
        '',
      usuarioId: response.usuarioId ?? null,
      nombreUsuario:
        response.nombreUsuario ?? 'SISTEMA',
      modulo:
        (response.modulo ?? '') as ModuloBitacora,
      accion:
        (response.accion ?? '') as AccionBitacora,
      entidad: response.entidad ?? '',
      registroId: response.registroId ?? null,
      detalle: response.detalle ?? '',
      resultado:
        (response.resultado ?? '') as ResultadoBitacora
    };
  }
}
