import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  EMPTY,
  finalize,
  forkJoin,
  switchMap
} from 'rxjs';

import {
  AccionPermiso,
  ModuloSistema
} from '../../../../core/models/permiso.model';
import { AuthService } from '../../../../core/services/auth.service';
import { AgrihusaButtonComponent } from '../../../../shared/components/agrihusa-button/agrihusa-button.component';
import {
  IChangePaginate
} from '../../../../shared/components/agrihusa-table-footer/agrihusa-table-footer.component';
import { AgrihusaTopBarComponent } from '../../../../shared/components/agrihusa-topbar/agrihusa-topbar.component';
import {
  AccionBitacora,
  RegistroBitacoraCrearData,
  ResultadoBitacora
} from '../../../auditoria/models/bitacora.model';
import { BitacoraService } from '../../../auditoria/services/bitacora.service';
import { FiltroClientesComponent } from '../../components/filtro-clientes/filtro-clientes.component';
import { ModalClienteComponent } from '../../components/modal-cliente/modal-cliente.component';
import { TablaClientesComponent } from '../../components/tabla-clientes/tabla-clientes.component';
import {
  Cliente,
  ClienteFilter,
  ClienteFormData,
  ClienteQuery
} from '../../models/cliente.model';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-mantenimiento-clientes',
  standalone: true,
  imports: [
    CommonModule,
    AgrihusaTopBarComponent,
    AgrihusaButtonComponent,
    FiltroClientesComponent,
    TablaClientesComponent
  ],
  templateUrl:
    './mantenimiento-clientes.component.html'
})
export class MantenimientoClientesComponent
  implements OnInit {
  readonly titulo = 'Mantenimiento de Clientes';

  clientes: Cliente[] = [];
  filaSeleccionada: Cliente | null = null;
  loading = false;
  totalItems = 0;
  page = 1;
  pageSize = 10;

  puedeCrear = false;
  puedeEditar = false;
  puedeCambiarEstado = false;

  private filtro: ClienteFilter = {};

  constructor(
    private clienteService: ClienteService,
    private authService: AuthService,
    private bitacoraService: BitacoraService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.cargarPermisos();
    this.cargarClientes();
  }

  onBuscar(filtro: ClienteFilter): void {
    this.filtro = { ...filtro };
    this.page = 1;
    this.cargarClientes();
  }

  onLimpiarFiltro(): void {
    this.filtro = {};
    this.page = 1;
    this.cargarClientes();
  }

  onSeleccionarCliente(
    cliente: Cliente
  ): void {
    this.filaSeleccionada =
      this.filaSeleccionada?.id === cliente.id
        ? null
        : cliente;
  }

  onChangePaginate(
    event: IChangePaginate
  ): void {
    this.page = event.page;
    this.pageSize = event.pageSize;
    this.cargarClientes();
  }

  mostrarModalCrear(): void {
    if (!this.puedeCrear) {
      return;
    }

    this.abrirModal(null);
  }

  mostrarModalEditar(): void {
    if (
      !this.puedeEditar ||
      !this.filaSeleccionada ||
      !this.filaSeleccionada.activo
    ) {
      return;
    }

    this.abrirModal(this.filaSeleccionada);
  }

  cambiarEstado(): void {
    const cliente = this.filaSeleccionada;

    if (
      !this.puedeCambiarEstado ||
      !cliente
    ) {
      return;
    }

    const accion = cliente.activo
      ? 'desactivar'
      : 'activar';

    const confirmado = window.confirm(
      `¿Deseas ${accion} al cliente ` +
      `"${cliente.razonSocial}"?`
    );

    if (!confirmado) {
      return;
    }

    this.clienteService
      .cambiarEstado(cliente.id)
      .subscribe((resultado) => {
        if (!resultado) {
          return;
        }

        const accionBitacora = resultado.activo
          ? AccionBitacora.ACTIVAR
          : AccionBitacora.DESACTIVAR;

        this.registrarEventoCliente(
          accionBitacora,
          resultado,
          resultado.activo
            ? `Se activó al cliente ${resultado.razonSocial}.`
            : `Se desactivó al cliente ${resultado.razonSocial}.`
        );

        this.cargarClientes();
      });
  }

  private cargarClientes(): void {
    const query: ClienteQuery = {
      ...this.filtro,
      page: this.page,
      pageSize: this.pageSize
    };

    this.loading = true;
    this.filaSeleccionada = null;

    this.clienteService
      .listar(query)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe((resultado) => {
        this.clientes = resultado.items;
        this.totalItems = resultado.totalItems;
      });
  }

  private abrirModal(
    cliente: Cliente | null
  ): void {
    const modalRef = this.modalService.open(
      ModalClienteComponent,
      {
        backdrop: 'static',
        keyboard: false,
        size: 'xl',
        centered: true,
        scrollable: true
      }
    );

    modalRef.componentInstance.titleModal = cliente
      ? 'EDITAR CLIENTE'
      : 'REGISTRAR CLIENTE';

    modalRef.componentInstance.data = cliente;

    modalRef.result
      .then((resultado: ClienteFormData) => {
        if (resultado) {
          this.guardarCliente(
            resultado,
            cliente
          );
        }
      })
      .catch(() => {});
  }

  private guardarCliente(
    data: ClienteFormData,
    cliente: Cliente | null
  ): void {
    forkJoin({
      existeDocumento:
        this.clienteService.existeDocumento(
          data.tipoDocumento,
          data.numeroDocumento,
          cliente?.id
        ),
      existeRazonSocial:
        this.clienteService.existeRazonSocial(
          data.razonSocial,
          cliente?.id
        )
    })
      .pipe(
        switchMap(
          ({
            existeDocumento,
            existeRazonSocial
          }) => {
            if (existeDocumento) {
              window.alert(
                'Ya existe un cliente con ese documento.'
              );

              return EMPTY;
            }

            if (existeRazonSocial) {
              window.alert(
                'Ya existe un cliente con esa razón social.'
              );

              return EMPTY;
            }

            if (!cliente) {
              return this.clienteService.crear(data);
            }

            return this.clienteService.actualizar(
              cliente.id,
              data
            );
          }
        )
      )
      .subscribe((clienteGuardado) => {
        if (!clienteGuardado) {
          return;
        }

        if (!cliente) {
          this.registrarEventoCliente(
            AccionBitacora.CREAR,
            clienteGuardado,
            `Se creó al cliente ` +
              `${clienteGuardado.razonSocial}.`
          );
        } else {
          this.registrarEventoCliente(
            AccionBitacora.EDITAR,
            clienteGuardado,
            `Se actualizó al cliente ` +
              `${clienteGuardado.razonSocial}.`
          );
        }

        this.page = 1;
        this.cargarClientes();
      });
  }

  private cargarPermisos(): void {
    forkJoin({
      crear: this.authService.tienePermiso(
        ModuloSistema.CLIENTES,
        AccionPermiso.CREAR
      ),
      editar: this.authService.tienePermiso(
        ModuloSistema.CLIENTES,
        AccionPermiso.EDITAR
      ),
      cambiarEstado:
        this.authService.tienePermiso(
          ModuloSistema.CLIENTES,
          AccionPermiso.ELIMINAR
        )
    }).subscribe((permisos) => {
      this.puedeCrear = permisos.crear;
      this.puedeEditar = permisos.editar;
      this.puedeCambiarEstado =
        permisos.cambiarEstado;
    });
  }

  private registrarEventoCliente(
    accion: AccionBitacora,
    cliente: Cliente,
    detalle: string
  ): void {
    const sesion =
      this.authService.obtenerSesionActual();

    if (!sesion) {
      return;
    }

    const evento: RegistroBitacoraCrearData = {
      usuarioId: sesion.usuarioId,
      nombreUsuario: sesion.nombreUsuario,
      modulo: ModuloSistema.CLIENTES,
      accion,
      entidad: 'Cliente',
      registroId: cliente.id,
      detalle,
      resultado: ResultadoBitacora.EXITO
    };

    this.bitacoraService
      .registrar(evento)
      .subscribe();
  }
}