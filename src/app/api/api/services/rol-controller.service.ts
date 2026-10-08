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
      responseType: 'blob',
      accept: '*/*',
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
   * Path part for operation actualizar3
   */
  static readonly Actualizar3Path = '/api/roles';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `actualizar3()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  actualizar3$Response(params: {
    context?: HttpContext
    body: RolRegistroRequest
  }
): Observable<StrictHttpResponse<MessageResponse>> {

    const rb = new RequestBuilder(this.rootUrl, RolControllerService.Actualizar3Path, 'put');
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
   * To access the full response (for headers, for example), `actualizar3$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  actualizar3(params: {
    context?: HttpContext
    body: RolRegistroRequest
  }
): Observable<MessageResponse> {

    return this.actualizar3$Response(params).pipe(
      map((r: StrictHttpResponse<MessageResponse>) => r.body as MessageResponse)
    );
  }

  /**
   * Path part for operation registrar4
   */
  static readonly Registrar4Path = '/api/roles';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrar4()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrar4$Response(params: {
    context?: HttpContext
    body: RolRegistroRequest
  }
): Observable<StrictHttpResponse<MessageResponse>> {

    const rb = new RequestBuilder(this.rootUrl, RolControllerService.Registrar4Path, 'post');
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
   * To access the full response (for headers, for example), `registrar4$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrar4(params: {
    context?: HttpContext
    body: RolRegistroRequest
  }
): Observable<MessageResponse> {

    return this.registrar4$Response(params).pipe(
      map((r: StrictHttpResponse<MessageResponse>) => r.body as MessageResponse)
    );
  }

  /**
   * Path part for operation cambiarEstado3
   */
  static readonly CambiarEstado3Path = '/api/roles';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `cambiarEstado3()` instead.
   *
   * This method doesn't expect any request body.
   */
  cambiarEstado3$Response(params: {
    rolId: number;
    activo: boolean;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<MessageResponse>> {

    const rb = new RequestBuilder(this.rootUrl, RolControllerService.CambiarEstado3Path, 'delete');
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
   * To access the full response (for headers, for example), `cambiarEstado3$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  cambiarEstado3(params: {
    rolId: number;
    activo: boolean;
    context?: HttpContext
  }
): Observable<MessageResponse> {

    return this.cambiarEstado3$Response(params).pipe(
      map((r: StrictHttpResponse<MessageResponse>) => r.body as MessageResponse)
    );
  }

}
