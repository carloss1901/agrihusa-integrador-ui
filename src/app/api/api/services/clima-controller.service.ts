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

import { ClimaResponse } from '../models/clima-response';

@Injectable({
  providedIn: 'root',
})
export class ClimaControllerService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation consultar
   */
  static readonly ConsultarPath = '/api/meteorologia';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `consultar()` instead.
   *
   * This method doesn't expect any request body.
   */
  consultar$Response(params: {
    destino: string;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<ClimaResponse>> {

    const rb = new RequestBuilder(this.rootUrl, ClimaControllerService.ConsultarPath, 'get');
    if (params) {
      rb.query('destino', params.destino, {});
    }

    return this.http.request(rb.build({
      responseType: 'blob',
      accept: '*/*',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ClimaResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `consultar$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  consultar(params: {
    destino: string;
    context?: HttpContext
  }
): Observable<ClimaResponse> {

    return this.consultar$Response(params).pipe(
      map((r: StrictHttpResponse<ClimaResponse>) => r.body as ClimaResponse)
    );
  }

}
