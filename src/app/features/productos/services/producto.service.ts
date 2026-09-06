import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { STORAGE_KEYS } from '../../../core/constants/storage-keys.constant';
import { PaginatedResult } from '../../../core/models/pagination.model';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import {
  Producto,
  ProductoFormData,
  ProductoQuery
} from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  constructor(
    private localStorageService: LocalStorageService
  ) {}

  listar(
    query: ProductoQuery
  ): Observable<PaginatedResult<Producto>> {
    const page = Math.max(1, query.page);
    const pageSize = Math.max(1, query.pageSize);
    const texto = query.texto?.trim().toUpperCase();

    const productosFiltrados = this.obtenerProductos()
      .filter((producto) => {
        const contenido = [
          producto.codigo,
          producto.nombre,
          producto.descripcion
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
          producto.activo !== query.estado
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) =>
        a.nombre.localeCompare(b.nombre)
      );

    const inicio = (page - 1) * pageSize;
    const items = productosFiltrados.slice(
      inicio,
      inicio + pageSize
    );

    return of({
      items,
      totalItems: productosFiltrados.length,
      page,
      pageSize
    });
  }

  obtenerPorId(
    id: number
  ): Observable<Producto | null> {
    const producto =
      this.obtenerProductos().find(
        (item) => item.id === id
      ) ?? null;

    return of(producto);
  }

  listarActivos(): Observable<Producto[]> {
    const productos = this.obtenerProductos()
      .filter((producto) => producto.activo)
      .sort((a, b) =>
        a.nombre.localeCompare(b.nombre)
      );

    return of(productos);
  }

  crear(
    data: ProductoFormData
  ): Observable<Producto> {
    const productos = this.obtenerProductos();

    const nuevoProducto: Producto = {
      id: this.generarId(productos),
      ...this.normalizarDatos(data),
      activo: true,
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: null
    };

    productos.push(nuevoProducto);
    this.guardarProductos(productos);

    return of(nuevoProducto);
  }

  actualizar(
    id: number,
    data: ProductoFormData
  ): Observable<Producto | null> {
    const productos = this.obtenerProductos();
    const posicion = productos.findIndex(
      (item) => item.id === id
    );

    if (posicion === -1) {
      return of(null);
    }

    const productoActualizado: Producto = {
      ...productos[posicion],
      ...this.normalizarDatos(data),
      fechaActualizacion: new Date().toISOString()
    };

    productos[posicion] = productoActualizado;
    this.guardarProductos(productos);

    return of(productoActualizado);
  }

  cambiarEstado(
    id: number
  ): Observable<Producto | null> {
    const productos = this.obtenerProductos();
    const posicion = productos.findIndex(
      (item) => item.id === id
    );

    if (posicion === -1) {
      return of(null);
    }

    productos[posicion] = {
      ...productos[posicion],
      activo: !productos[posicion].activo,
      fechaActualizacion: new Date().toISOString()
    };

    this.guardarProductos(productos);

    return of(productos[posicion]);
  }

  existeCodigo(
    codigo: string,
    idExcluir?: number
  ): Observable<boolean> {
    const codigoNormalizado =
      this.normalizarCodigo(codigo);

    const existe = this.obtenerProductos().some(
      (producto) =>
        this.normalizarCodigo(producto.codigo) ===
          codigoNormalizado &&
        producto.id !== idExcluir
    );

    return of(existe);
  }

  existeNombre(
    nombre: string,
    idExcluir?: number
  ): Observable<boolean> {
    const nombreNormalizado =
      nombre.trim().toUpperCase();

    const existe = this.obtenerProductos().some(
      (producto) =>
        producto.nombre.toUpperCase() ===
          nombreNormalizado &&
        producto.id !== idExcluir
    );

    return of(existe);
  }

  private obtenerProductos(): Producto[] {
    return (
      this.localStorageService.obtener<Producto[]>(
        STORAGE_KEYS.PRODUCTOS
      ) ?? []
    );
  }

  private guardarProductos(
    productos: Producto[]
  ): void {
    this.localStorageService.guardar(
      STORAGE_KEYS.PRODUCTOS,
      productos
    );
  }

  private generarId(
    productos: Producto[]
  ): number {
    return (
      productos.reduce(
        (mayorId, producto) =>
          Math.max(mayorId, producto.id),
        0
      ) + 1
    );
  }

  private normalizarDatos(
    data: ProductoFormData
  ): ProductoFormData {
    return {
      codigo: this.normalizarCodigo(data.codigo),
      nombre: data.nombre.trim().toUpperCase(),
      descripcion:
        data.descripcion.trim().toUpperCase()
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