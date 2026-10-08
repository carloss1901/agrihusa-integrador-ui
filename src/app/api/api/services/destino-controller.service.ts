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

import { CustomPageDestinoResponse } from '../models/custom-page-destino-response';
import { DestinoRegistroRequest } from '../models/destino-registro-request';
import { MessageResponse } from '../models/message-response';

@Injectable({
  providedIn: 'root',
})
export class DestinoControllerService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation listarDestinos
   */
  static readonly ListarDestinosPath = '/api/destinos';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `listarDestinos()` instead.
   *
   * This method doesn't expect any request body.
   */
  listarDestinos$Response(params?: {
    pais?: string;
    ciudad?: string;
    activo?: boolean;
    pagina?: number;
    tamPagina?: number;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<CustomPageDestinoResponse>> {

    const rb = new RequestBuilder(this.rootUrl, DestinoControllerService.ListarDestinosPath, 'get');
    if (params) {
      rb.query('pais', params.pais, {});
      rb.query('ciudad', params.ciudad, {});
      rb.query('activo', params.activo, {});
      rb.query('pagina', params.pagina, {});
      rb.query('tamPagina', params.tamPagina, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<CustomPageDestinoResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `listarDestinos$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  listarDestinos(params?: {
    pais?: string;
    ciudad?: string;
    activo?: boolean;
    pagina?: number;
    tamPagina?: number;
    context?: HttpContext
  }
): Observable<CustomPageDestinoResponse> {

    return this.listarDestinos$Response(params).pipe(
      map((r: StrictHttpResponse<CustomPageDestinoResponse>) => r.body as CustomPageDestinoResponse)
    );
  }

  /**
   * Path part for operation actualizar8
   */
  static readonly Actualizar8Path = '/api/destinos';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `actualizar8()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  actualizar8$Response(params: {
    context?: HttpContext
    body: DestinoRegistroRequest
  }
): Observable<StrictHttpResponse<MessageResponse>> {

    const rb = new RequestBuilder(this.rootUrl, DestinoControllerService.Actualizar8Path, 'put');
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
   * To access the full response (for headers, for example), `actualizar8$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  actualizar8(params: {
    context?: HttpContext
    body: DestinoRegistroRequest
  }
): Observable<MessageResponse> {

    return this.actualizar8$Response(params).pipe(
      map((r: StrictHttpResponse<MessageResponse>) => r.body as MessageResponse)
    );
  }

  /**
   * Path part for operation registrar9
   */
  static readonly Registrar9Path = '/api/destinos';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrar9()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrar9$Response(params: {
    context?: HttpContext
    body: DestinoRegistroRequest
  }
): Observable<StrictHttpResponse<MessageResponse>> {

    const rb = new RequestBuilder(this.rootUrl, DestinoControllerService.Registrar9Path, 'post');
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
   * To access the full response (for headers, for example), `registrar9$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrar9(params: {
    context?: HttpContext
    body: DestinoRegistroRequest
  }
): Observable<MessageResponse> {

    return this.registrar9$Response(params).pipe(
      map((r: StrictHttpResponse<MessageResponse>) => r.body as MessageResponse)
    );
  }

  /**
   * Path part for operation cambiarEstado8
   */
  static readonly CambiarEstado8Path = '/api/destinos';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `cambiarEstado8()` instead.
   *
   * This method doesn't expect any request body.
   */
  cambiarEstado8$Response(params: {
    destinoId: number;
    activo: boolean;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<MessageResponse>> {

    const rb = new RequestBuilder(this.rootUrl, DestinoControllerService.CambiarEstado8Path, 'delete');
    if (params) {
      rb.query('destinoId', params.destinoId, {});
      rb.query('activo', params.activo, {});
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
   * To access the full response (for headers, for example), `cambiarEstado8$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  cambiarEstado8(params: {
    destinoId: number;
    activo: boolean;
    context?: HttpContext
  }
): Observable<MessageResponse> {

    return this.cambiarEstado8$Response(params).pipe(
      map((r: StrictHttpResponse<MessageResponse>) => r.body as MessageResponse)
    );
  }

}
