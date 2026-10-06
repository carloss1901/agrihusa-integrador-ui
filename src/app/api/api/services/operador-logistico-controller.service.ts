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

import { CustomPageOperadorLogisticoResponse } from '../models/custom-page-operador-logistico-response';
import { OperadorLogisticoRegistroRequest } from '../models/operador-logistico-registro-request';

@Injectable({
  providedIn: 'root',
})
export class OperadorLogisticoControllerService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation listarOperadores
   */
  static readonly ListarOperadoresPath = '/api/operadores-logisticos';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `listarOperadores()` instead.
   *
   * This method doesn't expect any request body.
   */
  listarOperadores$Response(params?: {
    texto?: string;
    activo?: boolean;
    pagina?: number;
    tamPagina?: number;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<CustomPageOperadorLogisticoResponse>> {

    const rb = new RequestBuilder(this.rootUrl, OperadorLogisticoControllerService.ListarOperadoresPath, 'get');
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
        return r as StrictHttpResponse<CustomPageOperadorLogisticoResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `listarOperadores$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  listarOperadores(params?: {
    texto?: string;
    activo?: boolean;
    pagina?: number;
    tamPagina?: number;
    context?: HttpContext
  }
): Observable<CustomPageOperadorLogisticoResponse> {

    return this.listarOperadores$Response(params).pipe(
      map((r: StrictHttpResponse<CustomPageOperadorLogisticoResponse>) => r.body as CustomPageOperadorLogisticoResponse)
    );
  }

  /**
   * Path part for operation actualizar6
   */
  static readonly Actualizar6Path = '/api/operadores-logisticos';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `actualizar6()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  actualizar6$Response(params: {
    context?: HttpContext
    body: OperadorLogisticoRegistroRequest
  }
): Observable<StrictHttpResponse<{
}>> {

    const rb = new RequestBuilder(this.rootUrl, OperadorLogisticoControllerService.Actualizar6Path, 'put');
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
   * To access the full response (for headers, for example), `actualizar6$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  actualizar6(params: {
    context?: HttpContext
    body: OperadorLogisticoRegistroRequest
  }
): Observable<{
}> {

    return this.actualizar6$Response(params).pipe(
      map((r: StrictHttpResponse<{
}>) => r.body as {
})
    );
  }

  /**
   * Path part for operation registrar7
   */
  static readonly Registrar7Path = '/api/operadores-logisticos';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrar7()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrar7$Response(params: {
    context?: HttpContext
    body: OperadorLogisticoRegistroRequest
  }
): Observable<StrictHttpResponse<{
}>> {

    const rb = new RequestBuilder(this.rootUrl, OperadorLogisticoControllerService.Registrar7Path, 'post');
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
   * To access the full response (for headers, for example), `registrar7$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrar7(params: {
    context?: HttpContext
    body: OperadorLogisticoRegistroRequest
  }
): Observable<{
}> {

    return this.registrar7$Response(params).pipe(
      map((r: StrictHttpResponse<{
}>) => r.body as {
})
    );
  }

  /**
   * Path part for operation cambiarEstado6
   */
  static readonly CambiarEstado6Path = '/api/operadores-logisticos';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `cambiarEstado6()` instead.
   *
   * This method doesn't expect any request body.
   */
  cambiarEstado6$Response(params: {
    operadorLogisticoId: number;
    activo: boolean;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<{
}>> {

    const rb = new RequestBuilder(this.rootUrl, OperadorLogisticoControllerService.CambiarEstado6Path, 'delete');
    if (params) {
      rb.query('operadorLogisticoId', params.operadorLogisticoId, {});
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
   * To access the full response (for headers, for example), `cambiarEstado6$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  cambiarEstado6(params: {
    operadorLogisticoId: number;
    activo: boolean;
    context?: HttpContext
  }
): Observable<{
}> {

    return this.cambiarEstado6$Response(params).pipe(
      map((r: StrictHttpResponse<{
}>) => r.body as {
})
    );
  }

}
