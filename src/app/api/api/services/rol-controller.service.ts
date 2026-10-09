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

import { CustomPageRolResponse } from '../models/custom-page-rol-response';
import { MessageResponse } from '../models/message-response';
import { RolDetalleResponse } from '../models/rol-detalle-response';
import { RolRegistroRequest } from '../models/rol-registro-request';

@Injectable({
  providedIn: 'root',
})
export class RolControllerService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation listarRoles
   */
  static readonly ListarRolesPath = '/api/roles';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `listarRoles()` instead.
   *
   * This method doesn't expect any request body.
   */
  listarRoles$Response(params?: {
    nombre?: string;
    activo?: boolean;
    pagina?: number;
    tamPagina?: number;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<CustomPageRolResponse>> {

    const rb = new RequestBuilder(this.rootUrl, RolControllerService.ListarRolesPath, 'get');
    if (params) {
      rb.query('nombre', params.nombre, {});
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
        return r as StrictHttpResponse<CustomPageRolResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `listarRoles$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  listarRoles(params?: {
    nombre?: string;
    activo?: boolean;
    pagina?: number;
    tamPagina?: number;
    context?: HttpContext
  }
): Observable<CustomPageRolResponse> {

    return this.listarRoles$Response(params).pipe(
      map((r: StrictHttpResponse<CustomPageRolResponse>) => r.body as CustomPageRolResponse)
    );
  }

  /**
   * Path part for operation actualizarRol
   */
  static readonly ActualizarRolPath = '/api/roles';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `actualizarRol()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  actualizarRol$Response(params: {
    context?: HttpContext
    body: RolRegistroRequest
  }
): Observable<StrictHttpResponse<MessageResponse>> {

    const rb = new RequestBuilder(this.rootUrl, RolControllerService.ActualizarRolPath, 'put');
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
   * To access the full response (for headers, for example), `actualizarRol$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  actualizarRol(params: {
    context?: HttpContext
    body: RolRegistroRequest
  }
): Observable<MessageResponse> {

    return this.actualizarRol$Response(params).pipe(
      map((r: StrictHttpResponse<MessageResponse>) => r.body as MessageResponse)
    );
  }

  /**
   * Path part for operation registrarRol
   */
  static readonly RegistrarRolPath = '/api/roles';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrarRol()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrarRol$Response(params: {
    context?: HttpContext
    body: RolRegistroRequest
  }
): Observable<StrictHttpResponse<MessageResponse>> {

    const rb = new RequestBuilder(this.rootUrl, RolControllerService.RegistrarRolPath, 'post');
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
   * To access the full response (for headers, for example), `registrarRol$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrarRol(params: {
    context?: HttpContext
    body: RolRegistroRequest
  }
): Observable<MessageResponse> {

    return this.registrarRol$Response(params).pipe(
      map((r: StrictHttpResponse<MessageResponse>) => r.body as MessageResponse)
    );
  }

  /**
   * Path part for operation cambiarEstadoRol
   */
  static readonly CambiarEstadoRolPath = '/api/roles';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `cambiarEstadoRol()` instead.
   *
   * This method doesn't expect any request body.
   */
  cambiarEstadoRol$Response(params: {
    rolId: number;
    activo: boolean;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<MessageResponse>> {

    const rb = new RequestBuilder(this.rootUrl, RolControllerService.CambiarEstadoRolPath, 'delete');
    if (params) {
      rb.query('rolId', params.rolId, {});
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
   * To access the full response (for headers, for example), `cambiarEstadoRol$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  cambiarEstadoRol(params: {
    rolId: number;
    activo: boolean;
    context?: HttpContext
  }
): Observable<MessageResponse> {

    return this.cambiarEstadoRol$Response(params).pipe(
      map((r: StrictHttpResponse<MessageResponse>) => r.body as MessageResponse)
    );
  }

  /**
   * Path part for operation obtenerRol
   */
  static readonly ObtenerRolPath = '/api/roles/{rolId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `obtenerRol()` instead.
   *
   * This method doesn't expect any request body.
   */
  obtenerRol$Response(params: {
    rolId: number;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<RolDetalleResponse>> {

    const rb = new RequestBuilder(this.rootUrl, RolControllerService.ObtenerRolPath, 'get');
    if (params) {
      rb.path('rolId', params.rolId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<RolDetalleResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `obtenerRol$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  obtenerRol(params: {
    rolId: number;
    context?: HttpContext
  }
): Observable<RolDetalleResponse> {

    return this.obtenerRol$Response(params).pipe(
      map((r: StrictHttpResponse<RolDetalleResponse>) => r.body as RolDetalleResponse)
    );
  }

}
