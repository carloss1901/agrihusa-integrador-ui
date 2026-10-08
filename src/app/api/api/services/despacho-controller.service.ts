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

import { CustomPageDespachoResponse } from '../models/custom-page-despacho-response';
import { DespachoRegistroRequest } from '../models/despacho-registro-request';
import { MessageResponse } from '../models/message-response';

@Injectable({
  providedIn: 'root',
})
export class DespachoControllerService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation listarDespachos
   */
  static readonly ListarDespachosPath = '/api/despachos';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `listarDespachos()` instead.
   *
   * This method doesn't expect any request body.
   */
  listarDespachos$Response(params?: {
    texto?: string;
    clienteId?: number;
    situacionId?: number;
    activo?: boolean;
    pagina?: number;
    tamPagina?: number;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<CustomPageDespachoResponse>> {

    const rb = new RequestBuilder(this.rootUrl, DespachoControllerService.ListarDespachosPath, 'get');
    if (params) {
      rb.query('texto', params.texto, {});
      rb.query('clienteId', params.clienteId, {});
      rb.query('situacionId', params.situacionId, {});
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
        return r as StrictHttpResponse<CustomPageDespachoResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `listarDespachos$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  listarDespachos(params?: {
    texto?: string;
    clienteId?: number;
    situacionId?: number;
    activo?: boolean;
    pagina?: number;
    tamPagina?: number;
    context?: HttpContext
  }
): Observable<CustomPageDespachoResponse> {

    return this.listarDespachos$Response(params).pipe(
      map((r: StrictHttpResponse<CustomPageDespachoResponse>) => r.body as CustomPageDespachoResponse)
    );
  }

  /**
   * Path part for operation actualizarDespacho
   */
  static readonly ActualizarDespachoPath = '/api/despachos';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `actualizarDespacho()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  actualizarDespacho$Response(params: {
    context?: HttpContext
    body: DespachoRegistroRequest
  }
): Observable<StrictHttpResponse<MessageResponse>> {

    const rb = new RequestBuilder(this.rootUrl, DespachoControllerService.ActualizarDespachoPath, 'put');
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
   * To access the full response (for headers, for example), `actualizarDespacho$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  actualizarDespacho(params: {
    context?: HttpContext
    body: DespachoRegistroRequest
  }
): Observable<MessageResponse> {

    return this.actualizarDespacho$Response(params).pipe(
      map((r: StrictHttpResponse<MessageResponse>) => r.body as MessageResponse)
    );
  }

  /**
   * Path part for operation registrarDespacho
   */
  static readonly RegistrarDespachoPath = '/api/despachos';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrarDespacho()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrarDespacho$Response(params: {
    context?: HttpContext
    body: DespachoRegistroRequest
  }
): Observable<StrictHttpResponse<MessageResponse>> {

    const rb = new RequestBuilder(this.rootUrl, DespachoControllerService.RegistrarDespachoPath, 'post');
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
   * To access the full response (for headers, for example), `registrarDespacho$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrarDespacho(params: {
    context?: HttpContext
    body: DespachoRegistroRequest
  }
): Observable<MessageResponse> {

    return this.registrarDespacho$Response(params).pipe(
      map((r: StrictHttpResponse<MessageResponse>) => r.body as MessageResponse)
    );
  }

  /**
   * Path part for operation cambiarEstadoDespacho
   */
  static readonly CambiarEstadoDespachoPath = '/api/despachos';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `cambiarEstadoDespacho()` instead.
   *
   * This method doesn't expect any request body.
   */
  cambiarEstadoDespacho$Response(params: {
    despachoId: number;
    activo: boolean;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<MessageResponse>> {

    const rb = new RequestBuilder(this.rootUrl, DespachoControllerService.CambiarEstadoDespachoPath, 'delete');
    if (params) {
      rb.query('despachoId', params.despachoId, {});
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
   * To access the full response (for headers, for example), `cambiarEstadoDespacho$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  cambiarEstadoDespacho(params: {
    despachoId: number;
    activo: boolean;
    context?: HttpContext
  }
): Observable<MessageResponse> {

    return this.cambiarEstadoDespacho$Response(params).pipe(
      map((r: StrictHttpResponse<MessageResponse>) => r.body as MessageResponse)
    );
  }

}
