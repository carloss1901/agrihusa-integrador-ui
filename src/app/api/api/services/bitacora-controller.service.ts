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
import { MessageResponse } from '../models/message-response';

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
   * Path part for operation listarBitacoras
   */
  static readonly ListarBitacorasPath = '/api/bitacoras';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `listarBitacoras()` instead.
   *
   * This method doesn't expect any request body.
   */
  listarBitacoras$Response(params?: {
    usuarioId?: number;
    modulo?: string;
    accion?: string;
    entidad?: string;
    resultado?: string;
    activo?: boolean;
    pagina?: number;
    tamPagina?: number;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<CustomPageBitacoraResponse>> {

    const rb = new RequestBuilder(this.rootUrl, BitacoraControllerService.ListarBitacorasPath, 'get');
    if (params) {
      rb.query('usuarioId', params.usuarioId, {});
      rb.query('modulo', params.modulo, {});
      rb.query('accion', params.accion, {});
      rb.query('entidad', params.entidad, {});
      rb.query('resultado', params.resultado, {});
      rb.query('activo', params.activo, {});
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
   * To access the full response (for headers, for example), `listarBitacoras$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  listarBitacoras(params?: {
    usuarioId?: number;
    modulo?: string;
    accion?: string;
    entidad?: string;
    resultado?: string;
    activo?: boolean;
    pagina?: number;
    tamPagina?: number;
    context?: HttpContext
  }
): Observable<CustomPageBitacoraResponse> {

    return this.listarBitacoras$Response(params).pipe(
      map((r: StrictHttpResponse<CustomPageBitacoraResponse>) => r.body as CustomPageBitacoraResponse)
    );
  }

  /**
   * Path part for operation registrarBitacora
   */
  static readonly RegistrarBitacoraPath = '/api/bitacoras';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrarBitacora()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrarBitacora$Response(params: {
    context?: HttpContext
    body: BitacoraRegistroRequest
  }
): Observable<StrictHttpResponse<MessageResponse>> {

    const rb = new RequestBuilder(this.rootUrl, BitacoraControllerService.RegistrarBitacoraPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<MessageResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `registrarBitacora$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrarBitacora(params: {
    context?: HttpContext
    body: BitacoraRegistroRequest
  }
): Observable<MessageResponse> {

    return this.registrarBitacora$Response(params).pipe(
      map((r: StrictHttpResponse<MessageResponse>) => r.body as MessageResponse)
    );
  }

}
