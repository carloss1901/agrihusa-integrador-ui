import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { STORAGE_KEYS } from '../../../core/constants/storage-keys.constant';
import { PaginatedResult } from '../../../core/models/pagination.model';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import {
    Destino,
    DestinoFormData,
    DestinoQuery
} from '../models/destino.model';

@Injectable({
    providedIn: 'root'
})
export class DestinoService {
    constructor(
        private localStorageService: LocalStorageService
    ) { }

    listar(
        query: DestinoQuery
    ): Observable<PaginatedResult<Destino>> {
        const page = Math.max(1, query.page);
        const pageSize = Math.max(1, query.pageSize);
        const texto = query.texto?.trim().toUpperCase();
        const pais = query.pais?.trim().toUpperCase();

        const destinosFiltrados = this.obtenerDestinos()
            .filter((destino) => {
                const contenido = [
                    destino.pais,
                    destino.ciudad
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
                    destino.pais.toUpperCase() !== pais
                ) {
                    return false;
                }

                if (
                    query.estado !== undefined &&
                    destino.activo !== query.estado
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
                    : a.ciudad.localeCompare(b.ciudad);
            });

        const inicio = (page - 1) * pageSize;
        const items = destinosFiltrados.slice(
            inicio,
            inicio + pageSize
        );

        return of({
            items,
            totalItems: destinosFiltrados.length,
            page,
            pageSize
        });
    }

    obtenerPorId(
        id: number
    ): Observable<Destino | null> {
        const destino =
            this.obtenerDestinos().find(
                (item) => item.id === id
            ) ?? null;

        return of(destino);
    }

    listarActivos(): Observable<Destino[]> {
        const destinos = this.obtenerDestinos()
            .filter((destino) => destino.activo)
            .sort((a, b) =>
                `${a.pais} ${a.ciudad}`.localeCompare(
                    `${b.pais} ${b.ciudad}`
                )
            );

        return of(destinos);
    }

    crear(
        data: DestinoFormData
    ): Observable<Destino> {
        const destinos = this.obtenerDestinos();

        const nuevoDestino: Destino = {
            id: this.generarId(destinos),
            ...this.normalizarDatos(data),
            activo: true,
            fechaCreacion: new Date().toISOString(),
            fechaActualizacion: null
        };

        destinos.push(nuevoDestino);
        this.guardarDestinos(destinos);

        return of(nuevoDestino);
    }

    actualizar(
        id: number,
        data: DestinoFormData
    ): Observable<Destino | null> {
        const destinos = this.obtenerDestinos();
        const posicion = destinos.findIndex(
            (item) => item.id === id
        );

        if (posicion === -1) {
            return of(null);
        }

        const destinoActualizado: Destino = {
            ...destinos[posicion],
            ...this.normalizarDatos(data),
            fechaActualizacion: new Date().toISOString()
        };

        destinos[posicion] = destinoActualizado;
        this.guardarDestinos(destinos);

        return of(destinoActualizado);
    }

    cambiarEstado(
        id: number
    ): Observable<Destino | null> {
        const destinos = this.obtenerDestinos();
        const posicion = destinos.findIndex(
            (item) => item.id === id
        );

        if (posicion === -1) {
            return of(null);
        }

        destinos[posicion] = {
            ...destinos[posicion],
            activo: !destinos[posicion].activo,
            fechaActualizacion: new Date().toISOString()
        };

        this.guardarDestinos(destinos);

        return of(destinos[posicion]);
    }

    existeUbicacion(
        pais: string,
        ciudad: string,
        idExcluir?: number
    ): Observable<boolean> {
        const datos = this.normalizarDatos({
            pais,
            ciudad
        });

        const existe = this.obtenerDestinos().some(
            (destino) =>
                destino.pais.toUpperCase() === datos.pais &&
                destino.ciudad.toUpperCase() ===
                datos.ciudad &&
                destino.id !== idExcluir
        );

        return of(existe);
    }

    private obtenerDestinos(): Destino[] {
        return (
            this.localStorageService.obtener<Destino[]>(
                STORAGE_KEYS.DESTINOS
            ) ?? []
        );
    }

    private guardarDestinos(
        destinos: Destino[]
    ): void {
        this.localStorageService.guardar(
            STORAGE_KEYS.DESTINOS,
            destinos
        );
    }

    private generarId(
        destinos: Destino[]
    ): number {
        return (
            destinos.reduce(
                (mayorId, destino) =>
                    Math.max(mayorId, destino.id),
                0
            ) + 1
        );
    }

    private normalizarDatos(
        data: DestinoFormData
    ): DestinoFormData {
        return {
            pais: data.pais.trim().toUpperCase(),
            ciudad: data.ciudad.trim().toUpperCase()
        };
    }
}