import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { OperadorLogisticoControllerService } from '../../api/api/services/operador-logistico-controller.service';
import { MessageResponse } from '../../api/api/models/message-response';
import { OperadorLogisticoRegistroRequest } from '../../api/api/models/operador-logistico-registro-request';
import { PaginatedResult } from '../models/pagination.model';
import { OperadorLogistico, OperadorLogisticoFormData, OperadorLogisticoQuery } from '../../features/operadores-logisticos/models/operador-logistico.model';
@Injectable({ providedIn: 'root' })
export class OperadorLogisticoService {
  constructor(private readonly api: OperadorLogisticoControllerService) {}
  listar(query: OperadorLogisticoQuery): Observable<PaginatedResult<OperadorLogistico>> {
    return this.api.listarOperadores({ texto: query.texto?.trim() || undefined, activo: query.estado, pagina: query.page, tamPagina: query.pageSize }).pipe(map((response) => ({ items: (response.datos ?? []).map((item) => ({ id: item.operadorLogisticoId ?? 0, ruc: item.ruc ?? '', razonSocial: item.razonSocial ?? '', nombreComercial: item.nombreComercial ?? '', contacto: item.contacto ?? '', correo: item.correo ?? '', telefono: item.telefono ?? '', direccion: item.direccion ?? '', activo: item.activo ?? true, fechaCreacion: '', fechaActualizacion: null })), totalItems: response.paginacion?.totalElementos ?? 0, page: response.paginacion?.numeroPagina ?? query.page, pageSize: response.paginacion?.tamanioPagina ?? query.pageSize })));
  }
  crear(data: OperadorLogisticoFormData): Observable<MessageResponse> { return this.api.registrar7({ body: this.request(data) }); }
  actualizar(id: number, data: OperadorLogisticoFormData): Observable<MessageResponse> { return this.api.actualizar6({ body: this.request(data, id) }); }
  cambiarEstado(id: number, activo: boolean): Observable<MessageResponse> { return this.api.cambiarEstado6({ operadorLogisticoId: id, activo }); }
  private request(data: OperadorLogisticoFormData, operadorLogisticoId = 0): OperadorLogisticoRegistroRequest { return { operadorLogisticoId, ruc: data.ruc.trim(), razonSocial: data.razonSocial.trim().toUpperCase(), nombreComercial: data.nombreComercial.trim().toUpperCase(), contacto: data.contacto.trim(), correo: data.correo.trim().toLowerCase(), telefono: data.telefono.trim(), direccion: data.direccion.trim() }; }
}