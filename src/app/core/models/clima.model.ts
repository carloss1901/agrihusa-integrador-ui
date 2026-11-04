export interface Clima {
  destino: string;
  pais: string;
  latitud: number;
  longitud: number;
  temperaturaCelsius: number;
  precipitacionMm: number;
  velocidadVientoKmh: number;
  codigoTiempo: number;
  descripcion: string;
  zonaHoraria: string;
  fechaClima: string;
  fechaConsulta: string;
  desdeCache: boolean;
}