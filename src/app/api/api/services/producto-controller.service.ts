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

import { CustomPageProductoResponse } from '../models/custom-page-producto-response';
import { ProductoRegistroRequest } from '../models/producto-registro-request';

@Injectable({
  providedIn: 'root',
})
export class ProductoControllerService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation listarProductos
   */
  static readonly ListarProductosPath = '/api/productos';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `listarProductos()` instead.
   *
   * This method doesn't expect any request body.
   */
  listarProductos$Response(params?: {
    texto?: string;
    activo?: boolean;
    pagina?: number;
    tamPagina?: number;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<CustomPageProductoResponse>> {

    const rb = new RequestBuilder(this.rootUrl, ProductoControllerService.ListarProductosPath, 'get');
    if (params) {
      rb.query('texto', params.texto, {});
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
        return r as StrictHttpResponse<CustomPageProductoResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `listarProductos$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  listarProductos(params?: {
    texto?: string;
    activo?: boolean;
    pagina?: number;
    tamPagina?: number;
    context?: HttpContext
  }
): Observable<CustomPageProductoResponse> {

    return this.listarProductos$Response(params).pipe(
      map((r: StrictHttpResponse<CustomPageProductoResponse>) => r.body as CustomPageProductoResponse)
    );
  }

  /**
   * Path part for operation actualizar5
   */
  static readonly Actualizar5Path = '/api/productos';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `actualizar5()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  actualizar5$Response(params: {
    context?: HttpContext
    body: ProductoRegistroRequest
  }
): Observable<StrictHttpResponse<{
}>> {

    const rb = new RequestBuilder(this.rootUrl, ProductoControllerService.Actualizar5Path, 'put');
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
   * To access the full response (for headers, for example), `actualizar5$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  actualizar5(params: {
    context?: HttpContext
    body: ProductoRegistroRequest
  }
): Observable<{
}> {

    return this.actualizar5$Response(params).pipe(
      map((r: StrictHttpResponse<{
}>) => r.body as {
})
    );
  }

  /**
   * Path part for operation registrar6
   */
  static readonly Registrar6Path = '/api/productos';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrar6()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrar6$Response(params: {
    context?: HttpContext
    body: ProductoRegistroRequest
  }
): Observable<StrictHttpResponse<{
}>> {

    const rb = new RequestBuilder(this.rootUrl, ProductoControllerService.Registrar6Path, 'post');
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
   * To access the full response (for headers, for example), `registrar6$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrar6(params: {
    context?: HttpContext
    body: ProductoRegistroRequest
  }
): Observable<{
}> {

    return this.registrar6$Response(params).pipe(
      map((r: StrictHttpResponse<{
}>) => r.body as {
})
    );
  }

  /**
   * Path part for operation cambiarEstado5
   */
  static readonly CambiarEstado5Path = '/api/productos';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `cambiarEstado5()` instead.
   *
   * This method doesn't expect any request body.
   */
  cambiarEstado5$Response(params: {
    productoId: number;
    activo: boolean;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<{
}>> {

    const rb = new RequestBuilder(this.rootUrl, ProductoControllerService.CambiarEstado5Path, 'delete');
    if (params) {
      rb.query('productoId', params.productoId, {});
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
   * To access the full response (for headers, for example), `cambiarEstado5$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  cambiarEstado5(params: {
    productoId: number;
    activo: boolean;
    context?: HttpContext
  }
): Observable<{
}> {

    return this.cambiarEstado5$Response(params).pipe(
      map((r: StrictHttpResponse<{
}>) => r.body as {
})
    );
  }

}
