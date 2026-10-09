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

import { CustomPagePuertoLlegadaResponse } from '../models/custom-page-puerto-llegada-response';
import { PuertoLlegadaRegistroRequest } from '../models/puerto-llegada-registro-request';

@Injectable({
  providedIn: 'root',
})
export class PuertoLlegadaControllerService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation listarPuertos
   */
  static readonly ListarPuertosPath = '/api/puertos-llegada';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `listarPuertos()` instead.
   *
   * This method doesn't expect any request body.
   */
  listarPuertos$Response(params?: {
    texto?: string;
    pais?: string;
    activo?: boolean;
    pagina?: number;
    tamPagina?: number;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<CustomPagePuertoLlegadaResponse>> {

    const rb = new RequestBuilder(this.rootUrl, PuertoLlegadaControllerService.ListarPuertosPath, 'get');
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
        return r as StrictHttpResponse<CustomPagePuertoLlegadaResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `listarPuertos$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  listarPuertos(params?: {
    texto?: string;
    pais?: string;
    activo?: boolean;
    pagina?: number;
    tamPagina?: number;
    context?: HttpContext
  }
): Observable<CustomPagePuertoLlegadaResponse> {

    return this.listarPuertos$Response(params).pipe(
      map((r: StrictHttpResponse<CustomPagePuertoLlegadaResponse>) => r.body as CustomPagePuertoLlegadaResponse)
    );
  }

  /**
   * Path part for operation actualizar5
   */
  static readonly Actualizar5Path = '/api/puertos-llegada';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `actualizar5()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  actualizar5$Response(params: {
    context?: HttpContext
    body: PuertoLlegadaRegistroRequest
  }
): Observable<StrictHttpResponse<{
}>> {

    const rb = new RequestBuilder(this.rootUrl, PuertoLlegadaControllerService.Actualizar5Path, 'put');
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
    body: PuertoLlegadaRegistroRequest
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
   * Path part for operation registrar5
   */
  static readonly Registrar5Path = '/api/puertos-llegada';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrar5()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrar5$Response(params: {
    context?: HttpContext
    body: PuertoLlegadaRegistroRequest
  }
): Observable<StrictHttpResponse<{
}>> {

    const rb = new RequestBuilder(this.rootUrl, PuertoLlegadaControllerService.Registrar5Path, 'post');
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
   * To access the full response (for headers, for example), `registrar5$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrar5(params: {
    context?: HttpContext
    body: PuertoLlegadaRegistroRequest
  }
): Observable<{
}> {

    return this.registrar5$Response(params).pipe(
      map((r: StrictHttpResponse<{
}>) => r.body as {
})
    );
  }

  /**
   * Path part for operation cambiarEstado5
   */
  static readonly CambiarEstado5Path = '/api/puertos-llegada';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `cambiarEstado5()` instead.
   *
   * This method doesn't expect any request body.
   */
  cambiarEstado5$Response(params: {
    puertoLlegadaId: number;
    activo: boolean;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<{
}>> {

    const rb = new RequestBuilder(this.rootUrl, PuertoLlegadaControllerService.CambiarEstado5Path, 'delete');
    if (params) {
      rb.query('puertoLlegadaId', params.puertoLlegadaId, {});
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
    puertoLlegadaId: number;
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
