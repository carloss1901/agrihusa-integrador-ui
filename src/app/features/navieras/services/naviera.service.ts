import { Injectable } from '@angular/core';
import {
  from,
  map,
  Observable,
  of,
  switchMap
} from 'rxjs';
import { PaginatedResult } from '../../../core/models/pagination.model';
import {
    Naviera,
    NavieraFormData,
    NavieraQuery
} from '../models/naviera.model';
import { CustomPageNavieraResponse } from '../../../api/api/models/custom-page-naviera-response';
import { NavieraResponse } from '../../../api/api/models/naviera-response';
import { NavieraControllerService } from '../../../api/api/services/naviera-controller.service';
import { NavieraRegistroRequest } from '../../../api/api/models/naviera-registro-request';

@Injectable({
    providedIn: 'root'
})
export class NavieraService {
    constructor(
        private navieraControllerService:
            NavieraControllerService
        ) { }

    listar(
        query: NavieraQuery
        ): Observable<PaginatedResult<Naviera>> {
        const page = Math.max(1, query.page);
        const pageSize = Math.max(1, query.pageSize);

        return this.consultarNavieras({
            texto: query.texto?.trim() || undefined,
            pais: query.pais?.trim() || undefined,
            activo: query.estado,
            pagina: page,
            tamPagina: pageSize
        }).pipe(
            map((response) => ({
            items: (response.datos ?? []).map(
                (item) => this.mapearNaviera(item)
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
        ): Observable<Naviera | null> {
        return this.consultarNavieras({
            pagina: 1,
            tamPagina: 1000
        }).pipe(
            map((response) => {
            const naviera = (response.datos ?? [])
                .map((item) =>
                this.mapearNaviera(item)
                )
                .find((item) => item.id === id);

            return naviera ?? null;
            })
        );
        }

    listarActivas(): Observable<Naviera[]> {
        return this.consultarNavieras({
            activo: true,
            pagina: 1,
            tamPagina: 1000
        }).pipe(
            map((response) =>
            (response.datos ?? [])
                .map((item) =>
                this.mapearNaviera(item)
                )
                .sort((a, b) =>
                a.nombre.localeCompare(b.nombre)
                )
            )
        );
        }

    crear(
        data: NavieraFormData
        ): Observable<Naviera> {
        const datos = this.normalizarDatos(data);

        const body: NavieraRegistroRequest = {
            navieraId: 0,
            codigo: datos.codigo,
            nombre: datos.nombre,
            pais: datos.pais,
            contacto: datos.contacto || undefined,
            correo: datos.correo || undefined,
            telefono: datos.telefono || undefined,
            sitioWeb: datos.sitioWeb || undefined
        };

        return this.navieraControllerService
            .registrar8({ body })
            .pipe(
            switchMap(() =>
                this.consultarNavieras({
                texto: datos.codigo,
                pagina: 1,
                tamPagina: 10
                })
            ),
            map((response) => {
                const navieraCreada =
                (response.datos ?? [])
                    .map((item) =>
                    this.mapearNaviera(item)
                    )
                    .find(
                    (naviera) =>
                        naviera.codigo === datos.codigo
                    );

                if (!navieraCreada) {
                throw new Error(
                    'La naviera fue registrada, pero no pudo recuperarse.'
                );
                }

                return navieraCreada;
            })
            );
        }

    actualizar(
        id: number,
        data: NavieraFormData
        ): Observable<Naviera | null> {
        const datos = this.normalizarDatos(data);

        const body: NavieraRegistroRequest = {
            navieraId: id,
            codigo: datos.codigo,
            nombre: datos.nombre,
            pais: datos.pais,
            contacto: datos.contacto || undefined,
            correo: datos.correo || undefined,
            telefono: datos.telefono || undefined,
            sitioWeb: datos.sitioWeb || undefined
        };

        return this.navieraControllerService
            .actualizar8({ body })
            .pipe(
            switchMap(() =>
                this.consultarNavieras({
                texto: datos.codigo,
                pagina: 1,
                tamPagina: 10
                })
            ),
            map((response) => {
                const navieraActualizada =
                (response.datos ?? [])
                    .map((item) =>
                    this.mapearNaviera(item)
                    )
                    .find(
                    (naviera) =>
                        naviera.id === id
                    );

                return navieraActualizada ?? null;
            })
            );
        }

    cambiarEstado(
        naviera: Naviera
        ): Observable<Naviera | null> {
        const nuevoEstado = !naviera.activo;

        return this.navieraControllerService
            .cambiarEstado8({
            navieraId: naviera.id,
            activo: nuevoEstado
            })
            .pipe(
            map(() => ({
                ...naviera,
                activo: nuevoEstado,
                fechaActualizacion:
                new Date().toISOString()
            }))
            );
        }

    existeCodigo(
        codigo: string,
        idExcluir?: number
        ): Observable<boolean> {
        const codigoNormalizado =
            codigo.trim().toUpperCase();

        return this.consultarNavieras({
            texto: codigoNormalizado,
            pagina: 1,
            tamPagina: 100
        }).pipe(
            map((response) =>
            (response.datos ?? []).some(
                (item) =>
                (item.codigo ?? '')
                    .trim()
                    .toUpperCase() === codigoNormalizado &&
                item.navieraId !== idExcluir
            )
            )
        );
        }

    existeNombre(
        nombre: string,
        idExcluir?: number
        ): Observable<boolean> {
        const nombreNormalizado =
            nombre.trim().toUpperCase();

        return this.consultarNavieras({
            texto: nombre.trim(),
            pagina: 1,
            tamPagina: 100
        }).pipe(
            map((response) =>
            (response.datos ?? []).some(
                (item) =>
                (item.nombre ?? '')
                    .trim()
                    .toUpperCase() === nombreNormalizado &&
                item.navieraId !== idExcluir
            )
            )
        );
        }

    private consultarNavieras(
        params: {
            texto?: string;
            pais?: string;
            activo?: boolean;
            pagina?: number;
            tamPagina?: number;
        }
        ): Observable<CustomPageNavieraResponse> {
        return this.navieraControllerService
            .listar(params)
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
                    ) as CustomPageNavieraResponse
                )
                );
            })
            );
        }
    
    private mapearNaviera(
        response: NavieraResponse
        ): Naviera {
        return {
            id: response.navieraId ?? 0,
            codigo: response.codigo ?? '',
            nombre: response.nombre ?? '',
            pais: response.pais ?? '',
            contacto: response.contacto ?? '',
            correo: response.correo ?? '',
            telefono: response.telefono ?? '',
            sitioWeb: response.sitioWeb ?? '',
            activo: response.activo ?? false,
            fechaCreacion: '',
            fechaActualizacion: null
        };
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