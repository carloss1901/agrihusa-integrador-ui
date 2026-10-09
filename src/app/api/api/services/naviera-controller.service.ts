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
   * Path part for operation listar
   */
  static readonly ListarPath = '/api/navieras';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `listar()` instead.
   *
   * This method doesn't expect any request body.
   */
  listar$Response(params?: {
    texto?: string;
    pais?: string;
    activo?: boolean;
    pagina?: number;
    tamPagina?: number;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<CustomPageNavieraResponse>> {

    const rb = new RequestBuilder(this.rootUrl, NavieraControllerService.ListarPath, 'get');
    if (params) {
      rb.query('texto', params.texto, {});
      rb.query('pais', params.pais, {});
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
        return r as StrictHttpResponse<CustomPageNavieraResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `listar$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  listar(params?: {
    texto?: string;
    pais?: string;
    activo?: boolean;
    pagina?: number;
    tamPagina?: number;
    context?: HttpContext
  }
): Observable<CustomPageNavieraResponse> {

    return this.listar$Response(params).pipe(
      map((r: StrictHttpResponse<CustomPageNavieraResponse>) => r.body as CustomPageNavieraResponse)
    );
  }

  /**
   * Path part for operation actualizar8
   */
  static readonly Actualizar8Path = '/api/navieras';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `actualizar8()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  actualizar8$Response(params: {
    context?: HttpContext
    body: NavieraRegistroRequest
  }
): Observable<StrictHttpResponse<{
}>> {

    const rb = new RequestBuilder(this.rootUrl, NavieraControllerService.Actualizar8Path, 'put');
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
   * To access the full response (for headers, for example), `actualizar8$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  actualizar8(params: {
    context?: HttpContext
    body: NavieraRegistroRequest
  }
): Observable<{
}> {

    return this.actualizar8$Response(params).pipe(
      map((r: StrictHttpResponse<{
}>) => r.body as {
})
    );
  }

  /**
   * Path part for operation registrar8
   */
  static readonly Registrar8Path = '/api/navieras';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrar8()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrar8$Response(params: {
    context?: HttpContext
    body: NavieraRegistroRequest
  }
): Observable<StrictHttpResponse<{
}>> {

    const rb = new RequestBuilder(this.rootUrl, NavieraControllerService.Registrar8Path, 'post');
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
   * To access the full response (for headers, for example), `registrar8$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrar8(params: {
    context?: HttpContext
    body: NavieraRegistroRequest
  }
): Observable<{
}> {

    return this.registrar8$Response(params).pipe(
      map((r: StrictHttpResponse<{
}>) => r.body as {
})
    );
  }

  /**
   * Path part for operation cambiarEstado8
   */
  static readonly CambiarEstado8Path = '/api/navieras';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `cambiarEstado8()` instead.
   *
   * This method doesn't expect any request body.
   */
  cambiarEstado8$Response(params: {
    navieraId: number;
    activo: boolean;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<{
}>> {

    const rb = new RequestBuilder(this.rootUrl, NavieraControllerService.CambiarEstado8Path, 'delete');
    if (params) {
      rb.query('navieraId', params.navieraId, {});
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
   * To access the full response (for headers, for example), `cambiarEstado8$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  cambiarEstado8(params: {
    navieraId: number;
    activo: boolean;
    context?: HttpContext
  }
): Observable<{
}> {

    return this.cambiarEstado8$Response(params).pipe(
      map((r: StrictHttpResponse<{
}>) => r.body as {
})
    );
  }

}
