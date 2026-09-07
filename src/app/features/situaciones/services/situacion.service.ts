import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { STORAGE_KEYS } from '../../../core/constants/storage-keys.constant';
import { PaginatedResult } from '../../../core/models/pagination.model';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import {
  Situacion,
  SituacionFormData,
  SituacionQuery
} from '../models/situacion.model';

@Injectable({
  providedIn: 'root'
})
export class SituacionService {
  constructor(
    private localStorageService: LocalStorageService
  ) {}

  listar(
    query: SituacionQuery
  ): Observable<PaginatedResult<Situacion>> {
    const page = Math.max(1, query.page);
    const pageSize = Math.max(1, query.pageSize);
    const texto = query.texto?.trim().toUpperCase();

    const situacionesFiltradas =
      this.obtenerSituaciones()
        .filter((situacion) => {
          if (
            texto &&
            !situacion.descripcion
              .toUpperCase()
              .includes(texto)
          ) {
            return false;
          }

          if (
            query.estado !== undefined &&
            situacion.activo !== query.estado
          ) {
            return false;
          }

          return true;
        })
        .sort((a, b) =>
          a.descripcion.localeCompare(b.descripcion)
        );

    const inicio = (page - 1) * pageSize;
    const items = situacionesFiltradas.slice(
      inicio,
      inicio + pageSize
    );

    return of({
      items,
      totalItems: situacionesFiltradas.length,
      page,
      pageSize
    });
  }

  obtenerPorId(
    id: number
  ): Observable<Situacion | null> {
    const situacion =
      this.obtenerSituaciones().find(
        (item) => item.id === id
      ) ?? null;

    return of(situacion);
  }

  listarActivas(): Observable<Situacion[]> {
    const situaciones = this.obtenerSituaciones()
      .filter((situacion) => situacion.activo)
      .sort((a, b) =>
        a.descripcion.localeCompare(b.descripcion)
      );

    return of(situaciones);
  }

  crear(
    data: SituacionFormData
  ): Observable<Situacion> {
    const situaciones = this.obtenerSituaciones();

    const nuevaSituacion: Situacion = {
      id: this.generarId(situaciones),
      ...this.normalizarDatos(data),
      activo: true,
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: null
    };

    situaciones.push(nuevaSituacion);
    this.guardarSituaciones(situaciones);

    return of(nuevaSituacion);
  }

  actualizar(
    id: number,
    data: SituacionFormData
  ): Observable<Situacion | null> {
    const situaciones = this.obtenerSituaciones();
    const posicion = situaciones.findIndex(
      (item) => item.id === id
    );

    if (posicion === -1) {
      return of(null);
    }

    const situacionActualizada: Situacion = {
      ...situaciones[posicion],
      ...this.normalizarDatos(data),
      fechaActualizacion: new Date().toISOString()
    };

    situaciones[posicion] = situacionActualizada;
    this.guardarSituaciones(situaciones);

    return of(situacionActualizada);
  }

  cambiarEstado(
    id: number
  ): Observable<Situacion | null> {
    const situaciones = this.obtenerSituaciones();
    const posicion = situaciones.findIndex(
      (item) => item.id === id
    );

    if (posicion === -1) {
      return of(null);
    }

    situaciones[posicion] = {
      ...situaciones[posicion],
      activo: !situaciones[posicion].activo,
      fechaActualizacion: new Date().toISOString()
    };

    this.guardarSituaciones(situaciones);

    return of(situaciones[posicion]);
  }

  existeDescripcion(
    descripcion: string,
    idExcluir?: number
  ): Observable<boolean> {
    const descripcionNormalizada =
      descripcion.trim().toUpperCase();

    const existe = this.obtenerSituaciones().some(
      (situacion) =>
        situacion.descripcion.toUpperCase() ===
          descripcionNormalizada &&
        situacion.id !== idExcluir
    );

    return of(existe);
  }

  private obtenerSituaciones(): Situacion[] {
    return (
      this.localStorageService.obtener<Situacion[]>(
        STORAGE_KEYS.SITUACIONES
      ) ?? []
    );
  }

  private guardarSituaciones(
    situaciones: Situacion[]
  ): void {
    this.localStorageService.guardar(
      STORAGE_KEYS.SITUACIONES,
      situaciones
    );
  }

  private generarId(
    situaciones: Situacion[]
  ): number {
    return (
      situaciones.reduce(
        (mayorId, situacion) =>
          Math.max(mayorId, situacion.id),
        0
      ) + 1
    );
  }

  private normalizarDatos(
    data: SituacionFormData
  ): SituacionFormData {
    return {
      descripcion:
        data.descripcion.trim().toUpperCase()
    };
  }
}