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

import { ClienteRegistroRequest } from '../models/cliente-registro-request';
import { CustomPageClienteResponse } from '../models/custom-page-cliente-response';

@Injectable({
  providedIn: 'root',
})
export class ClienteControllerService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation listar2
   */
  static readonly Listar2Path = '/api/clientes';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `listar2()` instead.
   *
   * This method doesn't expect any request body.
   */
  listar2$Response(params?: {
    texto?: string;
    tipoDocumento?: string;
    activo?: boolean;
    pagina?: number;
    tamPagina?: number;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<CustomPageClienteResponse>> {

    const rb = new RequestBuilder(this.rootUrl, ClienteControllerService.Listar2Path, 'get');
    if (params) {
      rb.query('texto', params.texto, {});
      rb.query('tipoDocumento', params.tipoDocumento, {});
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
        return r as StrictHttpResponse<CustomPageClienteResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `listar2$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  listar2(params?: {
    texto?: string;
    tipoDocumento?: string;
    activo?: boolean;
    pagina?: number;
    tamPagina?: number;
    context?: HttpContext
  }
): Observable<CustomPageClienteResponse> {

    return this.listar2$Response(params).pipe(
      map((r: StrictHttpResponse<CustomPageClienteResponse>) => r.body as CustomPageClienteResponse)
    );
  }

  /**
   * Path part for operation actualizar11
   */
  static readonly Actualizar11Path = '/api/clientes';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `actualizar11()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  actualizar11$Response(params: {
    context?: HttpContext
    body: ClienteRegistroRequest
  }
): Observable<StrictHttpResponse<{
}>> {

    const rb = new RequestBuilder(this.rootUrl, ClienteControllerService.Actualizar11Path, 'put');
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
   * To access the full response (for headers, for example), `actualizar11$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  actualizar11(params: {
    context?: HttpContext
    body: ClienteRegistroRequest
  }
): Observable<{
}> {

    return this.actualizar11$Response(params).pipe(
      map((r: StrictHttpResponse<{
}>) => r.body as {
})
    );
  }

  /**
   * Path part for operation registrar11
   */
  static readonly Registrar11Path = '/api/clientes';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrar11()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrar11$Response(params: {
    context?: HttpContext
    body: ClienteRegistroRequest
  }
): Observable<StrictHttpResponse<{
}>> {

    const rb = new RequestBuilder(this.rootUrl, ClienteControllerService.Registrar11Path, 'post');
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
   * To access the full response (for headers, for example), `registrar11$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrar11(params: {
    context?: HttpContext
    body: ClienteRegistroRequest
  }
): Observable<{
}> {

    return this.registrar11$Response(params).pipe(
      map((r: StrictHttpResponse<{
}>) => r.body as {
})
    );
  }

  /**
   * Path part for operation cambiarEstado11
   */
  static readonly CambiarEstado11Path = '/api/clientes';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `cambiarEstado11()` instead.
   *
   * This method doesn't expect any request body.
   */
  cambiarEstado11$Response(params: {
    clienteId: number;
    activo: boolean;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<{
}>> {

    const rb = new RequestBuilder(this.rootUrl, ClienteControllerService.CambiarEstado11Path, 'delete');
    if (params) {
      rb.query('clienteId', params.clienteId, {});
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
   * To access the full response (for headers, for example), `cambiarEstado11$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  cambiarEstado11(params: {
    clienteId: number;
    activo: boolean;
    context?: HttpContext
  }
): Observable<{
}> {

    return this.cambiarEstado11$Response(params).pipe(
      map((r: StrictHttpResponse<{
}>) => r.body as {
})
    );
  }

}
