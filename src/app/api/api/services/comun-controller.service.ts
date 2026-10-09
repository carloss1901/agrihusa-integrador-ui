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

import { ComunResponse } from '../models/comun-response';

@Injectable({
  providedIn: 'root',
})
export class ComunControllerService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation listarViasActivos
   */
  static readonly ListarViasActivosPath = '/api/comun/vias-activos';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `listarViasActivos()` instead.
   *
   * This method doesn't expect any request body.
   */
  listarViasActivos$Response(params?: {
    context?: HttpContext
  }
): Observable<StrictHttpResponse<Array<ComunResponse>>> {

    const rb = new RequestBuilder(this.rootUrl, ComunControllerService.ListarViasActivosPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<ComunResponse>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `listarViasActivos$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  listarViasActivos(params?: {
    context?: HttpContext
  }
): Observable<Array<ComunResponse>> {

    return this.listarViasActivos$Response(params).pipe(
      map((r: StrictHttpResponse<Array<ComunResponse>>) => r.body as Array<ComunResponse>)
    );
  }

  /**
   * Path part for operation listarVariedadesActivas
   */
  static readonly ListarVariedadesActivasPath = '/api/comun/variedades-activas';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `listarVariedadesActivas()` instead.
   *
   * This method doesn't expect any request body.
   */
  listarVariedadesActivas$Response(params?: {
    context?: HttpContext
  }
): Observable<StrictHttpResponse<Array<ComunResponse>>> {

    const rb = new RequestBuilder(this.rootUrl, ComunControllerService.ListarVariedadesActivasPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<ComunResponse>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `listarVariedadesActivas$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  listarVariedadesActivas(params?: {
    context?: HttpContext
  }
): Observable<Array<ComunResponse>> {

    return this.listarVariedadesActivas$Response(params).pipe(
      map((r: StrictHttpResponse<Array<ComunResponse>>) => r.body as Array<ComunResponse>)
    );
  }

  /**
   * Path part for operation listarSituacionesActivas
   */
  static readonly ListarSituacionesActivasPath = '/api/comun/situaciones-activas';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `listarSituacionesActivas()` instead.
   *
   * This method doesn't expect any request body.
   */
  listarSituacionesActivas$Response(params?: {
    context?: HttpContext
  }
): Observable<StrictHttpResponse<Array<ComunResponse>>> {

    const rb = new RequestBuilder(this.rootUrl, ComunControllerService.ListarSituacionesActivasPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<ComunResponse>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `listarSituacionesActivas$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  listarSituacionesActivas(params?: {
    context?: HttpContext
  }
): Observable<Array<ComunResponse>> {

    return this.listarSituacionesActivas$Response(params).pipe(
      map((r: StrictHttpResponse<Array<ComunResponse>>) => r.body as Array<ComunResponse>)
    );
  }

  /**
   * Path part for operation listarRolesActivos
   */
  static readonly ListarRolesActivosPath = '/api/comun/roles-activos';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `listarRolesActivos()` instead.
   *
   * This method doesn't expect any request body.
   */
  listarRolesActivos$Response(params?: {
    context?: HttpContext
  }
): Observable<StrictHttpResponse<Array<ComunResponse>>> {

    const rb = new RequestBuilder(this.rootUrl, ComunControllerService.ListarRolesActivosPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<ComunResponse>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `listarRolesActivos$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  listarRolesActivos(params?: {
    context?: HttpContext
  }
): Observable<Array<ComunResponse>> {

    return this.listarRolesActivos$Response(params).pipe(
      map((r: StrictHttpResponse<Array<ComunResponse>>) => r.body as Array<ComunResponse>)
    );
  }

  /**
   * Path part for operation listarPuertosLlegadaActivos
   */
  static readonly ListarPuertosLlegadaActivosPath = '/api/comun/puertos-llegada-activos';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `listarPuertosLlegadaActivos()` instead.
   *
   * This method doesn't expect any request body.
   */
  listarPuertosLlegadaActivos$Response(params?: {
    context?: HttpContext
  }
): Observable<StrictHttpResponse<Array<ComunResponse>>> {

    const rb = new RequestBuilder(this.rootUrl, ComunControllerService.ListarPuertosLlegadaActivosPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<ComunResponse>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `listarPuertosLlegadaActivos$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  listarPuertosLlegadaActivos(params?: {
    context?: HttpContext
  }
): Observable<Array<ComunResponse>> {

    return this.listarPuertosLlegadaActivos$Response(params).pipe(
      map((r: StrictHttpResponse<Array<ComunResponse>>) => r.body as Array<ComunResponse>)
    );
  }

  /**
   * Path part for operation listarProductosActivos
   */
  static readonly ListarProductosActivosPath = '/api/comun/productos-activos';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `listarProductosActivos()` instead.
   *
   * This method doesn't expect any request body.
   */
  listarProductosActivos$Response(params?: {
    context?: HttpContext
  }
): Observable<StrictHttpResponse<Array<ComunResponse>>> {

    const rb = new RequestBuilder(this.rootUrl, ComunControllerService.ListarProductosActivosPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<ComunResponse>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `listarProductosActivos$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  listarProductosActivos(params?: {
    context?: HttpContext
  }
): Observable<Array<ComunResponse>> {

    return this.listarProductosActivos$Response(params).pipe(
      map((r: StrictHttpResponse<Array<ComunResponse>>) => r.body as Array<ComunResponse>)
    );
  }

  /**
   * Path part for operation listarOperadoresLogisticosActivos
   */
  static readonly ListarOperadoresLogisticosActivosPath = '/api/comun/operadores-logisticos-activos';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `listarOperadoresLogisticosActivos()` instead.
   *
   * This method doesn't expect any request body.
   */
  listarOperadoresLogisticosActivos$Response(params?: {
    context?: HttpContext
  }
): Observable<StrictHttpResponse<Array<ComunResponse>>> {

    const rb = new RequestBuilder(this.rootUrl, ComunControllerService.ListarOperadoresLogisticosActivosPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<ComunResponse>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `listarOperadoresLogisticosActivos$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  listarOperadoresLogisticosActivos(params?: {
    context?: HttpContext
  }
): Observable<Array<ComunResponse>> {

    return this.listarOperadoresLogisticosActivos$Response(params).pipe(
      map((r: StrictHttpResponse<Array<ComunResponse>>) => r.body as Array<ComunResponse>)
    );
  }

  /**
   * Path part for operation listarNavierasActivas
   */
  static readonly ListarNavierasActivasPath = '/api/comun/navieras-activas';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `listarNavierasActivas()` instead.
   *
   * This method doesn't expect any request body.
   */
  listarNavierasActivas$Response(params?: {
    context?: HttpContext
  }
): Observable<StrictHttpResponse<Array<ComunResponse>>> {

    const rb = new RequestBuilder(this.rootUrl, ComunControllerService.ListarNavierasActivasPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<ComunResponse>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `listarNavierasActivas$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  listarNavierasActivas(params?: {
    context?: HttpContext
  }
): Observable<Array<ComunResponse>> {

    return this.listarNavierasActivas$Response(params).pipe(
      map((r: StrictHttpResponse<Array<ComunResponse>>) => r.body as Array<ComunResponse>)
    );
  }

  /**
   * Path part for operation listarDestinosActivos
   */
  static readonly ListarDestinosActivosPath = '/api/comun/destinos-activos';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `listarDestinosActivos()` instead.
   *
   * This method doesn't expect any request body.
   */
  listarDestinosActivos$Response(params?: {
    context?: HttpContext
  }
): Observable<StrictHttpResponse<Array<ComunResponse>>> {

    const rb = new RequestBuilder(this.rootUrl, ComunControllerService.ListarDestinosActivosPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<ComunResponse>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `listarDestinosActivos$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  listarDestinosActivos(params?: {
    context?: HttpContext
  }
): Observable<Array<ComunResponse>> {

    return this.listarDestinosActivos$Response(params).pipe(
      map((r: StrictHttpResponse<Array<ComunResponse>>) => r.body as Array<ComunResponse>)
    );
  }

  /**
   * Path part for operation listarClientesActivos
   */
  static readonly ListarClientesActivosPath = '/api/comun/clientes-activos';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `listarClientesActivos()` instead.
   *
   * This method doesn't expect any request body.
   */
  listarClientesActivos$Response(params?: {
    context?: HttpContext
  }
): Observable<StrictHttpResponse<Array<ComunResponse>>> {

    const rb = new RequestBuilder(this.rootUrl, ComunControllerService.ListarClientesActivosPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<ComunResponse>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `listarClientesActivos$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  listarClientesActivos(params?: {
    context?: HttpContext
  }
): Observable<Array<ComunResponse>> {

    return this.listarClientesActivos$Response(params).pipe(
      map((r: StrictHttpResponse<Array<ComunResponse>>) => r.body as Array<ComunResponse>)
    );
  }

}
