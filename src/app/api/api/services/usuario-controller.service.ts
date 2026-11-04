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
import { MessageResponse } from '../models/message-response';
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
    activo?: boolean;
    pagina?: number;
    tamPagina?: number;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<CustomPageUsuarioResponse>> {

    const rb = new RequestBuilder(this.rootUrl, UsuarioControllerService.ListarUsuariosPath, 'get');
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
   * Path part for operation actualizarUsuario
   */
  static readonly ActualizarUsuarioPath = '/api/usuarios';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `actualizarUsuario()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  actualizarUsuario$Response(params: {
    context?: HttpContext
    body: UsuarioRegistroRequest
  }
): Observable<StrictHttpResponse<MessageResponse>> {

    const rb = new RequestBuilder(this.rootUrl, UsuarioControllerService.ActualizarUsuarioPath, 'put');
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
   * To access the full response (for headers, for example), `actualizarUsuario$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  actualizarUsuario(params: {
    context?: HttpContext
    body: UsuarioRegistroRequest
  }
): Observable<MessageResponse> {

    return this.actualizarUsuario$Response(params).pipe(
      map((r: StrictHttpResponse<MessageResponse>) => r.body as MessageResponse)
    );
  }

  /**
   * Path part for operation registrarUsuario
   */
  static readonly RegistrarUsuarioPath = '/api/usuarios';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registrarUsuario()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrarUsuario$Response(params: {
    context?: HttpContext
    body: UsuarioRegistroRequest
  }
): Observable<StrictHttpResponse<MessageResponse>> {

    const rb = new RequestBuilder(this.rootUrl, UsuarioControllerService.RegistrarUsuarioPath, 'post');
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
   * To access the full response (for headers, for example), `registrarUsuario$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registrarUsuario(params: {
    context?: HttpContext
    body: UsuarioRegistroRequest
  }
): Observable<MessageResponse> {

    return this.registrarUsuario$Response(params).pipe(
      map((r: StrictHttpResponse<MessageResponse>) => r.body as MessageResponse)
    );
  }

  /**
   * Path part for operation cambiarEstadoUsuario
   */
  static readonly CambiarEstadoUsuarioPath = '/api/usuarios';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `cambiarEstadoUsuario()` instead.
   *
   * This method doesn't expect any request body.
   */
  cambiarEstadoUsuario$Response(params: {
    usuarioId: number;
    activo: boolean;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<MessageResponse>> {

    const rb = new RequestBuilder(this.rootUrl, UsuarioControllerService.CambiarEstadoUsuarioPath, 'delete');
    if (params) {
      rb.query('usuarioId', params.usuarioId, {});
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
   * To access the full response (for headers, for example), `cambiarEstadoUsuario$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  cambiarEstadoUsuario(params: {
    usuarioId: number;
    activo: boolean;
    context?: HttpContext
  }
): Observable<MessageResponse> {

    return this.cambiarEstadoUsuario$Response(params).pipe(
      map((r: StrictHttpResponse<MessageResponse>) => r.body as MessageResponse)
    );
  }

  /**
   * Path part for operation cambiarContraseniaUsuario
   */
  static readonly CambiarContraseniaUsuarioPath = '/api/usuarios/contrasenia';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `cambiarContraseniaUsuario()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  cambiarContraseniaUsuario$Response(params: {
    context?: HttpContext
    body: CambiarContraseniaRequest
  }
): Observable<StrictHttpResponse<MessageResponse>> {

    const rb = new RequestBuilder(this.rootUrl, UsuarioControllerService.CambiarContraseniaUsuarioPath, 'put');
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
   * To access the full response (for headers, for example), `cambiarContraseniaUsuario$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  cambiarContraseniaUsuario(params: {
    context?: HttpContext
    body: CambiarContraseniaRequest
  }
): Observable<MessageResponse> {

    return this.cambiarContraseniaUsuario$Response(params).pipe(
      map((r: StrictHttpResponse<MessageResponse>) => r.body as MessageResponse)
    );
  }

}
