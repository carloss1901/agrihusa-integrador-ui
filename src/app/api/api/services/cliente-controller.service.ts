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

import { ClienteRegistroRequest } from '../models/cliente-registro-request';
import { CustomPageClienteResponse } from '../models/custom-page-cliente-response';
import { MessageResponse } from '../models/message-response';

@Injectable({
  providedIn: 'root',
})
export class ClienteControllerService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation listarClientes
   */
  static readonly ListarClientesPath = '/api/clientes';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `listarClientes()` instead.
   *
   * This method doesn't expect any request body.
   */
  listarClientes$Response(params?: {
    texto?: string;
    tipoDocumento?: string;
    activo?: boolean;
    pagina?: number;
    tamPagina?: number;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<CustomPageClienteResponse>> {

    const rb = new RequestBuilder(this.rootUrl, ClienteControllerService.ListarClientesPath, 'get');
    if (params) {
      rb.query('texto', params.texto, {});
      rb.query('tipoDocumento', params.tipoDocumento, {});
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
        return r as StrictHttpResponse<CustomPageClienteResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `listarClientes$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  listarClientes(params?: {
    texto?: string;
    tipoDocumento?: string;
    activo?: boolean;
    pagina?: number;
    tamPagina?: number;
    context?: HttpContext
  }
): Observable<CustomPageClienteResponse> {

    return this.listarClientes$Response(params).pipe(
      map((r: StrictHttpResponse<CustomPageClienteResponse>) => r.body as CustomPageClienteResponse)
    );
  }

  /**
   * Path part for operation actualizarCliente
   */
  static readonly ActualizarClientePath = '/api/clientes';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `actualizarCliente()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  actualizarCliente$Response(params: {
    context?: HttpContext
    body: ClienteRegistroRequest
  }
): Observable<StrictHttpResponse<MessageResponse>> {

    const rb = new RequestBuilder(this.rootUrl, ClienteControllerService.ActualizarClientePath, 'put');
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
   * To access the full response (for headers, for example), `actualizarCliente$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  actualizarCliente(params: {
    context?: HttpContext
    body: ClienteRegistroRequest
  }
): Observable<MessageResponse> {

    return this.actualizarCliente$Response(params).pipe(
      map((r: StrictHttpResponse<MessageResponse>) => r.body as MessageResponse)
    );
  }

  /**
   * Path part for operation registrarCliente
   */
  static readonly RegistrarClientePath = '/api/clientes';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrarCliente()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrarCliente$Response(params: {
    context?: HttpContext
    body: ClienteRegistroRequest
  }
): Observable<StrictHttpResponse<MessageResponse>> {

    const rb = new RequestBuilder(this.rootUrl, ClienteControllerService.RegistrarClientePath, 'post');
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
   * To access the full response (for headers, for example), `registrarCliente$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrarCliente(params: {
    context?: HttpContext
    body: ClienteRegistroRequest
  }
): Observable<MessageResponse> {

    return this.registrarCliente$Response(params).pipe(
      map((r: StrictHttpResponse<MessageResponse>) => r.body as MessageResponse)
    );
  }

  /**
   * Path part for operation cambiarEstadoCliente
   */
  static readonly CambiarEstadoClientePath = '/api/clientes';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `cambiarEstadoCliente()` instead.
   *
   * This method doesn't expect any request body.
   */
  cambiarEstadoCliente$Response(params: {
    clienteId: number;
    activo: boolean;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<MessageResponse>> {

    const rb = new RequestBuilder(this.rootUrl, ClienteControllerService.CambiarEstadoClientePath, 'delete');
    if (params) {
      rb.query('clienteId', params.clienteId, {});
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
   * To access the full response (for headers, for example), `cambiarEstadoCliente$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  cambiarEstadoCliente(params: {
    clienteId: number;
    activo: boolean;
    context?: HttpContext
  }
): Observable<MessageResponse> {

    return this.cambiarEstadoCliente$Response(params).pipe(
      map((r: StrictHttpResponse<MessageResponse>) => r.body as MessageResponse)
    );
  }

}
