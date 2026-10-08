/* tslint:disable */
/* eslint-disable */
import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfiguration, ApiConfigurationParams } from './api-configuration';

import { ViaControllerService } from './services/via-controller.service';
import { VariedadControllerService } from './services/variedad-controller.service';
import { UsuarioControllerService } from './services/usuario-controller.service';
import { SituacionControllerService } from './services/situacion-controller.service';
import { RolControllerService } from './services/rol-controller.service';
import { PuertoLlegadaControllerService } from './services/puerto-llegada-controller.service';
import { ProductoControllerService } from './services/producto-controller.service';
import { OperadorLogisticoControllerService } from './services/operador-logistico-controller.service';
import { NavieraControllerService } from './services/naviera-controller.service';
import { DestinoControllerService } from './services/destino-controller.service';
import { DespachoControllerService } from './services/despacho-controller.service';
import { ClienteControllerService } from './services/cliente-controller.service';
import { LoginControllerService } from './services/login-controller.service';
import { BitacoraControllerService } from './services/bitacora-controller.service';
import { ComunControllerService } from './services/comun-controller.service';

/**
 * Module that provides all services and configuration.
 */
@NgModule({
  imports: [],
  exports: [],
  declarations: [],
  providers: [
    ViaControllerService,
    VariedadControllerService,
    UsuarioControllerService,
    SituacionControllerService,
    RolControllerService,
    PuertoLlegadaControllerService,
    ProductoControllerService,
    OperadorLogisticoControllerService,
    NavieraControllerService,
    DestinoControllerService,
    DespachoControllerService,
    ClienteControllerService,
    LoginControllerService,
    BitacoraControllerService,
    ComunControllerService,
    ApiConfiguration
  ],
})
export class ApiModule {
  static forRoot(params: ApiConfigurationParams): ModuleWithProviders<ApiModule> {
    return {
      ngModule: ApiModule,
      providers: [
        {
          provide: ApiConfiguration,
          useValue: params
        }
      ]
    }
  }

  constructor( 
    @Optional() @SkipSelf() parentModule: ApiModule,
    @Optional() http: HttpClient
  ) {
    if (parentModule) {
      throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
    }
    if (!http) {
      throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
      'See also https://github.com/angular/angular/issues/20575');
    }
  }
}
