import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { STORAGE_KEYS } from '../../../core/constants/storage-keys.constant';
import { PaginatedResult } from '../../../core/models/pagination.model';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import {
    Cliente,
    ClienteFormData,
    ClienteQuery,
    TipoDocumentoCliente
} from '../models/cliente.model';

@Injectable({
    providedIn: 'root'
})
export class ClienteService {
    constructor(
        private localStorageService: LocalStorageService
    ) { }

    listar(
        query: ClienteQuery
    ): Observable<PaginatedResult<Cliente>> {
        const page = Math.max(1, query.page);
        const pageSize = Math.max(1, query.pageSize);
        const texto = query.texto?.trim().toUpperCase();

        const clientesFiltrados = this.obtenerClientes()
            .filter((cliente) => {
                const contenido = [
                    cliente.numeroDocumento,
                    cliente.razonSocial,
                    cliente.nombreComercial,
                    cliente.contacto,
                    cliente.correo,
                    cliente.pais
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
                    query.tipoDocumento !== undefined &&
                    cliente.tipoDocumento !== query.tipoDocumento
                ) {
                    return false;
                }

                if (
                    query.estado !== undefined &&
                    cliente.activo !== query.estado
                ) {
                    return false;
                }

                return true;
            })
            .sort((a, b) =>
                a.razonSocial.localeCompare(b.razonSocial)
            );

        const inicio = (page - 1) * pageSize;
        const items = clientesFiltrados.slice(
            inicio,
            inicio + pageSize
        );

        return of({
            items,
            totalItems: clientesFiltrados.length,
            page,
            pageSize
        });
    }

    obtenerPorId(
        id: number
    ): Observable<Cliente | null> {
        const cliente =
            this.obtenerClientes().find(
                (item) => item.id === id
            ) ?? null;

        return of(cliente);
    }

    listarActivos(): Observable<Cliente[]> {
        const clientes = this.obtenerClientes()
            .filter((cliente) => cliente.activo)
            .sort((a, b) =>
                a.razonSocial.localeCompare(b.razonSocial)
            );

        return of(clientes);
    }

    crear(
        data: ClienteFormData
    ): Observable<Cliente> {
        const clientes = this.obtenerClientes();
        const datosNormalizados =
            this.normalizarDatos(data);

        const nuevoCliente: Cliente = {
            id: this.generarId(clientes),
            ...datosNormalizados,
            activo: true,
            fechaCreacion: new Date().toISOString(),
            fechaActualizacion: null
        };

        clientes.push(nuevoCliente);
        this.guardarClientes(clientes);

        return of(nuevoCliente);
    }

    actualizar(
        id: number,
        data: ClienteFormData
    ): Observable<Cliente | null> {
        const clientes = this.obtenerClientes();
        const posicion = clientes.findIndex(
            (item) => item.id === id
        );

        if (posicion === -1) {
            return of(null);
        }

        const clienteActualizado: Cliente = {
            ...clientes[posicion],
            ...this.normalizarDatos(data),
            fechaActualizacion: new Date().toISOString()
        };

        clientes[posicion] = clienteActualizado;
        this.guardarClientes(clientes);

        return of(clienteActualizado);
    }

    cambiarEstado(
        id: number
    ): Observable<Cliente | null> {
        const clientes = this.obtenerClientes();
        const posicion = clientes.findIndex(
            (item) => item.id === id
        );

        if (posicion === -1) {
            return of(null);
        }

        clientes[posicion] = {
            ...clientes[posicion],
            activo: !clientes[posicion].activo,
            fechaActualizacion: new Date().toISOString()
        };

        this.guardarClientes(clientes);

        return of(clientes[posicion]);
    }

    existeDocumento(
        tipoDocumento: TipoDocumentoCliente,
        numeroDocumento: string,
        idExcluir?: number
    ): Observable<boolean> {
        const documentoNormalizado =
            this.normalizarDocumento(numeroDocumento);

        const existe = this.obtenerClientes().some(
            (cliente) =>
                cliente.tipoDocumento === tipoDocumento &&
                this.normalizarDocumento(
                    cliente.numeroDocumento
                ) === documentoNormalizado &&
                cliente.id !== idExcluir
        );

        return of(existe);
    }

    existeRazonSocial(
        razonSocial: string,
        idExcluir?: number
    ): Observable<boolean> {
        const razonNormalizada =
            razonSocial.trim().toUpperCase();

        const existe = this.obtenerClientes().some(
            (cliente) =>
                cliente.razonSocial.trim().toUpperCase() ===
                razonNormalizada &&
                cliente.id !== idExcluir
        );

        return of(existe);
    }

    private obtenerClientes(): Cliente[] {
        return (
            this.localStorageService.obtener<Cliente[]>(
                STORAGE_KEYS.CLIENTES
            ) ?? []
        );
    }

    private guardarClientes(
        clientes: Cliente[]
    ): void {
        this.localStorageService.guardar(
            STORAGE_KEYS.CLIENTES,
            clientes
        );
    }

    private generarId(
        clientes: Cliente[]
    ): number {
        return (
            clientes.reduce(
                (mayorId, cliente) =>
                    Math.max(mayorId, cliente.id),
                0
            ) + 1
        );
    }

    private normalizarDatos(
        data: ClienteFormData
    ): ClienteFormData {
        return {
            tipoDocumento: data.tipoDocumento,
            numeroDocumento:
                this.normalizarDocumento(
                    data.numeroDocumento
                ),
            razonSocial:
                data.razonSocial.trim().toUpperCase(),
            nombreComercial:
                data.nombreComercial.trim().toUpperCase(),
            contacto: data.contacto.trim(),
            correo: data.correo.trim().toLowerCase(),
            telefono: data.telefono.trim(),
            direccion: data.direccion.trim(),
            pais: data.pais.trim().toUpperCase()
        };
    }

    private normalizarDocumento(
        numeroDocumento: string
    ): string {
        return numeroDocumento
            .trim()
            .toUpperCase()
            .replace(/\s+/g, '');
    }
}