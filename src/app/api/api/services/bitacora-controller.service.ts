/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpContext } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { BitacoraRegistroRequest } from '../models/bitacora-registro-request';
import { CustomPageBitacoraResponse } from '../models/custom-page-bitacora-response';

@Injectable({
  providedIn: 'root',
})
export class BitacoraControllerService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation listar3
   */
  static readonly Listar3Path = '/api/bitacoras';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `listar3()` instead.
   *
   * This method doesn't expect any request body.
   */
  listar3$Response(params?: {
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
    context?: HttpContext
  }
): Observable<StrictHttpResponse<CustomPageBitacoraResponse>> {

    const rb = new RequestBuilder(this.rootUrl, BitacoraControllerService.Listar3Path, 'get');
    if (params) {
      rb.query('usuario', params.usuario, {});
      rb.query('modulo', params.modulo, {});
      rb.query('accion', params.accion, {});
      rb.query('entidad', params.entidad, {});
      rb.query('resultado', params.resultado, {});
      rb.query('activo', params.activo, {});
      rb.query('fechaDesde', params.fechaDesde, {});
      rb.query('fechaHasta', params.fechaHasta, {});
      rb.query('pagina', params.pagina, {});
      rb.query('tamPagina', params.tamPagina, {});
    }

    return this.http.request(rb.build({
      responseType: 'blob',
      accept: '*/*',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<CustomPageBitacoraResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `listar3$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  listar3(params?: {
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
    context?: HttpContext
  }
): Observable<CustomPageBitacoraResponse> {

    return this.listar3$Response(params).pipe(
      map((r: StrictHttpResponse<CustomPageBitacoraResponse>) => r.body as CustomPageBitacoraResponse)
    );
  }

  /**
   * Path part for operation registrar12
   */
  static readonly Registrar12Path = '/api/bitacoras';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrar12()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrar12$Response(params: {
    context?: HttpContext
    body: BitacoraRegistroRequest
  }
): Observable<StrictHttpResponse<{
}>> {

    const rb = new RequestBuilder(this.rootUrl, BitacoraControllerService.Registrar12Path, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'blob',
      accept: '*/*',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<{
        }>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `registrar12$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrar12(params: {
    context?: HttpContext
    body: BitacoraRegistroRequest
  }
): Observable<{
}> {

    return this.registrar12$Response(params).pipe(
      map((r: StrictHttpResponse<{
}>) => r.body as {
})
    );
  }

}
