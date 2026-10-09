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

import { CustomPageSituacionResponse } from '../models/custom-page-situacion-response';
import { SituacionRegistroRequest } from '../models/situacion-registro-request';

@Injectable({
  providedIn: 'root',
})
export class SituacionControllerService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation listarSituaciones
   */
  static readonly ListarSituacionesPath = '/api/situaciones';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `listarSituaciones()` instead.
   *
   * This method doesn't expect any request body.
   */
  listarSituaciones$Response(params?: {
    descripcion?: string;
    activo?: boolean;
    pagina?: number;
    tamPagina?: number;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<CustomPageSituacionResponse>> {

    const rb = new RequestBuilder(this.rootUrl, SituacionControllerService.ListarSituacionesPath, 'get');
    if (params) {
      rb.query('descripcion', params.descripcion, {});
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
        return r as StrictHttpResponse<CustomPageSituacionResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `listarSituaciones$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  listarSituaciones(params?: {
    descripcion?: string;
    activo?: boolean;
    pagina?: number;
    tamPagina?: number;
    context?: HttpContext
  }
): Observable<CustomPageSituacionResponse> {

    return this.listarSituaciones$Response(params).pipe(
      map((r: StrictHttpResponse<CustomPageSituacionResponse>) => r.body as CustomPageSituacionResponse)
    );
  }

  /**
   * Path part for operation actualizar3
   */
  static readonly Actualizar3Path = '/api/situaciones';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `actualizar3()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  actualizar3$Response(params: {
    context?: HttpContext
    body: SituacionRegistroRequest
  }
): Observable<StrictHttpResponse<{
}>> {

    const rb = new RequestBuilder(this.rootUrl, SituacionControllerService.Actualizar3Path, 'put');
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
   * To access the full response (for headers, for example), `actualizar3$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  actualizar3(params: {
    context?: HttpContext
    body: SituacionRegistroRequest
  }
): Observable<{
}> {

    return this.actualizar3$Response(params).pipe(
      map((r: StrictHttpResponse<{
}>) => r.body as {
})
    );
  }

  /**
   * Path part for operation registrar3
   */
  static readonly Registrar3Path = '/api/situaciones';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrar3()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrar3$Response(params: {
    context?: HttpContext
    body: SituacionRegistroRequest
  }
): Observable<StrictHttpResponse<{
}>> {

    const rb = new RequestBuilder(this.rootUrl, SituacionControllerService.Registrar3Path, 'post');
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
   * To access the full response (for headers, for example), `registrar3$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrar3(params: {
    context?: HttpContext
    body: SituacionRegistroRequest
  }
): Observable<{
}> {

    return this.registrar3$Response(params).pipe(
      map((r: StrictHttpResponse<{
}>) => r.body as {
})
    );
  }

  /**
   * Path part for operation cambiarEstado3
   */
  static readonly CambiarEstado3Path = '/api/situaciones';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `cambiarEstado3()` instead.
   *
   * This method doesn't expect any request body.
   */
  cambiarEstado3$Response(params: {
    situacionId: number;
    activo: boolean;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<{
}>> {

    const rb = new RequestBuilder(this.rootUrl, SituacionControllerService.CambiarEstado3Path, 'delete');
    if (params) {
      rb.query('situacionId', params.situacionId, {});
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
   * To access the full response (for headers, for example), `cambiarEstado3$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  cambiarEstado3(params: {
    situacionId: number;
    activo: boolean;
    context?: HttpContext
  }
): Observable<{
}> {

    return this.cambiarEstado3$Response(params).pipe(
      map((r: StrictHttpResponse<{
}>) => r.body as {
})
    );
  }

}
