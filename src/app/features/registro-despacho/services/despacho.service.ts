import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { STORAGE_KEYS } from '../../../core/constants/storage-keys.constant';
import { PaginatedResult } from '../../../core/models/pagination.model';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { Variedad } from '../../variedades/models/variedad.model';
import {
  Despacho,
  DespachoFormData,
  DespachoQuery
} from '../models/despacho.model';

@Injectable({
  providedIn: 'root'
})
export class DespachoService {
  constructor(
    private localStorageService: LocalStorageService
  ) {}

  listar(
    query: DespachoQuery
  ): Observable<PaginatedResult<Despacho>> {
    const page = Math.max(1, query.page);
    const pageSize = Math.max(1, query.pageSize);
    const texto = query.texto?.trim().toUpperCase();

    const despachosFiltrados = this.obtenerDespachos()
      .filter((despacho) => {
        const contenido = [
          despacho.codigo,
          despacho.numeroContenedor,
          despacho.observaciones
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
          query.fechaDesde &&
          despacho.fechaDespacho < query.fechaDesde
        ) {
          return false;
        }

        if (
          query.fechaHasta &&
          despacho.fechaDespacho > query.fechaHasta
        ) {
          return false;
        }

        if (
          query.clienteId !== undefined &&
          despacho.clienteId !== query.clienteId
        ) {
          return false;
        }

        if (
          query.productoId !== undefined &&
          despacho.productoId !== query.productoId
        ) {
          return false;
        }

        if (
          query.situacionId !== undefined &&
          despacho.situacionId !== query.situacionId
        ) {
          return false;
        }

        if (
          query.estado !== undefined &&
          despacho.activo !== query.estado
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const comparacionFecha =
          b.fechaDespacho.localeCompare(
            a.fechaDespacho
          );

        return comparacionFecha !== 0
          ? comparacionFecha
          : b.id - a.id;
      });

    const inicio = (page - 1) * pageSize;
    const items = despachosFiltrados.slice(
      inicio,
      inicio + pageSize
    );

    return of({
      items,
      totalItems: despachosFiltrados.length,
      page,
      pageSize
    });
  }

  listarTodos(): Observable<Despacho[]> {
    const despachos = this.obtenerDespachos()
      .sort((a, b) =>
        b.fechaDespacho.localeCompare(
          a.fechaDespacho
        )
      );

    return of(despachos);
  }

  obtenerPorId(
    id: number
  ): Observable<Despacho | null> {
    const despacho =
      this.obtenerDespachos().find(
        (item) => item.id === id
      ) ?? null;

    return of(despacho);
  }

  crear(
    data: DespachoFormData
  ): Observable<Despacho> {
    const despachos = this.obtenerDespachos();

    const nuevoDespacho: Despacho = {
      id: this.generarId(despachos),
      codigo: this.generarCodigo(despachos),
      ...this.normalizarDatos(data),
      activo: true,
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: null
    };

    despachos.push(nuevoDespacho);
    this.guardarDespachos(despachos);

    return of(nuevoDespacho);
  }

  actualizar(
    id: number,
    data: DespachoFormData
  ): Observable<Despacho | null> {
    const despachos = this.obtenerDespachos();
    const posicion = despachos.findIndex(
      (item) => item.id === id
    );

    if (posicion === -1) {
      return of(null);
    }

    const despachoActualizado: Despacho = {
      ...despachos[posicion],
      ...this.normalizarDatos(data),
      fechaActualizacion: new Date().toISOString()
    };

    despachos[posicion] = despachoActualizado;
    this.guardarDespachos(despachos);

    return of(despachoActualizado);
  }

  cambiarEstado(
    id: number
  ): Observable<Despacho | null> {
    const despachos = this.obtenerDespachos();
    const posicion = despachos.findIndex(
      (item) => item.id === id
    );

    if (posicion === -1) {
      return of(null);
    }

    despachos[posicion] = {
      ...despachos[posicion],
      activo: !despachos[posicion].activo,
      fechaActualizacion: new Date().toISOString()
    };

    this.guardarDespachos(despachos);

    return of(despachos[posicion]);
  }

  relacionProductoVariedadValida(
    productoId: number,
    variedadId: number
  ): Observable<boolean> {
    const variedades =
      this.localStorageService.obtener<Variedad[]>(
        STORAGE_KEYS.VARIEDADES
      ) ?? [];

    const relacionValida = variedades.some(
      (variedad) =>
        variedad.id === variedadId &&
        variedad.productoId === productoId
    );

    return of(relacionValida);
  }

  private obtenerDespachos(): Despacho[] {
    return (
      this.localStorageService.obtener<Despacho[]>(
        STORAGE_KEYS.DESPACHOS
      ) ?? []
    );
  }

  private guardarDespachos(
    despachos: Despacho[]
  ): void {
    this.localStorageService.guardar(
      STORAGE_KEYS.DESPACHOS,
      despachos
    );
  }

  private generarId(
    despachos: Despacho[]
  ): number {
    return (
      despachos.reduce(
        (mayorId, despacho) =>
          Math.max(mayorId, despacho.id),
        0
      ) + 1
    );
  }

  private generarCodigo(
    despachos: Despacho[]
  ): string {
    const anio = new Date().getFullYear();
    const prefijo = `DES-${anio}-`;

    const ultimoCorrelativo = despachos
      .filter((despacho) =>
        despacho.codigo.startsWith(prefijo)
      )
      .reduce((mayor, despacho) => {
        const correlativo = Number(
          despacho.codigo.replace(prefijo, '')
        );

        return Number.isNaN(correlativo)
          ? mayor
          : Math.max(mayor, correlativo);
      }, 0);

    const siguiente = String(
      ultimoCorrelativo + 1
    ).padStart(4, '0');

    return `${prefijo}${siguiente}`;
  }

  private normalizarDatos(
    data: DespachoFormData
  ): DespachoFormData {
    return {
      fechaDespacho: data.fechaDespacho,
      fechaEstimadaLlegada:
        data.fechaEstimadaLlegada,
      clienteId: data.clienteId,
      navieraId: data.navieraId,
      destinoId: data.destinoId,
      operadorLogisticoId:
        data.operadorLogisticoId,
      puertoLlegadaId: data.puertoLlegadaId,
      productoId: data.productoId,
      variedadId: data.variedadId,
      viaId: data.viaId,
      situacionId: data.situacionId,
      cantidad: data.cantidad,
      unidadMedida: data.unidadMedida,
      numeroContenedor:
        data.numeroContenedor
          .trim()
          .toUpperCase(),
      observaciones:
        data.observaciones
          .trim()
          .toUpperCase()
    };
  }
}