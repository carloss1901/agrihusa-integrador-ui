import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ClienteControllerService } from '../../api/api/services/cliente-controller.service';
import { MessageResponse } from '../../api/api/models/message-response';
import { ClienteRegistroRequest } from '../../api/api/models/cliente-registro-request';
import { PaginatedResult } from '../models/pagination.model';
import { Cliente, ClienteFormData, ClienteQuery } from '../models/cliente.model';
@Injectable({ providedIn: 'root' })
export class ClienteService {
  constructor(private readonly api: ClienteControllerService) {}
  listar(query: ClienteQuery): Observable<PaginatedResult<Cliente>> { return this.api.listarClientes({ texto: query.texto?.trim() || undefined, tipoDocumento: query.tipoDocumento, activo: query.estado, pagina: query.page, tamPagina: query.pageSize }).pipe(map((response) => ({ items: (response.datos ?? []).map((item) => ({ id: item.clienteId ?? 0, tipoDocumento: item.tipoDocumento as Cliente['tipoDocumento'], numeroDocumento: item.numeroDocumento ?? '', razonSocial: item.razonSocial ?? '', nombreComercial: item.nombreComercial ?? '', contacto: item.contacto ?? '', correo: item.correo ?? '', telefono: item.telefono ?? '', direccion: item.direccion ?? '', pais: item.pais ?? '', activo: item.activo ?? true, fechaCreacion: '', fechaActualizacion: null })), totalItems: response.paginacion?.totalElementos ?? 0, page: response.paginacion?.numeroPagina ?? query.page, pageSize: response.paginacion?.tamanioPagina ?? query.pageSize })));
  }
  listarActivos(): Observable<Cliente[]> {
    return this.listar({ page: 1, pageSize: 1000, estado: true }).pipe(map((resultado) => resultado.items));
  }
  crear(data: ClienteFormData): Observable<MessageResponse> { return this.api.registrarCliente({ body: this.request(data) }); }
  actualizar(id: number, data: ClienteFormData): Observable<MessageResponse> { return this.api.actualizarCliente({ body: this.request(data, id) }); }
  cambiarEstado(id: number, activo: boolean): Observable<MessageResponse> { return this.api.cambiarEstadoCliente({ clienteId: id, activo }); }
  private request(data: ClienteFormData, clienteId = 0): ClienteRegistroRequest { return { clienteId, tipoDocumento: data.tipoDocumento, numeroDocumento: data.numeroDocumento.trim(), razonSocial: data.razonSocial.trim().toUpperCase(), nombreComercial: data.nombreComercial.trim().toUpperCase(), contacto: data.contacto.trim(), correo: data.correo.trim().toLowerCase(), telefono: data.telefono.trim(), direccion: data.direccion.trim(), pais: data.pais.trim().toUpperCase() }; }
}
