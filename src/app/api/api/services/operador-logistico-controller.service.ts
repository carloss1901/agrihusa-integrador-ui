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

import { CustomPageOperadorLogisticoResponse } from '../models/custom-page-operador-logistico-response';
import { MessageResponse } from '../models/message-response';
import { OperadorLogisticoRegistroRequest } from '../models/operador-logistico-registro-request';

@Injectable({
  providedIn: 'root',
})
export class OperadorLogisticoControllerService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation listarOperadores
   */
  static readonly ListarOperadoresPath = '/api/operadores-logisticos';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `listarOperadores()` instead.
   *
   * This method doesn't expect any request body.
   */
  listarOperadores$Response(params?: {
    texto?: string;
    activo?: boolean;
    pagina?: number;
    tamPagina?: number;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<CustomPageOperadorLogisticoResponse>> {

    const rb = new RequestBuilder(this.rootUrl, OperadorLogisticoControllerService.ListarOperadoresPath, 'get');
    if (params) {
      rb.query('texto', params.texto, {});
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
        return r as StrictHttpResponse<CustomPageOperadorLogisticoResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `listarOperadores$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  listarOperadores(params?: {
    texto?: string;
    activo?: boolean;
    pagina?: number;
    tamPagina?: number;
    context?: HttpContext
  }
): Observable<CustomPageOperadorLogisticoResponse> {

    return this.listarOperadores$Response(params).pipe(
      map((r: StrictHttpResponse<CustomPageOperadorLogisticoResponse>) => r.body as CustomPageOperadorLogisticoResponse)
    );
  }

  /**
   * Path part for operation actualizarOperadorLogistico
   */
  static readonly ActualizarOperadorLogisticoPath = '/api/operadores-logisticos';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `actualizarOperadorLogistico()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  actualizarOperadorLogistico$Response(params: {
    context?: HttpContext
    body: OperadorLogisticoRegistroRequest
  }
): Observable<StrictHttpResponse<MessageResponse>> {

    const rb = new RequestBuilder(this.rootUrl, OperadorLogisticoControllerService.ActualizarOperadorLogisticoPath, 'put');
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
   * To access the full response (for headers, for example), `actualizarOperadorLogistico$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  actualizarOperadorLogistico(params: {
    context?: HttpContext
    body: OperadorLogisticoRegistroRequest
  }
): Observable<MessageResponse> {

    return this.actualizarOperadorLogistico$Response(params).pipe(
      map((r: StrictHttpResponse<MessageResponse>) => r.body as MessageResponse)
    );
  }

  /**
   * Path part for operation registrarOperadorLogistico
   */
  static readonly RegistrarOperadorLogisticoPath = '/api/operadores-logisticos';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrarOperadorLogistico()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrarOperadorLogistico$Response(params: {
    context?: HttpContext
    body: OperadorLogisticoRegistroRequest
  }
): Observable<StrictHttpResponse<MessageResponse>> {

    const rb = new RequestBuilder(this.rootUrl, OperadorLogisticoControllerService.RegistrarOperadorLogisticoPath, 'post');
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
   * To access the full response (for headers, for example), `registrarOperadorLogistico$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrarOperadorLogistico(params: {
    context?: HttpContext
    body: OperadorLogisticoRegistroRequest
  }
): Observable<MessageResponse> {

    return this.registrarOperadorLogistico$Response(params).pipe(
      map((r: StrictHttpResponse<MessageResponse>) => r.body as MessageResponse)
    );
  }

  /**
   * Path part for operation cambiarEstadoOperadorLogistico
   */
  static readonly CambiarEstadoOperadorLogisticoPath = '/api/operadores-logisticos';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `cambiarEstadoOperadorLogistico()` instead.
   *
   * This method doesn't expect any request body.
   */
  cambiarEstadoOperadorLogistico$Response(params: {
    operadorLogisticoId: number;
    activo: boolean;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<MessageResponse>> {

    const rb = new RequestBuilder(this.rootUrl, OperadorLogisticoControllerService.CambiarEstadoOperadorLogisticoPath, 'delete');
    if (params) {
      rb.query('operadorLogisticoId', params.operadorLogisticoId, {});
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
   * To access the full response (for headers, for example), `cambiarEstadoOperadorLogistico$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  cambiarEstadoOperadorLogistico(params: {
    operadorLogisticoId: number;
    activo: boolean;
    context?: HttpContext
  }
): Observable<MessageResponse> {

    return this.cambiarEstadoOperadorLogistico$Response(params).pipe(
      map((r: StrictHttpResponse<MessageResponse>) => r.body as MessageResponse)
    );
  }

}
