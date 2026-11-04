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

import { CustomPagePuertoLlegadaResponse } from '../models/custom-page-puerto-llegada-response';
import { MessageResponse } from '../models/message-response';
import { PuertoLlegadaRegistroRequest } from '../models/puerto-llegada-registro-request';

@Injectable({
  providedIn: 'root',
})
export class PuertoLlegadaControllerService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation listarPuertos
   */
  static readonly ListarPuertosPath = '/api/puertos-llegada';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `listarPuertos()` instead.
   *
   * This method doesn't expect any request body.
   */
  listarPuertos$Response(params?: {
    texto?: string;
    pais?: string;
    activo?: boolean;
    pagina?: number;
    tamPagina?: number;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<CustomPagePuertoLlegadaResponse>> {

    const rb = new RequestBuilder(this.rootUrl, PuertoLlegadaControllerService.ListarPuertosPath, 'get');
    if (params) {
      rb.query('texto', params.texto, {});
      rb.query('pais', params.pais, {});
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
        return r as StrictHttpResponse<CustomPagePuertoLlegadaResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `listarPuertos$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  listarPuertos(params?: {
    texto?: string;
    pais?: string;
    activo?: boolean;
    pagina?: number;
    tamPagina?: number;
    context?: HttpContext
  }
): Observable<CustomPagePuertoLlegadaResponse> {

    return this.listarPuertos$Response(params).pipe(
      map((r: StrictHttpResponse<CustomPagePuertoLlegadaResponse>) => r.body as CustomPagePuertoLlegadaResponse)
    );
  }

  /**
   * Path part for operation actualizarPuertoLlegada
   */
  static readonly ActualizarPuertoLlegadaPath = '/api/puertos-llegada';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `actualizarPuertoLlegada()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  actualizarPuertoLlegada$Response(params: {
    context?: HttpContext
    body: PuertoLlegadaRegistroRequest
  }
): Observable<StrictHttpResponse<MessageResponse>> {

    const rb = new RequestBuilder(this.rootUrl, PuertoLlegadaControllerService.ActualizarPuertoLlegadaPath, 'put');
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
   * To access the full response (for headers, for example), `actualizarPuertoLlegada$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  actualizarPuertoLlegada(params: {
    context?: HttpContext
    body: PuertoLlegadaRegistroRequest
  }
): Observable<MessageResponse> {

    return this.actualizarPuertoLlegada$Response(params).pipe(
      map((r: StrictHttpResponse<MessageResponse>) => r.body as MessageResponse)
    );
  }

  /**
   * Path part for operation registrarPuertoLlegada
   */
  static readonly RegistrarPuertoLlegadaPath = '/api/puertos-llegada';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrarPuertoLlegada()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrarPuertoLlegada$Response(params: {
    context?: HttpContext
    body: PuertoLlegadaRegistroRequest
  }
): Observable<StrictHttpResponse<MessageResponse>> {

    const rb = new RequestBuilder(this.rootUrl, PuertoLlegadaControllerService.RegistrarPuertoLlegadaPath, 'post');
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
   * To access the full response (for headers, for example), `registrarPuertoLlegada$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrarPuertoLlegada(params: {
    context?: HttpContext
    body: PuertoLlegadaRegistroRequest
  }
): Observable<MessageResponse> {

    return this.registrarPuertoLlegada$Response(params).pipe(
      map((r: StrictHttpResponse<MessageResponse>) => r.body as MessageResponse)
    );
  }

  /**
   * Path part for operation cambiarEstadoPuertoLlegada
   */
  static readonly CambiarEstadoPuertoLlegadaPath = '/api/puertos-llegada';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `cambiarEstadoPuertoLlegada()` instead.
   *
   * This method doesn't expect any request body.
   */
  cambiarEstadoPuertoLlegada$Response(params: {
    puertoLlegadaId: number;
    activo: boolean;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<MessageResponse>> {

    const rb = new RequestBuilder(this.rootUrl, PuertoLlegadaControllerService.CambiarEstadoPuertoLlegadaPath, 'delete');
    if (params) {
      rb.query('puertoLlegadaId', params.puertoLlegadaId, {});
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
   * To access the full response (for headers, for example), `cambiarEstadoPuertoLlegada$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  cambiarEstadoPuertoLlegada(params: {
    puertoLlegadaId: number;
    activo: boolean;
    context?: HttpContext
  }
): Observable<MessageResponse> {

    return this.cambiarEstadoPuertoLlegada$Response(params).pipe(
      map((r: StrictHttpResponse<MessageResponse>) => r.body as MessageResponse)
    );
  }

}
