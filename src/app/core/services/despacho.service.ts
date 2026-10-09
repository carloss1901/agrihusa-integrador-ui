import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { DespachoControllerService } from '../../api/api/services/despacho-controller.service';
import { DespachoRegistroRequest } from '../../api/api/models/despacho-registro-request';
import { MessageResponse } from '../../api/api/models/message-response';
import { PaginatedResult } from '../models/pagination.model';
import { Despacho, DespachoFormData, DespachoQuery, UnidadMedidaDespacho } from '../models/despacho.model';

@Injectable({ providedIn: 'root' })
export class DespachoService {
  constructor(private readonly api: DespachoControllerService) {}
  listar(query: DespachoQuery): Observable<PaginatedResult<Despacho>> {
    return this.api.listarDespachos({ texto: query.texto?.trim() || undefined, clienteId: query.clienteId, situacionId: query.situacionId, activo: query.estado, pagina: query.page, tamPagina: query.pageSize }).pipe(
      map((response) => ({
        items: (response.datos ?? []).map((item) => ({
          id: item.despachoId ?? 0, codigo: item.codigo ?? '', fechaDespacho: item.fechaDespacho ?? '', fechaEstimadaLlegada: item.fechaEstimadaLlegada ?? '', clienteId: item.clienteId ?? 0, navieraId: item.navieraId ?? 0, destinoId: item.destinoId ?? 0, operadorLogisticoId: item.operadorLogisticoId ?? 0, puertoLlegadaId: item.puertoLlegadaId ?? 0, productoId: item.productoId ?? 0, variedadId: item.variedadId ?? 0, viaId: item.viaId ?? 0, situacionId: item.situacionId ?? 0, cantidad: item.cantidad ?? 0, unidadMedida: item.unidadMedida as UnidadMedidaDespacho, numeroContenedor: item.numeroContenedor ?? '', observaciones: item.observaciones ?? '', activo: item.activo ?? true, fechaCreacion: '', fechaActualizacion: null
        })),
        totalItems: response.paginacion?.totalElementos ?? 0,
        page: response.paginacion?.numeroPagina ?? query.page,
        pageSize: response.paginacion?.tamanioPagina ?? query.pageSize
      }))
    );
  }
  crear(data: DespachoFormData): Observable<MessageResponse> { return this.api.registrarDespacho({ body: this.request(data) }); }
  actualizar(id: number, data: DespachoFormData): Observable<MessageResponse> { return this.api.actualizarDespacho({ body: this.request(data, id) }); }
  cambiarEstado(id: number, activo = true): Observable<Despacho> { return this.api.cambiarEstadoDespacho({ despachoId: id, activo }).pipe(map(() => ({ id, codigo: '', activo, fechaCreacion: '', fechaActualizacion: null } as Despacho))); }
  relacionProductoVariedadValida(_productoId: number, _variedadId: number): Observable<boolean> { return of(true); }
  private request(data: DespachoFormData, despachoId = 0): DespachoRegistroRequest { return { despachoId, fechaDespacho: data.fechaDespacho, fechaEstimadaLlegada: data.fechaEstimadaLlegada, clienteId: data.clienteId, navieraId: data.navieraId, destinoId: data.destinoId, operadorLogisticoId: data.operadorLogisticoId, puertoLlegadaId: data.puertoLlegadaId, productoId: data.productoId, variedadId: data.variedadId, viaId: data.viaId, situacionId: data.situacionId, cantidad: data.cantidad, unidadMedida: data.unidadMedida, numeroContenedor: data.numeroContenedor.trim(), observaciones: data.observaciones.trim() }; }
}
