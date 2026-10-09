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
import { MessageResponse } from '../models/message-response';
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
      responseType: 'json',
      accept: 'application/json',
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
   * Path part for operation actualizarProducto
   */
  static readonly ActualizarProductoPath = '/api/productos';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `actualizarProducto()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  actualizarProducto$Response(params: {
    context?: HttpContext
    body: ProductoRegistroRequest
  }
): Observable<StrictHttpResponse<MessageResponse>> {

    const rb = new RequestBuilder(this.rootUrl, ProductoControllerService.ActualizarProductoPath, 'put');
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
   * To access the full response (for headers, for example), `actualizarProducto$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  actualizarProducto(params: {
    context?: HttpContext
    body: ProductoRegistroRequest
  }
): Observable<MessageResponse> {

    return this.actualizarProducto$Response(params).pipe(
      map((r: StrictHttpResponse<MessageResponse>) => r.body as MessageResponse)
    );
  }

  /**
   * Path part for operation registrarProducto
   */
  static readonly RegistrarProductoPath = '/api/productos';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrarProducto()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrarProducto$Response(params: {
    context?: HttpContext
    body: ProductoRegistroRequest
  }
): Observable<StrictHttpResponse<MessageResponse>> {

    const rb = new RequestBuilder(this.rootUrl, ProductoControllerService.RegistrarProductoPath, 'post');
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
   * To access the full response (for headers, for example), `registrarProducto$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrarProducto(params: {
    context?: HttpContext
    body: ProductoRegistroRequest
  }
): Observable<MessageResponse> {

    return this.registrarProducto$Response(params).pipe(
      map((r: StrictHttpResponse<MessageResponse>) => r.body as MessageResponse)
    );
  }

  /**
   * Path part for operation cambiarEstadoProducto
   */
  static readonly CambiarEstadoProductoPath = '/api/productos';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `cambiarEstadoProducto()` instead.
   *
   * This method doesn't expect any request body.
   */
  cambiarEstadoProducto$Response(params: {
    productoId: number;
    activo: boolean;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<MessageResponse>> {

    const rb = new RequestBuilder(this.rootUrl, ProductoControllerService.CambiarEstadoProductoPath, 'delete');
    if (params) {
      rb.query('productoId', params.productoId, {});
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
   * To access the full response (for headers, for example), `cambiarEstadoProducto$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  cambiarEstadoProducto(params: {
    productoId: number;
    activo: boolean;
    context?: HttpContext
  }
): Observable<MessageResponse> {

    return this.cambiarEstadoProducto$Response(params).pipe(
      map((r: StrictHttpResponse<MessageResponse>) => r.body as MessageResponse)
    );
  }

}
