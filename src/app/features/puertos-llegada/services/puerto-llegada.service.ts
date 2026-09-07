import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { STORAGE_KEYS } from '../../../core/constants/storage-keys.constant';
import { PaginatedResult } from '../../../core/models/pagination.model';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import {
  PuertoLlegada,
  PuertoLlegadaFormData,
  PuertoLlegadaQuery
} from '../models/puerto-llegada.model';

@Injectable({
  providedIn: 'root'
})
export class PuertoLlegadaService {
  constructor(
    private localStorageService: LocalStorageService
  ) {}

  listar(
    query: PuertoLlegadaQuery
  ): Observable<PaginatedResult<PuertoLlegada>> {
    const page = Math.max(1, query.page);
    const pageSize = Math.max(1, query.pageSize);
    const texto = query.texto?.trim().toUpperCase();
    const pais = query.pais?.trim().toUpperCase();

    const puertosFiltrados = this.obtenerPuertos()
      .filter((puerto) => {
        const contenido = [
          puerto.codigo,
          puerto.puerto,
          puerto.pais
        ]
          .join(' ')
          .toUpperCase();

        if (
          texto &&
          !contenido.includes(texto)
        ) {
          return false;
        }

        if (
          pais &&
          puerto.pais.toUpperCase() !== pais
        ) {
          return false;
        }

        if (
          query.estado !== undefined &&
          puerto.activo !== query.estado
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const comparacionPais =
          a.pais.localeCompare(b.pais);

        return comparacionPais !== 0
          ? comparacionPais
          : a.puerto.localeCompare(b.puerto);
      });

    const inicio = (page - 1) * pageSize;
    const items = puertosFiltrados.slice(
      inicio,
      inicio + pageSize
    );

    return of({
      items,
      totalItems: puertosFiltrados.length,
      page,
      pageSize
    });
  }

  obtenerPorId(
    id: number
  ): Observable<PuertoLlegada | null> {
    const puerto =
      this.obtenerPuertos().find(
        (item) => item.id === id
      ) ?? null;

    return of(puerto);
  }

  listarActivos(): Observable<PuertoLlegada[]> {
    const puertos = this.obtenerPuertos()
      .filter((puerto) => puerto.activo)
      .sort((a, b) =>
        `${a.pais} ${a.puerto}`.localeCompare(
          `${b.pais} ${b.puerto}`
        )
      );

    return of(puertos);
  }

  crear(
    data: PuertoLlegadaFormData
  ): Observable<PuertoLlegada> {
    const puertos = this.obtenerPuertos();

    const nuevoPuerto: PuertoLlegada = {
      id: this.generarId(puertos),
      ...this.normalizarDatos(data),
      activo: true,
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: null
    };

    puertos.push(nuevoPuerto);
    this.guardarPuertos(puertos);

    return of(nuevoPuerto);
  }

  actualizar(
    id: number,
    data: PuertoLlegadaFormData
  ): Observable<PuertoLlegada | null> {
    const puertos = this.obtenerPuertos();
    const posicion = puertos.findIndex(
      (item) => item.id === id
    );

    if (posicion === -1) {
      return of(null);
    }

    const puertoActualizado: PuertoLlegada = {
      ...puertos[posicion],
      ...this.normalizarDatos(data),
      fechaActualizacion: new Date().toISOString()
    };

    puertos[posicion] = puertoActualizado;
    this.guardarPuertos(puertos);

    return of(puertoActualizado);
  }

  cambiarEstado(
    id: number
  ): Observable<PuertoLlegada | null> {
    const puertos = this.obtenerPuertos();
    const posicion = puertos.findIndex(
      (item) => item.id === id
    );

    if (posicion === -1) {
      return of(null);
    }

    puertos[posicion] = {
      ...puertos[posicion],
      activo: !puertos[posicion].activo,
      fechaActualizacion: new Date().toISOString()
    };

    this.guardarPuertos(puertos);

    return of(puertos[posicion]);
  }

  existeCodigo(
    codigo: string,
    idExcluir?: number
  ): Observable<boolean> {
    const codigoNormalizado =
      this.normalizarCodigo(codigo);

    const existe = this.obtenerPuertos().some(
      (puerto) =>
        this.normalizarCodigo(puerto.codigo) ===
          codigoNormalizado &&
        puerto.id !== idExcluir
    );

    return of(existe);
  }

  existePuerto(
    pais: string,
    nombrePuerto: string,
    idExcluir?: number
  ): Observable<boolean> {
    const datos = this.normalizarDatos({
      codigo: '',
      pais,
      puerto: nombrePuerto
    });

    const existe = this.obtenerPuertos().some(
      (puerto) =>
        puerto.pais.toUpperCase() === datos.pais &&
        puerto.puerto.toUpperCase() ===
          datos.puerto &&
        puerto.id !== idExcluir
    );

    return of(existe);
  }

  private obtenerPuertos(): PuertoLlegada[] {
    return (
      this.localStorageService.obtener<
        PuertoLlegada[]
      >(
        STORAGE_KEYS.PUERTOS_LLEGADA
      ) ?? []
    );
  }

  private guardarPuertos(
    puertos: PuertoLlegada[]
  ): void {
    this.localStorageService.guardar(
      STORAGE_KEYS.PUERTOS_LLEGADA,
      puertos
    );
  }

  private generarId(
    puertos: PuertoLlegada[]
  ): number {
    return (
      puertos.reduce(
        (mayorId, puerto) =>
          Math.max(mayorId, puerto.id),
        0
      ) + 1
    );
  }

  private normalizarDatos(
    data: PuertoLlegadaFormData
  ): PuertoLlegadaFormData {
    return {
      codigo: this.normalizarCodigo(data.codigo),
      puerto: data.puerto.trim().toUpperCase(),
      pais: data.pais.trim().toUpperCase()
    };
  }

  private normalizarCodigo(
    codigo: string
  ): string {
    return codigo
      .trim()
      .toUpperCase()
      .replace(/\s+/g, '');
  }
}