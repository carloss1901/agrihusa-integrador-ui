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

import { CustomPageNavieraResponse } from '../models/custom-page-naviera-response';
import { MessageResponse } from '../models/message-response';
import { NavieraRegistroRequest } from '../models/naviera-registro-request';

@Injectable({
  providedIn: 'root',
})
export class NavieraControllerService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation listarNavieras
   */
  static readonly ListarNavierasPath = '/api/navieras';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `listarNavieras()` instead.
   *
   * This method doesn't expect any request body.
   */
  listarNavieras$Response(params?: {
    texto?: string;
    pais?: string;
    activo?: boolean;
    pagina?: number;
    tamPagina?: number;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<CustomPageNavieraResponse>> {

    const rb = new RequestBuilder(this.rootUrl, NavieraControllerService.ListarNavierasPath, 'get');
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
        return r as StrictHttpResponse<CustomPageNavieraResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `listarNavieras$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  listarNavieras(params?: {
    texto?: string;
    pais?: string;
    activo?: boolean;
    pagina?: number;
    tamPagina?: number;
    context?: HttpContext
  }
): Observable<CustomPageNavieraResponse> {

    return this.listarNavieras$Response(params).pipe(
      map((r: StrictHttpResponse<CustomPageNavieraResponse>) => r.body as CustomPageNavieraResponse)
    );
  }

  /**
   * Path part for operation actualizarNaviera
   */
  static readonly ActualizarNavieraPath = '/api/navieras';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `actualizarNaviera()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  actualizarNaviera$Response(params: {
    context?: HttpContext
    body: NavieraRegistroRequest
  }
): Observable<StrictHttpResponse<MessageResponse>> {

    const rb = new RequestBuilder(this.rootUrl, NavieraControllerService.ActualizarNavieraPath, 'put');
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
   * To access the full response (for headers, for example), `actualizarNaviera$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  actualizarNaviera(params: {
    context?: HttpContext
    body: NavieraRegistroRequest
  }
): Observable<MessageResponse> {

    return this.actualizarNaviera$Response(params).pipe(
      map((r: StrictHttpResponse<MessageResponse>) => r.body as MessageResponse)
    );
  }

  /**
   * Path part for operation registrarNaviera
   */
  static readonly RegistrarNavieraPath = '/api/navieras';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrarNaviera()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrarNaviera$Response(params: {
    context?: HttpContext
    body: NavieraRegistroRequest
  }
): Observable<StrictHttpResponse<MessageResponse>> {

    const rb = new RequestBuilder(this.rootUrl, NavieraControllerService.RegistrarNavieraPath, 'post');
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
   * To access the full response (for headers, for example), `registrarNaviera$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrarNaviera(params: {
    context?: HttpContext
    body: NavieraRegistroRequest
  }
): Observable<MessageResponse> {

    return this.registrarNaviera$Response(params).pipe(
      map((r: StrictHttpResponse<MessageResponse>) => r.body as MessageResponse)
    );
  }

  /**
   * Path part for operation cambiarEstadoNaviera
   */
  static readonly CambiarEstadoNavieraPath = '/api/navieras';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `cambiarEstadoNaviera()` instead.
   *
   * This method doesn't expect any request body.
   */
  cambiarEstadoNaviera$Response(params: {
    navieraId: number;
    activo: boolean;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<MessageResponse>> {

    const rb = new RequestBuilder(this.rootUrl, NavieraControllerService.CambiarEstadoNavieraPath, 'delete');
    if (params) {
      rb.query('navieraId', params.navieraId, {});
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
   * To access the full response (for headers, for example), `cambiarEstadoNaviera$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  cambiarEstadoNaviera(params: {
    navieraId: number;
    activo: boolean;
    context?: HttpContext
  }
): Observable<MessageResponse> {

    return this.cambiarEstadoNaviera$Response(params).pipe(
      map((r: StrictHttpResponse<MessageResponse>) => r.body as MessageResponse)
    );
  }

}
