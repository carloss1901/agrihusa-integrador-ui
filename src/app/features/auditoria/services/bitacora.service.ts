import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { STORAGE_KEYS } from '../../../core/constants/storage-keys.constant';
import { PaginatedResult } from '../../../core/models/pagination.model';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import {
    BitacoraQuery,
    RegistroBitacora,
    RegistroBitacoraCrearData
} from '../models/bitacora.model';

@Injectable({
    providedIn: 'root'
})
export class BitacoraService {
    constructor(
        private localStorageService: LocalStorageService
    ) { }

    listar(
        query: BitacoraQuery
    ): Observable<PaginatedResult<RegistroBitacora>> {
        const page = Math.max(1, query.page);
        const pageSize = Math.max(1, query.pageSize);
        const usuario =
            query.usuario?.trim().toUpperCase();

        const fechaDesde = this.obtenerInicioDia(
            query.fechaDesde
        );

        const fechaHasta = this.obtenerFinDia(
            query.fechaHasta
        );

        const registrosFiltrados = [
            ...this.obtenerRegistros()
        ]
            .filter((registro) => {
                if (
                    usuario &&
                    !registro.nombreUsuario
                        .toUpperCase()
                        .includes(usuario)
                ) {
                    return false;
                }

                if (
                    query.accion !== undefined &&
                    registro.accion !== query.accion
                ) {
                    return false;
                }

                if (
                    query.modulo !== undefined &&
                    registro.modulo !== query.modulo
                ) {
                    return false;
                }

                if (
                    query.resultado !== undefined &&
                    registro.resultado !== query.resultado
                ) {
                    return false;
                }

                const fechaRegistro =
                    new Date(registro.fecha).getTime();

                if (
                    fechaDesde !== null &&
                    fechaRegistro < fechaDesde
                ) {
                    return false;
                }

                if (
                    fechaHasta !== null &&
                    fechaRegistro > fechaHasta
                ) {
                    return false;
                }

                return true;
            })
            .sort((a, b) =>
                b.fecha.localeCompare(a.fecha)
            );

        const inicio = (page - 1) * pageSize;
        const items = registrosFiltrados.slice(
            inicio,
            inicio + pageSize
        );

        return of({
            items,
            totalItems: registrosFiltrados.length,
            page,
            pageSize
        });
    }

    obtenerPorId(
        id: number
    ): Observable<RegistroBitacora | null> {
        const registro =
            this.obtenerRegistros().find(
                (item) => item.id === id
            ) ?? null;

        return of(registro);
    }

    registrar(
        data: RegistroBitacoraCrearData
    ): Observable<RegistroBitacora> {
        const registros = this.obtenerRegistros();

        const nuevoRegistro: RegistroBitacora = {
            id: this.generarId(registros),
            fecha: new Date().toISOString(),
            usuarioId: data.usuarioId,
            nombreUsuario:
                data.nombreUsuario.trim().toUpperCase() ||
                'SISTEMA',
            modulo: data.modulo,
            accion: data.accion,
            entidad: data.entidad.trim(),
            registroId: data.registroId,
            detalle: data.detalle.trim().slice(0, 500),
            resultado: data.resultado
        };

        registros.push(nuevoRegistro);

        this.localStorageService.guardar(
            STORAGE_KEYS.BITACORA,
            registros
        );

        return of(nuevoRegistro);
    }

    private obtenerRegistros(): RegistroBitacora[] {
        return (
            this.localStorageService.obtener<
                RegistroBitacora[]
            >(STORAGE_KEYS.BITACORA) ?? []
        );
    }

    private generarId(
        registros: RegistroBitacora[]
    ): number {
        return (
            registros.reduce(
                (mayorId, registro) =>
                    Math.max(mayorId, registro.id),
                0
            ) + 1
        );
    }

    private obtenerInicioDia(
        fecha?: string
    ): number | null {
        if (!fecha) {
            return null;
        }

        const resultado = new Date(
            `${fecha}T00:00:00`
        ).getTime();

        return Number.isNaN(resultado)
            ? null
            : resultado;
    }

    private obtenerFinDia(
        fecha?: string
    ): number | null {
        if (!fecha) {
            return null;
        }

        const resultado = new Date(
            `${fecha}T23:59:59.999`
        ).getTime();

        return Number.isNaN(resultado)
            ? null
            : resultado;
    }
}