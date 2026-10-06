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

import { CambiarContraseniaRequest } from '../models/cambiar-contrasenia-request';
import { UsuarioRegistroRequest } from '../models/usuario-registro-request';

@Injectable({
  providedIn: 'root',
})
export class UsuarioControllerService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation cambiarContrasenia
   */
  static readonly CambiarContraseniaPath = '/api/usuarios/contrasenia';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `cambiarContrasenia()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  cambiarContrasenia$Response(params: {
    context?: HttpContext
    body: CambiarContraseniaRequest
  }
): Observable<StrictHttpResponse<{
}>> {

    const rb = new RequestBuilder(this.rootUrl, UsuarioControllerService.CambiarContraseniaPath, 'put');
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
   * To access the full response (for headers, for example), `cambiarContrasenia$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  cambiarContrasenia(params: {
    context?: HttpContext
    body: CambiarContraseniaRequest
  }
): Observable<{
}> {

    return this.cambiarContrasenia$Response(params).pipe(
      map((r: StrictHttpResponse<{
}>) => r.body as {
})
    );
  }

  /**
   * Path part for operation registrar2
   */
  static readonly Registrar2Path = '/api/usuarios';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrar2()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrar2$Response(params: {
    context?: HttpContext
    body: UsuarioRegistroRequest
  }
): Observable<StrictHttpResponse<{
}>> {

    const rb = new RequestBuilder(this.rootUrl, UsuarioControllerService.Registrar2Path, 'post');
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
   * To access the full response (for headers, for example), `registrar2$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrar2(params: {
    context?: HttpContext
    body: UsuarioRegistroRequest
  }
): Observable<{
}> {

    return this.registrar2$Response(params).pipe(
      map((r: StrictHttpResponse<{
}>) => r.body as {
})
    );
  }

}
