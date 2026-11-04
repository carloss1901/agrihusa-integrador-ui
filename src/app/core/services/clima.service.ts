import { Injectable } from '@angular/core';
import {
  from,
  map,
  Observable,
  of,
  switchMap
} from 'rxjs';

import { ClimaResponse } from '../../api/api/models/clima-response';
import { ClimaControllerService } from '../../api/api/services/clima-controller.service';
import { Clima } from '../models/clima.model';

@Injectable({
  providedIn: 'root'
})
export class ClimaService {
  constructor(
    private readonly api: ClimaControllerService
  ) {}

  consultar(destino: string): Observable<Clima> {
    return this.api.consultar({
      destino: destino.trim()
    }).pipe(
      switchMap((response) => {
        const contenido: unknown = response;

        if (!(contenido instanceof Blob)) {
          return of(this.mapear(response));
        }

        return from(contenido.text()).pipe(
          map((texto) =>
            this.mapear(
              JSON.parse(texto) as ClimaResponse
            )
          )
        );
      })
    );
  }

  private mapear(response: ClimaResponse): Clima {
    return {
      destino: response.destino ?? '',
      pais: response.pais ?? '',
      latitud: response.latitud ?? 0,
      longitud: response.longitud ?? 0,
      temperaturaCelsius:
        response.temperaturaCelsius ?? 0,
      precipitacionMm:
        response.precipitacionMm ?? 0,
      velocidadVientoKmh:
        response.velocidadVientoKmh ?? 0,
      codigoTiempo: response.codigoTiempo ?? 0,
      descripcion: response.descripcion ?? '',
      zonaHoraria: response.zonaHoraria ?? '',
      fechaClima: response.fechaClima ?? '',
      fechaConsulta: response.fechaConsulta ?? '',
      desdeCache: response.desdeCache ?? false
    };
  }
}