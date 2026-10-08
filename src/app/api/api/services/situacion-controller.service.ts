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

import { CustomPageSituacionResponse } from '../models/custom-page-situacion-response';
import { MessageResponse } from '../models/message-response';
import { SituacionRegistroRequest } from '../models/situacion-registro-request';

@Injectable({
  providedIn: 'root',
})
export class SituacionControllerService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation listarSituaciones
   */
  static readonly ListarSituacionesPath = '/api/situaciones';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `listarSituaciones()` instead.
   *
   * This method doesn't expect any request body.
   */
  listarSituaciones$Response(params?: {
    descripcion?: string;
    activo?: boolean;
    pagina?: number;
    tamPagina?: number;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<CustomPageSituacionResponse>> {

    const rb = new RequestBuilder(this.rootUrl, SituacionControllerService.ListarSituacionesPath, 'get');
    if (params) {
      rb.query('descripcion', params.descripcion, {});
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
        return r as StrictHttpResponse<CustomPageSituacionResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `listarSituaciones$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  listarSituaciones(params?: {
    descripcion?: string;
    activo?: boolean;
    pagina?: number;
    tamPagina?: number;
    context?: HttpContext
  }
): Observable<CustomPageSituacionResponse> {

    return this.listarSituaciones$Response(params).pipe(
      map((r: StrictHttpResponse<CustomPageSituacionResponse>) => r.body as CustomPageSituacionResponse)
    );
  }

  /**
   * Path part for operation actualizarSituacion
   */
  static readonly ActualizarSituacionPath = '/api/situaciones';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `actualizarSituacion()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  actualizarSituacion$Response(params: {
    context?: HttpContext
    body: SituacionRegistroRequest
  }
): Observable<StrictHttpResponse<MessageResponse>> {

    const rb = new RequestBuilder(this.rootUrl, SituacionControllerService.ActualizarSituacionPath, 'put');
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
   * To access the full response (for headers, for example), `actualizarSituacion$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  actualizarSituacion(params: {
    context?: HttpContext
    body: SituacionRegistroRequest
  }
): Observable<MessageResponse> {

    return this.actualizarSituacion$Response(params).pipe(
      map((r: StrictHttpResponse<MessageResponse>) => r.body as MessageResponse)
    );
  }

  /**
   * Path part for operation registrarSituacion
   */
  static readonly RegistrarSituacionPath = '/api/situaciones';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrarSituacion()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrarSituacion$Response(params: {
    context?: HttpContext
    body: SituacionRegistroRequest
  }
): Observable<StrictHttpResponse<MessageResponse>> {

    const rb = new RequestBuilder(this.rootUrl, SituacionControllerService.RegistrarSituacionPath, 'post');
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
   * To access the full response (for headers, for example), `registrarSituacion$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrarSituacion(params: {
    context?: HttpContext
    body: SituacionRegistroRequest
  }
): Observable<MessageResponse> {

    return this.registrarSituacion$Response(params).pipe(
      map((r: StrictHttpResponse<MessageResponse>) => r.body as MessageResponse)
    );
  }

  /**
   * Path part for operation cambiarEstadoSituacion
   */
  static readonly CambiarEstadoSituacionPath = '/api/situaciones';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `cambiarEstadoSituacion()` instead.
   *
   * This method doesn't expect any request body.
   */
  cambiarEstadoSituacion$Response(params: {
    situacionId: number;
    activo: boolean;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<MessageResponse>> {

    const rb = new RequestBuilder(this.rootUrl, SituacionControllerService.CambiarEstadoSituacionPath, 'delete');
    if (params) {
      rb.query('situacionId', params.situacionId, {});
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
   * To access the full response (for headers, for example), `cambiarEstadoSituacion$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  cambiarEstadoSituacion(params: {
    situacionId: number;
    activo: boolean;
    context?: HttpContext
  }
): Observable<MessageResponse> {

    return this.cambiarEstadoSituacion$Response(params).pipe(
      map((r: StrictHttpResponse<MessageResponse>) => r.body as MessageResponse)
    );
  }

}
