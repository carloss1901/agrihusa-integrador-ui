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

import { CustomPageDespachoResponse } from '../models/custom-page-despacho-response';
import { DespachoRegistroRequest } from '../models/despacho-registro-request';

@Injectable({
  providedIn: 'root',
})
export class DespachoControllerService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation listar1
   */
  static readonly Listar1Path = '/api/despachos';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `listar1()` instead.
   *
   * This method doesn't expect any request body.
   */
  listar1$Response(params?: {
    texto?: string;
    clienteId?: number;
    productoId?: number;
    situacionId?: number;
    activo?: boolean;
    fechaDesde?: string;
    fechaHasta?: string;
    pagina?: number;
    tamPagina?: number;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<CustomPageDespachoResponse>> {

    const rb = new RequestBuilder(this.rootUrl, DespachoControllerService.Listar1Path, 'get');
    if (params) {
      rb.query('texto', params.texto, {});
      rb.query('clienteId', params.clienteId, {});
      rb.query('productoId', params.productoId, {});
      rb.query('situacionId', params.situacionId, {});
      rb.query('activo', params.activo, {});
      rb.query('fechaDesde', params.fechaDesde, {});
      rb.query('fechaHasta', params.fechaHasta, {});
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
        return r as StrictHttpResponse<CustomPageDespachoResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `listar1$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  listar1(params?: {
    texto?: string;
    clienteId?: number;
    productoId?: number;
    situacionId?: number;
    activo?: boolean;
    fechaDesde?: string;
    fechaHasta?: string;
    pagina?: number;
    tamPagina?: number;
    context?: HttpContext
  }
): Observable<CustomPageDespachoResponse> {

    return this.listar1$Response(params).pipe(
      map((r: StrictHttpResponse<CustomPageDespachoResponse>) => r.body as CustomPageDespachoResponse)
    );
  }

  /**
   * Path part for operation actualizar10
   */
  static readonly Actualizar10Path = '/api/despachos';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `actualizar10()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  actualizar10$Response(params: {
    context?: HttpContext
    body: DespachoRegistroRequest
  }
): Observable<StrictHttpResponse<{
}>> {

    const rb = new RequestBuilder(this.rootUrl, DespachoControllerService.Actualizar10Path, 'put');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'blob',
      accept: '*/*',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<{
        }>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `actualizar10$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  actualizar10(params: {
    context?: HttpContext
    body: DespachoRegistroRequest
  }
): Observable<{
}> {

    return this.actualizar10$Response(params).pipe(
      map((r: StrictHttpResponse<{
}>) => r.body as {
})
    );
  }

  /**
   * Path part for operation registrar10
   */
  static readonly Registrar10Path = '/api/despachos';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrar10()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrar10$Response(params: {
    context?: HttpContext
    body: DespachoRegistroRequest
  }
): Observable<StrictHttpResponse<{
}>> {

    const rb = new RequestBuilder(this.rootUrl, DespachoControllerService.Registrar10Path, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'blob',
      accept: '*/*',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<{
        }>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `registrar10$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrar10(params: {
    context?: HttpContext
    body: DespachoRegistroRequest
  }
): Observable<{
}> {

    return this.registrar10$Response(params).pipe(
      map((r: StrictHttpResponse<{
}>) => r.body as {
})
    );
  }

  /**
   * Path part for operation cambiarEstado10
   */
  static readonly CambiarEstado10Path = '/api/despachos';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `cambiarEstado10()` instead.
   *
   * This method doesn't expect any request body.
   */
  cambiarEstado10$Response(params: {
    despachoId: number;
    activo: boolean;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<{
}>> {

    const rb = new RequestBuilder(this.rootUrl, DespachoControllerService.CambiarEstado10Path, 'delete');
    if (params) {
      rb.query('despachoId', params.despachoId, {});
      rb.query('activo', params.activo, {});
    }

    return this.http.request(rb.build({
      responseType: 'blob',
      accept: '*/*',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<{
        }>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `cambiarEstado10$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  cambiarEstado10(params: {
    despachoId: number;
    activo: boolean;
    context?: HttpContext
  }
): Observable<{
}> {

    return this.cambiarEstado10$Response(params).pipe(
      map((r: StrictHttpResponse<{
}>) => r.body as {
})
    );
  }

}
