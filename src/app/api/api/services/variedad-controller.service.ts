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
   * Path part for operation actualizar1
   */
  static readonly Actualizar1Path = '/api/variedades';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `actualizar1()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  actualizar1$Response(params: {
    context?: HttpContext
    body: VariedadRegistroRequest
  }
): Observable<StrictHttpResponse<MessageResponse>> {

    const rb = new RequestBuilder(this.rootUrl, VariedadControllerService.Actualizar1Path, 'put');
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
   * To access the full response (for headers, for example), `actualizar1$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  actualizar1(params: {
    context?: HttpContext
    body: VariedadRegistroRequest
  }
): Observable<MessageResponse> {

    return this.actualizar1$Response(params).pipe(
      map((r: StrictHttpResponse<MessageResponse>) => r.body as MessageResponse)
    );
  }

  /**
   * Path part for operation registrar1
   */
  static readonly Registrar1Path = '/api/variedades';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrar1()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrar1$Response(params: {
    context?: HttpContext
    body: VariedadRegistroRequest
  }
): Observable<StrictHttpResponse<MessageResponse>> {

    const rb = new RequestBuilder(this.rootUrl, VariedadControllerService.Registrar1Path, 'post');
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
   * To access the full response (for headers, for example), `registrar1$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrar1(params: {
    context?: HttpContext
    body: VariedadRegistroRequest
  }
): Observable<MessageResponse> {

    return this.registrar1$Response(params).pipe(
      map((r: StrictHttpResponse<MessageResponse>) => r.body as MessageResponse)
    );
  }

  /**
   * Path part for operation cambiarEstado1
   */
  static readonly CambiarEstado1Path = '/api/variedades';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `cambiarEstado1()` instead.
   *
   * This method doesn't expect any request body.
   */
  cambiarEstado1$Response(params: {
    variedadId: number;
    activo: boolean;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<MessageResponse>> {

    const rb = new RequestBuilder(this.rootUrl, VariedadControllerService.CambiarEstado1Path, 'delete');
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
   * To access the full response (for headers, for example), `cambiarEstado1$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  cambiarEstado1(params: {
    variedadId: number;
    activo: boolean;
    context?: HttpContext
  }
): Observable<MessageResponse> {

    return this.cambiarEstado1$Response(params).pipe(
      map((r: StrictHttpResponse<MessageResponse>) => r.body as MessageResponse)
    );
  }

}
