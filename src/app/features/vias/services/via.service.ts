import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { STORAGE_KEYS } from '../../../core/constants/storage-keys.constant';
import { PaginatedResult } from '../../../core/models/pagination.model';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import {
  Via,
  ViaFormData,
  ViaQuery
} from '../models/via.model';

@Injectable({
  providedIn: 'root'
})
export class ViaService {
  constructor(
    private localStorageService: LocalStorageService
  ) {}

  listar(
    query: ViaQuery
  ): Observable<PaginatedResult<Via>> {
    const page = Math.max(1, query.page);
    const pageSize = Math.max(1, query.pageSize);
    const texto = query.texto?.trim().toUpperCase();

    const viasFiltradas = this.obtenerVias()
      .filter((via) => {
        if (
          texto &&
          !via.descripcion
            .toUpperCase()
            .includes(texto)
        ) {
          return false;
        }

        if (
          query.estado !== undefined &&
          via.activo !== query.estado
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) =>
        a.descripcion.localeCompare(b.descripcion)
      );

    const inicio = (page - 1) * pageSize;
    const items = viasFiltradas.slice(
      inicio,
      inicio + pageSize
    );

    return of({
      items,
      totalItems: viasFiltradas.length,
      page,
      pageSize
    });
  }

  obtenerPorId(
    id: number
  ): Observable<Via | null> {
    const via =
      this.obtenerVias().find(
        (item) => item.id === id
      ) ?? null;

    return of(via);
  }

  listarActivas(): Observable<Via[]> {
    const vias = this.obtenerVias()
      .filter((via) => via.activo)
      .sort((a, b) =>
        a.descripcion.localeCompare(b.descripcion)
      );

    return of(vias);
  }

  crear(
    data: ViaFormData
  ): Observable<Via> {
    const vias = this.obtenerVias();

    const nuevaVia: Via = {
      id: this.generarId(vias),
      ...this.normalizarDatos(data),
      activo: true,
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: null
    };

    vias.push(nuevaVia);
    this.guardarVias(vias);

    return of(nuevaVia);
  }

  actualizar(
    id: number,
    data: ViaFormData
  ): Observable<Via | null> {
    const vias = this.obtenerVias();
    const posicion = vias.findIndex(
      (item) => item.id === id
    );

    if (posicion === -1) {
      return of(null);
    }

    const viaActualizada: Via = {
      ...vias[posicion],
      ...this.normalizarDatos(data),
      fechaActualizacion: new Date().toISOString()
    };

    vias[posicion] = viaActualizada;
    this.guardarVias(vias);

    return of(viaActualizada);
  }

  cambiarEstado(
    id: number
  ): Observable<Via | null> {
    const vias = this.obtenerVias();
    const posicion = vias.findIndex(
      (item) => item.id === id
    );

    if (posicion === -1) {
      return of(null);
    }

    vias[posicion] = {
      ...vias[posicion],
      activo: !vias[posicion].activo,
      fechaActualizacion: new Date().toISOString()
    };

    this.guardarVias(vias);

    return of(vias[posicion]);
  }

  existeDescripcion(
    descripcion: string,
    idExcluir?: number
  ): Observable<boolean> {
    const descripcionNormalizada =
      descripcion.trim().toUpperCase();

    const existe = this.obtenerVias().some(
      (via) =>
        via.descripcion.toUpperCase() ===
          descripcionNormalizada &&
        via.id !== idExcluir
    );

    return of(existe);
  }

  private obtenerVias(): Via[] {
    return (
      this.localStorageService.obtener<Via[]>(
        STORAGE_KEYS.VIAS
      ) ?? []
    );
  }

  private guardarVias(
    vias: Via[]
  ): void {
    this.localStorageService.guardar(
      STORAGE_KEYS.VIAS,
      vias
    );
  }

  private generarId(
    vias: Via[]
  ): number {
    return (
      vias.reduce(
        (mayorId, via) =>
          Math.max(mayorId, via.id),
        0
      ) + 1
    );
  }

  private normalizarDatos(
    data: ViaFormData
  ): ViaFormData {
    return {
      descripcion:
        data.descripcion.trim().toUpperCase()
    };
  }
}