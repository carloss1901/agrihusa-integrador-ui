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

import { CustomPageVariedadResponse } from '../models/custom-page-variedad-response';
import { MessageResponse } from '../models/message-response';
import { VariedadRegistroRequest } from '../models/variedad-registro-request';

@Injectable({
  providedIn: 'root',
})
export class VariedadControllerService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation listarVariedades
   */
  static readonly ListarVariedadesPath = '/api/variedades';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `listarVariedades()` instead.
   *
   * This method doesn't expect any request body.
   */
  listarVariedades$Response(params?: {
    texto?: string;
    productoId?: number;
    activo?: boolean;
    pagina?: number;
    tamPagina?: number;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<CustomPageVariedadResponse>> {

    const rb = new RequestBuilder(this.rootUrl, VariedadControllerService.ListarVariedadesPath, 'get');
    if (params) {
      rb.query('texto', params.texto, {});
      rb.query('productoId', params.productoId, {});
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
        return r as StrictHttpResponse<CustomPageVariedadResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `listarVariedades$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  listarVariedades(params?: {
    texto?: string;
    productoId?: number;
    activo?: boolean;
    pagina?: number;
    tamPagina?: number;
    context?: HttpContext
  }
): Observable<CustomPageVariedadResponse> {

    return this.listarVariedades$Response(params).pipe(
      map((r: StrictHttpResponse<CustomPageVariedadResponse>) => r.body as CustomPageVariedadResponse)
    );
  }

  /**
   * Path part for operation actualizarVariedad
   */
  static readonly ActualizarVariedadPath = '/api/variedades';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `actualizarVariedad()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  actualizarVariedad$Response(params: {
    context?: HttpContext
    body: VariedadRegistroRequest
  }
): Observable<StrictHttpResponse<MessageResponse>> {

    const rb = new RequestBuilder(this.rootUrl, VariedadControllerService.ActualizarVariedadPath, 'put');
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
   * To access the full response (for headers, for example), `actualizarVariedad$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  actualizarVariedad(params: {
    context?: HttpContext
    body: VariedadRegistroRequest
  }
): Observable<MessageResponse> {

    return this.actualizarVariedad$Response(params).pipe(
      map((r: StrictHttpResponse<MessageResponse>) => r.body as MessageResponse)
    );
  }

  /**
   * Path part for operation registrarVariedad
   */
  static readonly RegistrarVariedadPath = '/api/variedades';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrarVariedad()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrarVariedad$Response(params: {
    context?: HttpContext
    body: VariedadRegistroRequest
  }
): Observable<StrictHttpResponse<MessageResponse>> {

    const rb = new RequestBuilder(this.rootUrl, VariedadControllerService.RegistrarVariedadPath, 'post');
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
   * To access the full response (for headers, for example), `registrarVariedad$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrarVariedad(params: {
    context?: HttpContext
    body: VariedadRegistroRequest
  }
): Observable<MessageResponse> {

    return this.registrarVariedad$Response(params).pipe(
      map((r: StrictHttpResponse<MessageResponse>) => r.body as MessageResponse)
    );
  }

  /**
   * Path part for operation cambiarEstadoVariedad
   */
  static readonly CambiarEstadoVariedadPath = '/api/variedades';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `cambiarEstadoVariedad()` instead.
   *
   * This method doesn't expect any request body.
   */
  cambiarEstadoVariedad$Response(params: {
    variedadId: number;
    activo: boolean;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<MessageResponse>> {

    const rb = new RequestBuilder(this.rootUrl, VariedadControllerService.CambiarEstadoVariedadPath, 'delete');
    if (params) {
      rb.query('variedadId', params.variedadId, {});
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
   * To access the full response (for headers, for example), `cambiarEstadoVariedad$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  cambiarEstadoVariedad(params: {
    variedadId: number;
    activo: boolean;
    context?: HttpContext
  }
): Observable<MessageResponse> {

    return this.cambiarEstadoVariedad$Response(params).pipe(
      map((r: StrictHttpResponse<MessageResponse>) => r.body as MessageResponse)
    );
  }

}
