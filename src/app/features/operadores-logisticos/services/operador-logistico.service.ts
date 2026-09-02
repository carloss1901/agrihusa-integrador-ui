import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { STORAGE_KEYS } from '../../../core/constants/storage-keys.constant';
import { PaginatedResult } from '../../../core/models/pagination.model';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import {
  OperadorLogistico,
  OperadorLogisticoFormData,
  OperadorLogisticoQuery
} from '../models/operador-logistico.model';

@Injectable({
  providedIn: 'root'
})
export class OperadorLogisticoService {
  constructor(
    private localStorageService: LocalStorageService
  ) {}

  listar(
    query: OperadorLogisticoQuery
  ): Observable<PaginatedResult<OperadorLogistico>> {
    const page = Math.max(1, query.page);
    const pageSize = Math.max(1, query.pageSize);
    const texto = query.texto?.trim().toUpperCase();

    const operadoresFiltrados =
      this.obtenerOperadores()
        .filter((operador) => {
          const contenido = [
            operador.ruc,
            operador.razonSocial,
            operador.nombreComercial,
            operador.contacto,
            operador.correo,
            operador.telefono
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
            query.estado !== undefined &&
            operador.activo !== query.estado
          ) {
            return false;
          }

          return true;
        })
        .sort((a, b) =>
          a.razonSocial.localeCompare(b.razonSocial)
        );

    const inicio = (page - 1) * pageSize;
    const items = operadoresFiltrados.slice(
      inicio,
      inicio + pageSize
    );

    return of({
      items,
      totalItems: operadoresFiltrados.length,
      page,
      pageSize
    });
  }

  obtenerPorId(
    id: number
  ): Observable<OperadorLogistico | null> {
    const operador =
      this.obtenerOperadores().find(
        (item) => item.id === id
      ) ?? null;

    return of(operador);
  }

  listarActivos(): Observable<OperadorLogistico[]> {
    const operadores = this.obtenerOperadores()
      .filter((operador) => operador.activo)
      .sort((a, b) =>
        a.razonSocial.localeCompare(b.razonSocial)
      );

    return of(operadores);
  }

  crear(
    data: OperadorLogisticoFormData
  ): Observable<OperadorLogistico> {
    const operadores = this.obtenerOperadores();

    const nuevoOperador: OperadorLogistico = {
      id: this.generarId(operadores),
      ...this.normalizarDatos(data),
      activo: true,
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: null
    };

    operadores.push(nuevoOperador);
    this.guardarOperadores(operadores);

    return of(nuevoOperador);
  }

  actualizar(
    id: number,
    data: OperadorLogisticoFormData
  ): Observable<OperadorLogistico | null> {
    const operadores = this.obtenerOperadores();
    const posicion = operadores.findIndex(
      (item) => item.id === id
    );

    if (posicion === -1) {
      return of(null);
    }

    const operadorActualizado: OperadorLogistico = {
      ...operadores[posicion],
      ...this.normalizarDatos(data),
      fechaActualizacion: new Date().toISOString()
    };

    operadores[posicion] = operadorActualizado;
    this.guardarOperadores(operadores);

    return of(operadorActualizado);
  }

  cambiarEstado(
    id: number
  ): Observable<OperadorLogistico | null> {
    const operadores = this.obtenerOperadores();
    const posicion = operadores.findIndex(
      (item) => item.id === id
    );

    if (posicion === -1) {
      return of(null);
    }

    operadores[posicion] = {
      ...operadores[posicion],
      activo: !operadores[posicion].activo,
      fechaActualizacion: new Date().toISOString()
    };

    this.guardarOperadores(operadores);

    return of(operadores[posicion]);
  }

  existeRuc(
    ruc: string,
    idExcluir?: number
  ): Observable<boolean> {
    const rucNormalizado =
      this.normalizarRuc(ruc);

    const existe = this.obtenerOperadores().some(
      (operador) =>
        this.normalizarRuc(operador.ruc) ===
          rucNormalizado &&
        operador.id !== idExcluir
    );

    return of(existe);
  }

  existeRazonSocial(
    razonSocial: string,
    idExcluir?: number
  ): Observable<boolean> {
    const razonNormalizada =
      razonSocial.trim().toUpperCase();

    const existe = this.obtenerOperadores().some(
      (operador) =>
        operador.razonSocial.trim().toUpperCase() ===
          razonNormalizada &&
        operador.id !== idExcluir
    );

    return of(existe);
  }

  private obtenerOperadores():
    OperadorLogistico[] {
    return (
      this.localStorageService.obtener<
        OperadorLogistico[]
      >(
        STORAGE_KEYS.OPERADORES_LOGISTICOS
      ) ?? []
    );
  }

  private guardarOperadores(
    operadores: OperadorLogistico[]
  ): void {
    this.localStorageService.guardar(
      STORAGE_KEYS.OPERADORES_LOGISTICOS,
      operadores
    );
  }

  private generarId(
    operadores: OperadorLogistico[]
  ): number {
    return (
      operadores.reduce(
        (mayorId, operador) =>
          Math.max(mayorId, operador.id),
        0
      ) + 1
    );
  }

  private normalizarDatos(
    data: OperadorLogisticoFormData
  ): OperadorLogisticoFormData {
    return {
      ruc: this.normalizarRuc(data.ruc),
      razonSocial:
        data.razonSocial.trim().toUpperCase(),
      nombreComercial:
        data.nombreComercial.trim().toUpperCase(),
      contacto: data.contacto.trim(),
      correo: data.correo.trim().toLowerCase(),
      telefono: data.telefono.trim(),
      direccion: data.direccion.trim()
    };
  }

  private normalizarRuc(ruc: string): string {
    return ruc.replace(/\D/g, '');
  }
}