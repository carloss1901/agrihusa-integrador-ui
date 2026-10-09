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
import { CustomPageUsuarioResponse } from '../models/custom-page-usuario-response';
import { PerfilUsuarioActualizarRequest } from '../models/perfil-usuario-actualizar-request';
import { UsuarioActualizarRequest } from '../models/usuario-actualizar-request';
import { UsuarioRegistroRequest } from '../models/usuario-registro-request';
import { UsuarioResponse } from '../models/usuario-response';

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
   * Path part for operation listarUsuarios
   */
  static readonly ListarUsuariosPath = '/api/usuarios';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `listarUsuarios()` instead.
   *
   * This method doesn't expect any request body.
   */
  listarUsuarios$Response(params?: {
    texto?: string;
    rolId?: number;
    activo?: boolean;
    pagina?: number;
    tamPagina?: number;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<CustomPageUsuarioResponse>> {

    const rb = new RequestBuilder(this.rootUrl, UsuarioControllerService.ListarUsuariosPath, 'get');
    if (params) {
      rb.query('texto', params.texto, {});
      rb.query('rolId', params.rolId, {});
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
        return r as StrictHttpResponse<CustomPageUsuarioResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `listarUsuarios$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  listarUsuarios(params?: {
    texto?: string;
    rolId?: number;
    activo?: boolean;
    pagina?: number;
    tamPagina?: number;
    context?: HttpContext
  }
): Observable<CustomPageUsuarioResponse> {

    return this.listarUsuarios$Response(params).pipe(
      map((r: StrictHttpResponse<CustomPageUsuarioResponse>) => r.body as CustomPageUsuarioResponse)
    );
  }

  /**
   * Path part for operation actualizar2
   */
  static readonly Actualizar2Path = '/api/usuarios';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `actualizar2()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  actualizar2$Response(params: {
    context?: HttpContext
    body: UsuarioActualizarRequest
  }
): Observable<StrictHttpResponse<{
}>> {

    const rb = new RequestBuilder(this.rootUrl, UsuarioControllerService.Actualizar2Path, 'put');
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
   * To access the full response (for headers, for example), `actualizar2$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  actualizar2(params: {
    context?: HttpContext
    body: UsuarioActualizarRequest
  }
): Observable<{
}> {

    return this.actualizar2$Response(params).pipe(
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

  /**
   * Path part for operation cambiarEstado2
   */
  static readonly CambiarEstado2Path = '/api/usuarios';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `cambiarEstado2()` instead.
   *
   * This method doesn't expect any request body.
   */
  cambiarEstado2$Response(params: {
    usuarioId: number;
    activo: boolean;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<{
}>> {

    const rb = new RequestBuilder(this.rootUrl, UsuarioControllerService.CambiarEstado2Path, 'delete');
    if (params) {
      rb.query('usuarioId', params.usuarioId, {});
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
   * To access the full response (for headers, for example), `cambiarEstado2$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  cambiarEstado2(params: {
    usuarioId: number;
    activo: boolean;
    context?: HttpContext
  }
): Observable<{
}> {

    return this.cambiarEstado2$Response(params).pipe(
      map((r: StrictHttpResponse<{
}>) => r.body as {
})
    );
  }

  /**
   * Path part for operation actualizarPerfil
   */
  static readonly ActualizarPerfilPath = '/api/usuarios/perfil';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `actualizarPerfil()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  actualizarPerfil$Response(params: {
    context?: HttpContext
    body: PerfilUsuarioActualizarRequest
  }
): Observable<StrictHttpResponse<{
}>> {

    const rb = new RequestBuilder(this.rootUrl, UsuarioControllerService.ActualizarPerfilPath, 'put');
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
   * To access the full response (for headers, for example), `actualizarPerfil$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  actualizarPerfil(params: {
    context?: HttpContext
    body: PerfilUsuarioActualizarRequest
  }
): Observable<{
}> {

    return this.actualizarPerfil$Response(params).pipe(
      map((r: StrictHttpResponse<{
}>) => r.body as {
})
    );
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
   * Path part for operation obtenerPorId
   */
  static readonly ObtenerPorIdPath = '/api/usuarios/{usuarioId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `obtenerPorId()` instead.
   *
   * This method doesn't expect any request body.
   */
  obtenerPorId$Response(params: {
    usuarioId: number;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<UsuarioResponse>> {

    const rb = new RequestBuilder(this.rootUrl, UsuarioControllerService.ObtenerPorIdPath, 'get');
    if (params) {
      rb.path('usuarioId', params.usuarioId, {});
    }

    return this.http.request(rb.build({
      responseType: 'blob',
      accept: '*/*',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<UsuarioResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `obtenerPorId$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  obtenerPorId(params: {
    usuarioId: number;
    context?: HttpContext
  }
): Observable<UsuarioResponse> {

    return this.obtenerPorId$Response(params).pipe(
      map((r: StrictHttpResponse<UsuarioResponse>) => r.body as UsuarioResponse)
    );
  }

}
