import { Injectable } from '@angular/core';
import {
  from,
  map,
  Observable,
  of,
  switchMap
} from 'rxjs';
import { PaginatedResult } from '../models/pagination.model';
import {
    Destino,
    DestinoFormData,
    DestinoQuery
} from '../models/destino.model';
import { CustomPageDestinoResponse } from '../../api/api/models/custom-page-destino-response';
import { DestinoResponse } from '../../api/api/models/destino-response';
import { DestinoControllerService } from '../../api/api/services/destino-controller.service';
import { DestinoRegistroRequest } from '../../api/api/models/destino-registro-request';

@Injectable({
    providedIn: 'root'
})
export class DestinoService {
    constructor(
        private destinoControllerService:
            DestinoControllerService
        ) { }

    listar(
        query: DestinoQuery
        ): Observable<PaginatedResult<Destino>> {
        const page = Math.max(1, query.page);
        const pageSize = Math.max(1, query.pageSize);

        return this.consultarDestinos({
            ciudad: query.texto?.trim() || undefined,
            pais: query.pais?.trim() || undefined,
            activo: query.estado,
            pagina: page,
            tamPagina: pageSize
        }).pipe(
            map((response) => ({
            items: (response.datos ?? []).map(
                (item) => this.mapearDestino(item)
            ),
            totalItems: Number(
                response.paginacion?.totalElementos ?? 0
            ),
            page: Number(
                response.paginacion?.numeroPagina ?? page
            ),
            pageSize: Number(
                response.paginacion?.tamanioPagina ??
                pageSize
            )
            }))
        );
        }

    obtenerPorId(
        id: number
        ): Observable<Destino | null> {
        return this.consultarDestinos({
            pagina: 1,
            tamPagina: 1000
        }).pipe(
            map((response) => {
            const destino = (response.datos ?? [])
                .map((item) =>
                this.mapearDestino(item)
                )
                .find((item) => item.id === id);

            return destino ?? null;
            })
        );
        }

    listarActivos(): Observable<Destino[]> {
        return this.consultarDestinos({
            activo: true,
            pagina: 1,
            tamPagina: 1000
        }).pipe(
            map((response) =>
            (response.datos ?? [])
                .map((item) =>
                this.mapearDestino(item)
                )
                .sort((a, b) =>
                `${a.pais} ${a.ciudad}`.localeCompare(
                    `${b.pais} ${b.ciudad}`
                )
                )
            )
        );
        }

    crear(
        data: DestinoFormData
        ): Observable<Destino> {
        const datos = this.normalizarDatos(data);

        const body: DestinoRegistroRequest = {
            destinoId: 0,
            pais: datos.pais,
            ciudad: datos.ciudad
        };

        return this.destinoControllerService
            .registrar9({ body })
            .pipe(
            switchMap(() =>
                this.consultarDestinos({
                pais: datos.pais,
                ciudad: datos.ciudad,
                pagina: 1,
                tamPagina: 10
                })
            ),
            map((response) => {
                const destinoCreado =
                (response.datos ?? [])
                    .map((item) =>
                    this.mapearDestino(item)
                    )
                    .find(
                    (destino) =>
                        destino.pais === datos.pais &&
                        destino.ciudad === datos.ciudad
                    );

                if (!destinoCreado) {
                throw new Error(
                    'El destino fue registrado, pero no pudo recuperarse.'
                );
                }

                return destinoCreado;
            })
            );
        }

    actualizar(
        id: number,
        data: DestinoFormData
        ): Observable<Destino | null> {
        const datos = this.normalizarDatos(data);

        const body: DestinoRegistroRequest = {
            destinoId: id,
            pais: datos.pais,
            ciudad: datos.ciudad
        };

        return this.destinoControllerService
            .actualizar9({ body })
            .pipe(
            switchMap(() =>
                this.consultarDestinos({
                pais: datos.pais,
                ciudad: datos.ciudad,
                pagina: 1,
                tamPagina: 10
                })
            ),
            map((response) => {
                const destinoActualizado =
                (response.datos ?? [])
                    .map((item) =>
                    this.mapearDestino(item)
                    )
                    .find(
                    (destino) =>
                        destino.id === id
                    );

                return destinoActualizado ?? null;
            })
            );
        }

    cambiarEstado(
        destino: Destino
        ): Observable<Destino | null> {
        const nuevoEstado = !destino.activo;

        return this.destinoControllerService
            .cambiarEstado9({
            destinoId: destino.id,
            activo: nuevoEstado
            })
            .pipe(
            map(() => ({
                ...destino,
                activo: nuevoEstado,
                fechaActualizacion:
                new Date().toISOString()
            }))
            );
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

        return this.consultarDestinos({
            pais: datos.pais,
            ciudad: datos.ciudad,
            pagina: 1,
            tamPagina: 100
        }).pipe(
            map((response) =>
            (response.datos ?? []).some(
                (item) =>
                (item.pais ?? '')
                    .trim()
                    .toUpperCase() === datos.pais &&
                (item.ciudad ?? '')
                    .trim()
                    .toUpperCase() === datos.ciudad &&
                item.destinoId !== idExcluir
            )
            )
        );
        }
    
        private consultarDestinos(
        params: {
            pais?: string;
            ciudad?: string;
            activo?: boolean;
            pagina?: number;
            tamPagina?: number;
        }
        ): Observable<CustomPageDestinoResponse> {
        return this.destinoControllerService
            .listarDestinos(params)
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
                    ) as CustomPageDestinoResponse
                )
                );
            })
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

    private mapearDestino(
        response: DestinoResponse
        ): Destino {
        return {
            id: response.destinoId ?? 0,
            pais: response.pais ?? '',
            ciudad: response.ciudad ?? '',
            activo: response.activo ?? false,
            fechaCreacion: '',
            fechaActualizacion: null
        };
        }
}
