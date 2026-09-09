import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { STORAGE_KEYS } from '../../../core/constants/storage-keys.constant';
import { PaginatedResult } from '../../../core/models/pagination.model';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import {
    Naviera,
    NavieraFormData,
    NavieraQuery
} from '../models/naviera.model';

@Injectable({
    providedIn: 'root'
})
export class NavieraService {
    constructor(
        private localStorageService: LocalStorageService
    ) { }

    listar(
        query: NavieraQuery
    ): Observable<PaginatedResult<Naviera>> {
        const page = Math.max(1, query.page);
        const pageSize = Math.max(1, query.pageSize);
        const texto = query.texto?.trim().toUpperCase();
        const pais = query.pais?.trim().toUpperCase();

        const navierasFiltradas = this.obtenerNavieras()
            .filter((naviera) => {
                const contenido = [
                    naviera.codigo,
                    naviera.nombre,
                    naviera.pais,
                    naviera.contacto,
                    naviera.correo
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
                    naviera.pais.toUpperCase() !== pais
                ) {
                    return false;
                }

                if (
                    query.estado !== undefined &&
                    naviera.activo !== query.estado
                ) {
                    return false;
                }

                return true;
            })
            .sort((a, b) =>
                a.nombre.localeCompare(b.nombre)
            );

        const inicio = (page - 1) * pageSize;
        const items = navierasFiltradas.slice(
            inicio,
            inicio + pageSize
        );

        return of({
            items,
            totalItems: navierasFiltradas.length,
            page,
            pageSize
        });
    }

    obtenerPorId(
        id: number
    ): Observable<Naviera | null> {
        const naviera =
            this.obtenerNavieras().find(
                (item) => item.id === id
            ) ?? null;

        return of(naviera);
    }

    listarActivas(): Observable<Naviera[]> {
        const navieras = this.obtenerNavieras()
            .filter((naviera) => naviera.activo)
            .sort((a, b) =>
                a.nombre.localeCompare(b.nombre)
            );

        return of(navieras);
    }

    crear(
        data: NavieraFormData
    ): Observable<Naviera> {
        const navieras = this.obtenerNavieras();

        const nuevaNaviera: Naviera = {
            id: this.generarId(navieras),
            ...this.normalizarDatos(data),
            activo: true,
            fechaCreacion: new Date().toISOString(),
            fechaActualizacion: null
        };

        navieras.push(nuevaNaviera);
        this.guardarNavieras(navieras);

        return of(nuevaNaviera);
    }

    actualizar(
        id: number,
        data: NavieraFormData
    ): Observable<Naviera | null> {
        const navieras = this.obtenerNavieras();
        const posicion = navieras.findIndex(
            (item) => item.id === id
        );

        if (posicion === -1) {
            return of(null);
        }

        const navieraActualizada: Naviera = {
            ...navieras[posicion],
            ...this.normalizarDatos(data),
            fechaActualizacion: new Date().toISOString()
        };

        navieras[posicion] = navieraActualizada;
        this.guardarNavieras(navieras);

        return of(navieraActualizada);
    }

    cambiarEstado(
        id: number
    ): Observable<Naviera | null> {
        const navieras = this.obtenerNavieras();
        const posicion = navieras.findIndex(
            (item) => item.id === id
        );

        if (posicion === -1) {
            return of(null);
        }

        navieras[posicion] = {
            ...navieras[posicion],
            activo: !navieras[posicion].activo,
            fechaActualizacion: new Date().toISOString()
        };

        this.guardarNavieras(navieras);

        return of(navieras[posicion]);
    }

    existeCodigo(
        codigo: string,
        idExcluir?: number
    ): Observable<boolean> {
        const codigoNormalizado =
            codigo.trim().toUpperCase();

        const existe = this.obtenerNavieras().some(
            (naviera) =>
                naviera.codigo.trim().toUpperCase() ===
                codigoNormalizado &&
                naviera.id !== idExcluir
        );

        return of(existe);
    }

    existeNombre(
        nombre: string,
        idExcluir?: number
    ): Observable<boolean> {
        const nombreNormalizado =
            nombre.trim().toUpperCase();

        const existe = this.obtenerNavieras().some(
            (naviera) =>
                naviera.nombre.trim().toUpperCase() ===
                nombreNormalizado &&
                naviera.id !== idExcluir
        );

        return of(existe);
    }

    private obtenerNavieras(): Naviera[] {
        return (
            this.localStorageService.obtener<Naviera[]>(
                STORAGE_KEYS.NAVIERAS
            ) ?? []
        );
    }

    private guardarNavieras(
        navieras: Naviera[]
    ): void {
        this.localStorageService.guardar(
            STORAGE_KEYS.NAVIERAS,
            navieras
        );
    }

    private generarId(
        navieras: Naviera[]
    ): number {
        return (
            navieras.reduce(
                (mayorId, naviera) =>
                    Math.max(mayorId, naviera.id),
                0
            ) + 1
        );
    }

    private normalizarDatos(
        data: NavieraFormData
    ): NavieraFormData {
        return {
            codigo: data.codigo
                .trim()
                .toUpperCase()
                .replace(/\s+/g, ''),
            nombre: data.nombre.trim().toUpperCase(),
            pais: data.pais.trim().toUpperCase(),
            contacto: data.contacto.trim(),
            correo: data.correo.trim().toLowerCase(),
            telefono: data.telefono.trim(),
            sitioWeb: data.sitioWeb.trim()
        };
    }
}