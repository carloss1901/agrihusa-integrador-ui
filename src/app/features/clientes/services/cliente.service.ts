import { Injectable } from '@angular/core';
import {
  from,
  map,
  Observable,
  of,
  switchMap
} from 'rxjs';
import { ClienteResponse } from '../../../api/api/models/cliente-response';
import { ClienteControllerService } from '../../../api/api/services/cliente-controller.service';
import { PaginatedResult } from '../../../core/models/pagination.model';
import {
    Cliente,
    ClienteFormData,
    ClienteQuery,
    TipoDocumentoCliente
} from '../models/cliente.model';
import { ClienteRegistroRequest } from '../../../api/api/models/cliente-registro-request';
import { CustomPageClienteResponse } from '../../../api/api/models/custom-page-cliente-response';

@Injectable({
    providedIn: 'root'
})
export class ClienteService {
    constructor(
        private clienteControllerService: ClienteControllerService
    ) { }

    listar(
        query: ClienteQuery
        ): Observable<PaginatedResult<Cliente>> {
        const page = Math.max(1, query.page);
        const pageSize = Math.max(1, query.pageSize);

        return this.consultarClientes({
            texto: query.texto?.trim() || undefined,
            tipoDocumento: query.tipoDocumento,
            activo: query.estado,
            pagina: page,
            tamPagina: pageSize
        }).pipe(
            map((response) => {
        
            const items = (response.datos ?? []).map(
                (item) => this.mapearCliente(item)
            );

            const resultado = {
                items,
                totalItems: Number(
                response.paginacion?.totalElementos ?? 0
                ),
                page: Number(
                response.paginacion?.numeroPagina ?? page
                ),
                pageSize: Number(
                response.paginacion?.tamanioPagina ?? pageSize
                )
            };

            return resultado;
            })
        );
        }

    obtenerPorId(
        id: number
        ): Observable<Cliente | null> {
        return this.consultarClientes({
            pagina: 1,
            tamPagina: 1000
        }).pipe(
            map((response) => {
            const cliente = (response.datos ?? [])
                .map((item) => this.mapearCliente(item))
                .find((item) => item.id === id);

            return cliente ?? null;
            })
        );
        }

    listarActivos(): Observable<Cliente[]> {
        return this.consultarClientes({
            activo: true,
            pagina: 1,
            tamPagina: 1000
        }).pipe(
            map((response) =>
            (response.datos ?? [])
                .map((item) =>
                this.mapearCliente(item)
                )
                .sort((a, b) =>
                a.razonSocial.localeCompare(
                    b.razonSocial
                )
                )
            )
        );
        }

    crear(
        data: ClienteFormData
        ): Observable<Cliente> {
        const datos = this.normalizarDatos(data);

        const body: ClienteRegistroRequest = {
            clienteId: 0,
            tipoDocumento: datos.tipoDocumento,
            numeroDocumento: datos.numeroDocumento,
            razonSocial: datos.razonSocial,
            nombreComercial: datos.nombreComercial || undefined,
            contacto: datos.contacto || undefined,
            correo: datos.correo || undefined,
            telefono: datos.telefono || undefined,
            direccion: datos.direccion || undefined,
            pais: datos.pais
        };

        return this.clienteControllerService
            .registrar11({ body })
            .pipe(
            switchMap(() =>
                this.consultarClientes({
                texto: datos.numeroDocumento,
                tipoDocumento: datos.tipoDocumento,
                pagina: 1,
                tamPagina: 10
                })
            ),
            map((response) => {
                const clienteCreado = (response.datos ?? [])
                .map((item) => this.mapearCliente(item))
                .find(
                    (cliente) =>
                    this.normalizarDocumento(
                        cliente.numeroDocumento
                    ) === datos.numeroDocumento
                );

                if (!clienteCreado) {
                throw new Error(
                    'El cliente fue registrado, pero no pudo recuperarse.'
                );
                }

                return clienteCreado;
            })
            );
        }

    actualizar(
        id: number,
        data: ClienteFormData
        ): Observable<Cliente | null> {
        const datos = this.normalizarDatos(data);

        const body: ClienteRegistroRequest = {
            clienteId: id,
            tipoDocumento: datos.tipoDocumento,
            numeroDocumento: datos.numeroDocumento,
            razonSocial: datos.razonSocial,
            nombreComercial:
            datos.nombreComercial || undefined,
            contacto: datos.contacto || undefined,
            correo: datos.correo || undefined,
            telefono: datos.telefono || undefined,
            direccion: datos.direccion || undefined,
            pais: datos.pais
        };

        return this.clienteControllerService
            .actualizar11({ body })
            .pipe(
            switchMap(() =>
                this.consultarClientes({
                texto: datos.numeroDocumento,
                tipoDocumento: datos.tipoDocumento,
                pagina: 1,
                tamPagina: 10
                })
            ),
            map((response) => {
                const clienteActualizado =
                (response.datos ?? [])
                    .map((item) =>
                    this.mapearCliente(item)
                    )
                    .find(
                    (cliente) =>
                        cliente.id === id
                    );

                if (!clienteActualizado) {
                return null;
                }

                return clienteActualizado;
            })
            );
        }

    cambiarEstado(
        cliente: Cliente
        ): Observable<Cliente | null> {
        const nuevoEstado = !cliente.activo;

        return this.clienteControllerService
            .cambiarEstado11({
            clienteId: cliente.id,
            activo: nuevoEstado
            })
            .pipe(
            map(() => ({
                ...cliente,
                activo: nuevoEstado,
                fechaActualizacion:
                new Date().toISOString()
            }))
            );
        }

    existeDocumento(
        tipoDocumento: TipoDocumentoCliente,
        numeroDocumento: string,
        idExcluir?: number
        ): Observable<boolean> {
        const documento =
            this.normalizarDocumento(numeroDocumento);

        return this.consultarClientes({
            texto: documento,
            tipoDocumento,
            pagina: 1,
            tamPagina: 100
        }).pipe(
            map((response) =>
            (response.datos ?? []).some(
                (item) =>
                this.normalizarDocumento(
                    item.numeroDocumento ?? ''
                ) === documento &&
                item.clienteId !== idExcluir
            )
            )
        );
        }

    existeRazonSocial(
        razonSocial: string,
        idExcluir?: number
        ): Observable<boolean> {
        const razonNormalizada =
            razonSocial.trim().toUpperCase();

        return this.consultarClientes({
            texto: razonSocial.trim(),
            pagina: 1,
            tamPagina: 100
        }).pipe(
            map((response) =>
            (response.datos ?? []).some(
                (item) =>
                (item.razonSocial ?? '')
                    .trim()
                    .toUpperCase() === razonNormalizada &&
                item.clienteId !== idExcluir
            )
            )
        );
        }
    

    private consultarClientes(
        params: {
            texto?: string;
            tipoDocumento?: string;
            activo?: boolean;
            pagina?: number;
            tamPagina?: number;
        }
        ): Observable<CustomPageClienteResponse> {
        return this.clienteControllerService
            .listar2(params)
            .pipe(
            switchMap((response) => {
                const contenido: unknown = response;

                if (!(contenido instanceof Blob)) {
                return of(response);
                }

                return from(contenido.text()).pipe(
                map(
                    (texto) =>
                    JSON.parse(
                        texto
                    ) as CustomPageClienteResponse
                )
                );
            })
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

    private mapearCliente(
        response: ClienteResponse
        ): Cliente {
        return {
            id: response.clienteId ?? 0,
            tipoDocumento: (
            response.tipoDocumento ??
            TipoDocumentoCliente.OTRO
            ) as TipoDocumentoCliente,
            numeroDocumento: response.numeroDocumento ?? '',
            razonSocial: response.razonSocial ?? '',
            nombreComercial: response.nombreComercial ?? '',
            contacto: response.contacto ?? '',
            correo: response.correo ?? '',
            telefono: response.telefono ?? '',
            direccion: response.direccion ?? '',
            pais: response.pais ?? '',
            activo: response.activo ?? false,
            fechaCreacion: '',
            fechaActualizacion: null
        };
        }
}