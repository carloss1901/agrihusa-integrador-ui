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
import { Cliente } from '../../../clientes/models/cliente.model';
import { ClienteService } from '../../../clientes/services/cliente.service';
import { Destino } from '../../../destinos/models/destino.model';
import { DestinoService } from '../../../destinos/services/destino.service';
import { Producto } from '../../../productos/models/producto.model';
import { ProductoService } from '../../../productos/services/producto.service';
import { Situacion } from '../../../situaciones/models/situacion.model';
import { SituacionService } from '../../../situaciones/services/situacion.service';
import { Variedad } from '../../../variedades/models/variedad.model';
import { VariedadService } from '../../../variedades/services/variedad.service';
import { FiltroDespachosComponent } from '../../components/filtro-despachos/filtro-despachos.component';
import { ModalDespachoComponent } from '../../components/modal-despacho/modal-despacho.component';
import { TablaDespachosComponent } from '../../components/tabla-despachos/tabla-despachos.component';
import {
  Despacho,
  DespachoFilter,
  DespachoFormData,
  DespachoQuery
} from '../../models/despacho.model';
import { DespachoService } from '../../services/despacho.service';

@Component({
  selector: 'app-registro-despacho',
  standalone: true,
  imports: [
    CommonModule,
    AgrihusaTopBarComponent,
    AgrihusaButtonComponent,
    FiltroDespachosComponent,
    TablaDespachosComponent
  ],
  templateUrl:
    './registro-despacho.component.html'
})
export class RegistroDespachoComponent
  implements OnInit {
  readonly titulo = 'Registro de Despacho';

  despachos: Despacho[] = [];
  clientes: Cliente[] = [];
  destinos: Destino[] = [];
  productos: Producto[] = [];
  variedades: Variedad[] = [];
  situaciones: Situacion[] = [];

  filaSeleccionada: Despacho | null = null;
  loading = false;
  totalItems = 0;
  page = 1;
  pageSize = 10;

  puedeCrear = false;
  puedeEditar = false;
  puedeCambiarEstado = false;

  private filtro: DespachoFilter = {};

  constructor(
    private despachoService: DespachoService,
    private clienteService: ClienteService,
    private destinoService: DestinoService,
    private productoService: ProductoService,
    private variedadService: VariedadService,
    private situacionService: SituacionService,
    private authService: AuthService,
    private bitacoraService: BitacoraService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.cargarPermisos();
    this.cargarCatalogosTabla();
    this.cargarDespachos();
  }

  onBuscar(
    filtro: DespachoFilter
  ): void {
    this.filtro = { ...filtro };
    this.page = 1;
    this.cargarDespachos();
  }

  onLimpiarFiltro(): void {
    this.filtro = {};
    this.page = 1;
    this.cargarDespachos();
  }

  onSeleccionarDespacho(
    despacho: Despacho
  ): void {
    this.filaSeleccionada =
      this.filaSeleccionada?.id === despacho.id
        ? null
        : despacho;
  }

  onChangePaginate(
    event: IChangePaginate
  ): void {
    this.page = event.page;
    this.pageSize = event.pageSize;
    this.cargarDespachos();
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
    const despacho = this.filaSeleccionada;

    if (
      !this.puedeCambiarEstado ||
      !despacho
    ) {
      return;
    }

    const accion = despacho.activo
      ? 'desactivar'
      : 'activar';

    const confirmado = window.confirm(
      `¿Deseas ${accion} el despacho ` +
      `"${despacho.codigo}"?`
    );

    if (!confirmado) {
      return;
    }

    this.despachoService
      .cambiarEstado(despacho.id)
      .subscribe((resultado) => {
        if (!resultado) {
          return;
        }

        const accionBitacora = resultado.activo
          ? AccionBitacora.ACTIVAR
          : AccionBitacora.DESACTIVAR;

        this.registrarEventoDespacho(
          accionBitacora,
          resultado,
          resultado.activo
            ? `Se activó el despacho ${resultado.codigo}.`
            : `Se desactivó el despacho ${resultado.codigo}.`
        );

        this.cargarDespachos();
      });
  }

  private cargarCatalogosTabla(): void {
    const consultaCatalogo = {
      page: 1,
      pageSize: 1000
    };

    forkJoin({
      clientes:
        this.clienteService.listar(consultaCatalogo),
      destinos:
        this.destinoService.listar(consultaCatalogo),
      productos:
        this.productoService.listar(consultaCatalogo),
      variedades:
        this.variedadService.listar(consultaCatalogo),
      situaciones:
        this.situacionService.listar(consultaCatalogo)
    }).subscribe((catalogos) => {
      this.clientes = catalogos.clientes.items;
      this.destinos = catalogos.destinos.items;
      this.productos = catalogos.productos.items;
      this.variedades = catalogos.variedades.items;
      this.situaciones = catalogos.situaciones.items;
    });
  }

  private cargarDespachos(): void {
    const query: DespachoQuery = {
      ...this.filtro,
      page: this.page,
      pageSize: this.pageSize
    };

    this.loading = true;
    this.filaSeleccionada = null;

    this.despachoService
      .listar(query)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe((resultado) => {
        this.despachos = resultado.items;
        this.totalItems = resultado.totalItems;
      });
  }

  private abrirModal(
    despacho: Despacho | null
  ): void {
    const modalRef = this.modalService.open(
      ModalDespachoComponent,
      {
        backdrop: 'static',
        keyboard: false,
        size: 'xl',
        centered: true
      }
    );

    modalRef.componentInstance.titleModal = despacho
      ? `EDITAR DESPACHO ${despacho.codigo}`
      : 'REGISTRAR DESPACHO';

    modalRef.componentInstance.data = despacho;

    modalRef.result
      .then(
        (resultado: DespachoFormData) => {
          if (resultado) {
            this.guardarDespacho(
              resultado,
              despacho
            );
          }
        }
      )
      .catch(() => {});
  }

  private guardarDespacho(
    data: DespachoFormData,
    despacho: Despacho | null
  ): void {
    this.despachoService
      .relacionProductoVariedadValida(
        data.productoId,
        data.variedadId
      )
      .pipe(
        switchMap((relacionValida) => {
          if (!relacionValida) {
            window.alert(
              'La variedad seleccionada no pertenece ' +
              'al producto indicado.'
            );

            return EMPTY;
          }

          if (!despacho) {
            return this.despachoService.crear(data);
          }

          return this.despachoService.actualizar(
            despacho.id,
            data
          );
        })
      )
      .subscribe((despachoGuardado) => {
        if (!despachoGuardado) {
          return;
        }

        if (!despacho) {
          this.registrarEventoDespacho(
            AccionBitacora.CREAR,
            despachoGuardado,
            `Se creó el despacho ` +
              `${despachoGuardado.codigo}.`
          );
        } else {
          this.registrarEventoDespacho(
            AccionBitacora.EDITAR,
            despachoGuardado,
            `Se actualizó el despacho ` +
              `${despachoGuardado.codigo}.`
          );
        }

        this.page = 1;
        this.cargarDespachos();
      });
  }

  private cargarPermisos(): void {
    forkJoin({
      crear: this.authService.tienePermiso(
        ModuloSistema.REGISTRO_DESPACHO,
        AccionPermiso.CREAR
      ),
      editar: this.authService.tienePermiso(
        ModuloSistema.REGISTRO_DESPACHO,
        AccionPermiso.EDITAR
      ),
      cambiarEstado:
        this.authService.tienePermiso(
          ModuloSistema.REGISTRO_DESPACHO,
          AccionPermiso.ELIMINAR
        )
    }).subscribe((permisos) => {
      this.puedeCrear = permisos.crear;
      this.puedeEditar = permisos.editar;
      this.puedeCambiarEstado =
        permisos.cambiarEstado;
    });
  }

  private registrarEventoDespacho(
    accion: AccionBitacora,
    despacho: Despacho,
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
      modulo: ModuloSistema.REGISTRO_DESPACHO,
      accion,
      entidad: 'Despacho',
      registroId: despacho.id,
      detalle,
      resultado: ResultadoBitacora.EXITO
    };

    this.bitacoraService
      .registrar(evento)
      .subscribe();
  }
}