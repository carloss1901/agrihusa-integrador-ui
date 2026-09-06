import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { STORAGE_KEYS } from '../../../core/constants/storage-keys.constant';
import { PaginatedResult } from '../../../core/models/pagination.model';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import {
  Variedad,
  VariedadFormData,
  VariedadQuery
} from '../models/variedad.model';

@Injectable({
  providedIn: 'root'
})
export class VariedadService {
  constructor(
    private localStorageService: LocalStorageService
  ) {}

  listar(
    query: VariedadQuery
  ): Observable<PaginatedResult<Variedad>> {
    const page = Math.max(1, query.page);
    const pageSize = Math.max(1, query.pageSize);
    const texto = query.texto?.trim().toUpperCase();

    const variedadesFiltradas =
      this.obtenerVariedades()
        .filter((variedad) => {
          if (
            texto &&
            !variedad.nombre
              .toUpperCase()
              .includes(texto)
          ) {
            return false;
          }

          if (
            query.productoId !== undefined &&
            variedad.productoId !== query.productoId
          ) {
            return false;
          }

          if (
            query.estado !== undefined &&
            variedad.activo !== query.estado
          ) {
            return false;
          }

          return true;
        })
        .sort((a, b) => {
          const comparacionProducto =
            a.productoId - b.productoId;

          return comparacionProducto !== 0
            ? comparacionProducto
            : a.nombre.localeCompare(b.nombre);
        });

    const inicio = (page - 1) * pageSize;
    const items = variedadesFiltradas.slice(
      inicio,
      inicio + pageSize
    );

    return of({
      items,
      totalItems: variedadesFiltradas.length,
      page,
      pageSize
    });
  }

  obtenerPorId(
    id: number
  ): Observable<Variedad | null> {
    const variedad =
      this.obtenerVariedades().find(
        (item) => item.id === id
      ) ?? null;

    return of(variedad);
  }

  listarPorProducto(
    productoId: number,
    soloActivas = true
  ): Observable<Variedad[]> {
    const variedades = this.obtenerVariedades()
      .filter(
        (variedad) =>
          variedad.productoId === productoId &&
          (!soloActivas || variedad.activo)
      )
      .sort((a, b) =>
        a.nombre.localeCompare(b.nombre)
      );

    return of(variedades);
  }

  crear(
    data: VariedadFormData
  ): Observable<Variedad> {
    const variedades = this.obtenerVariedades();

    const nuevaVariedad: Variedad = {
      id: this.generarId(variedades),
      ...this.normalizarDatos(data),
      activo: true,
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: null
    };

    variedades.push(nuevaVariedad);
    this.guardarVariedades(variedades);

    return of(nuevaVariedad);
  }

  actualizar(
    id: number,
    data: VariedadFormData
  ): Observable<Variedad | null> {
    const variedades = this.obtenerVariedades();
    const posicion = variedades.findIndex(
      (item) => item.id === id
    );

    if (posicion === -1) {
      return of(null);
    }

    const variedadActualizada: Variedad = {
      ...variedades[posicion],
      ...this.normalizarDatos(data),
      fechaActualizacion: new Date().toISOString()
    };

    variedades[posicion] = variedadActualizada;
    this.guardarVariedades(variedades);

    return of(variedadActualizada);
  }

  cambiarEstado(
    id: number
  ): Observable<Variedad | null> {
    const variedades = this.obtenerVariedades();
    const posicion = variedades.findIndex(
      (item) => item.id === id
    );

    if (posicion === -1) {
      return of(null);
    }

    variedades[posicion] = {
      ...variedades[posicion],
      activo: !variedades[posicion].activo,
      fechaActualizacion: new Date().toISOString()
    };

    this.guardarVariedades(variedades);

    return of(variedades[posicion]);
  }

  existeNombre(
    productoId: number,
    nombre: string,
    idExcluir?: number
  ): Observable<boolean> {
    const nombreNormalizado =
      nombre.trim().toUpperCase();

    const existe = this.obtenerVariedades().some(
      (variedad) =>
        variedad.productoId === productoId &&
        variedad.nombre.toUpperCase() ===
          nombreNormalizado &&
        variedad.id !== idExcluir
    );

    return of(existe);
  }

  private obtenerVariedades(): Variedad[] {
    return (
      this.localStorageService.obtener<Variedad[]>(
        STORAGE_KEYS.VARIEDADES
      ) ?? []
    );
  }

  private guardarVariedades(
    variedades: Variedad[]
  ): void {
    this.localStorageService.guardar(
      STORAGE_KEYS.VARIEDADES,
      variedades
    );
  }

  private generarId(
    variedades: Variedad[]
  ): number {
    return (
      variedades.reduce(
        (mayorId, variedad) =>
          Math.max(mayorId, variedad.id),
        0
      ) + 1
    );
  }

  private normalizarDatos(
    data: VariedadFormData
  ): VariedadFormData {
    return {
      productoId: data.productoId,
      nombre: data.nombre.trim().toUpperCase()
    };
  }
}