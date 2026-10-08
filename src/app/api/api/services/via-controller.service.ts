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

import { CustomPageViaResponse } from '../models/custom-page-via-response';
import { MessageResponse } from '../models/message-response';
import { ViaRegistroRequest } from '../models/via-registro-request';

@Injectable({
  providedIn: 'root',
})
export class ViaControllerService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation listarVias
   */
  static readonly ListarViasPath = '/api/vias';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `listarVias()` instead.
   *
   * This method doesn't expect any request body.
   */
  listarVias$Response(params?: {
    descripcion?: string;
    activo?: boolean;
    pagina?: number;
    tamPagina?: number;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<CustomPageViaResponse>> {

    const rb = new RequestBuilder(this.rootUrl, ViaControllerService.ListarViasPath, 'get');
    if (params) {
      rb.query('descripcion', params.descripcion, {});
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
        return r as StrictHttpResponse<CustomPageViaResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `listarVias$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  listarVias(params?: {
    descripcion?: string;
    activo?: boolean;
    pagina?: number;
    tamPagina?: number;
    context?: HttpContext
  }
): Observable<CustomPageViaResponse> {

    return this.listarVias$Response(params).pipe(
      map((r: StrictHttpResponse<CustomPageViaResponse>) => r.body as CustomPageViaResponse)
    );
  }

  /**
   * Path part for operation actualizarVia
   */
  static readonly ActualizarViaPath = '/api/vias';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `actualizarVia()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  actualizarVia$Response(params: {
    context?: HttpContext
    body: ViaRegistroRequest
  }
): Observable<StrictHttpResponse<MessageResponse>> {

    const rb = new RequestBuilder(this.rootUrl, ViaControllerService.ActualizarViaPath, 'put');
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
   * To access the full response (for headers, for example), `actualizarVia$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  actualizarVia(params: {
    context?: HttpContext
    body: ViaRegistroRequest
  }
): Observable<MessageResponse> {

    return this.actualizarVia$Response(params).pipe(
      map((r: StrictHttpResponse<MessageResponse>) => r.body as MessageResponse)
    );
  }

  /**
   * Path part for operation registrarVia
   */
  static readonly RegistrarViaPath = '/api/vias';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrarVia()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrarVia$Response(params: {
    context?: HttpContext
    body: ViaRegistroRequest
  }
): Observable<StrictHttpResponse<MessageResponse>> {

    const rb = new RequestBuilder(this.rootUrl, ViaControllerService.RegistrarViaPath, 'post');
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
   * To access the full response (for headers, for example), `registrarVia$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrarVia(params: {
    context?: HttpContext
    body: ViaRegistroRequest
  }
): Observable<MessageResponse> {

    return this.registrarVia$Response(params).pipe(
      map((r: StrictHttpResponse<MessageResponse>) => r.body as MessageResponse)
    );
  }

  /**
   * Path part for operation cambiarEstadoVia
   */
  static readonly CambiarEstadoViaPath = '/api/vias';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `cambiarEstadoVia()` instead.
   *
   * This method doesn't expect any request body.
   */
  cambiarEstadoVia$Response(params: {
    viaId: number;
    activo: boolean;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<MessageResponse>> {

    const rb = new RequestBuilder(this.rootUrl, ViaControllerService.CambiarEstadoViaPath, 'delete');
    if (params) {
      rb.query('viaId', params.viaId, {});
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
   * To access the full response (for headers, for example), `cambiarEstadoVia$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  cambiarEstadoVia(params: {
    viaId: number;
    activo: boolean;
    context?: HttpContext
  }
): Observable<MessageResponse> {

    return this.cambiarEstadoVia$Response(params).pipe(
      map((r: StrictHttpResponse<MessageResponse>) => r.body as MessageResponse)
    );
  }

}
