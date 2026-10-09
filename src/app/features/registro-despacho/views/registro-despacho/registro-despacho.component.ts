import { CommonModule } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  finalize,
  forkJoin
} from 'rxjs';

import {
  AccionPermiso,
  ModuloSistema
} from '../../../../core/models/permiso.model';
import { AuthService } from '../../../../core/services/auth.service';
import { TokenService } from '../../../../core/services/token.service';
import { AgrihusaButtonComponent } from '../../../../shared/components/agrihusa-button/agrihusa-button.component';
import {
  IChangePaginate
} from '../../../../shared/components/agrihusa-table-footer/agrihusa-table-footer.component';
import { AgrihusaTopBarComponent } from '../../../../shared/components/agrihusa-topbar/agrihusa-topbar.component';
import {
  AccionBitacora,
  RegistroBitacoraCrearData,
  ResultadoBitacora
} from '../../../../core/models/bitacora.model';
import { BitacoraService } from '../../../../core/services/bitacora.service';
import { Cliente } from '../../../../core/models/cliente.model';
import { ClienteService } from '../../../../core/services/cliente.service';
import { Destino } from '../../../../core/models/destino.model';
import { DestinoService } from '../../../../core/services/destino.service';
import { Naviera } from '../../../../core/models/naviera.model';
import { OperadorLogistico } from '../../../../core/models/operador-logistico.model';
import { PuertoLlegada } from '../../../../core/models/puerto-llegada.model';
import { Via } from '../../../../core/models/via.model';
import { Producto } from '../../../../core/models/producto.model';
import { ProductoService } from '../../../../core/services/producto.service';
import { Situacion } from '../../../../core/models/situacion.model';
import { SituacionService } from '../../../../core/services/situacion.service';
import { Variedad } from '../../../../core/models/variedad.model';
import { VariedadService } from '../../../../core/services/variedad.service';
import { FiltroDespachosComponent } from '../../components/filtro-despachos/filtro-despachos.component';
import { ModalDespachoComponent } from '../../components/modal-despacho/modal-despacho.component';
import { TablaDespachosComponent } from '../../components/tabla-despachos/tabla-despachos.component';
import {
  Despacho,
  DespachoFilter,
  DespachoQuery
} from '../../../../core/models/despacho.model';
import { DespachoService } from '../../../../core/services/despacho.service';
import { ComunControllerService } from '../../../../api/api/services/comun-controller.service';

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
  implements OnInit, OnDestroy {
  readonly titulo = 'Registro de Despacho';

  despachos: Despacho[] = [];
  clientes: Cliente[] = [];
  destinos: Destino[] = [];
  productos: Producto[] = [];
  variedades: Variedad[] = [];
  situaciones: Situacion[] = [];
  navieras: Naviera[] = [];
  operadores: OperadorLogistico[] = [];
  puertos: PuertoLlegada[] = [];
  vias: Via[] = [];

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
    private tokenService: TokenService,
    private bitacoraService: BitacoraService,
    private comunService: ComunControllerService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.cargarPermisos();
    this.cargarCatalogosTabla();
    this.cargarDespachos();
  }

  ngOnDestroy(): void {
    this.clientes = [];
    this.productos = [];
    this.situaciones = [];
    this.navieras = [];
    this.operadores = [];
    this.puertos = [];
    this.vias = [];
    this.variedades = [];
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
      `Â¿Deseas ${accion} el despacho ` +
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
            ? `Se activÃ³ el despacho ${resultado.codigo}.`
            : `Se desactivÃ³ el despacho ${resultado.codigo}.`
        );

        this.cargarDespachos();
      });
  }

  private cargarCatalogosTabla(): void {
    forkJoin({
      clientes: this.comunService.listarClientesActivos(),
      destinos: this.comunService.listarDestinosActivos(),
      productos: this.comunService.listarProductosActivos(),
      situaciones: this.comunService.listarSituacionesActivas(),
      navieras: this.comunService.listarNavierasActivas(),
      operadores: this.comunService.listarOperadoresLogisticosActivos(),
      puertos: this.comunService.listarPuertosLlegadaActivos(),
      vias: this.comunService.listarViasActivos(),
      variedades: this.comunService.listarVariedadesActivas()
    }).subscribe((catalogos) => {
      this.clientes = catalogos.clientes.map((item) => ({ id: item.id ?? 0, tipoDocumento: 'OTRO' as any, numeroDocumento: '', razonSocial: item.descripcion ?? '', nombreComercial: item.descripcion ?? '', contacto: '', correo: '', telefono: '', direccion: '', pais: '', activo: true, fechaCreacion: '', fechaActualizacion: null }));
      this.productos = catalogos.productos.map((item) => ({ id: item.id ?? 0, codigo: '', nombre: item.descripcion ?? '', descripcion: item.descripcion ?? '', activo: true, fechaCreacion: '', fechaActualizacion: null }));
      this.destinos = catalogos.destinos.map((item) => ({ id: item.id ?? 0, pais: '', ciudad: item.descripcion ?? '', activo: true, fechaCreacion: '', fechaActualizacion: null }));
      this.situaciones = catalogos.situaciones.map((item) => ({ id: item.id ?? 0, descripcion: item.descripcion ?? '', activo: true, fechaCreacion: '', fechaActualizacion: null }));
      this.navieras = catalogos.navieras.map((item) => ({ id: item.id ?? 0, codigo: '', nombre: item.descripcion ?? '', pais: '', contacto: '', correo: '', telefono: '', sitioWeb: '', activo: true, fechaCreacion: '', fechaActualizacion: null }));
      this.operadores = catalogos.operadores.map((item) => ({ id: item.id ?? 0, ruc: '', razonSocial: item.descripcion ?? '', nombreComercial: item.descripcion ?? '', contacto: '', correo: '', telefono: '', direccion: '', activo: true, fechaCreacion: '', fechaActualizacion: null }));
      this.puertos = catalogos.puertos.map((item) => ({ id: item.id ?? 0, codigo: '', puerto: item.descripcion ?? '', pais: '', activo: true, fechaCreacion: '', fechaActualizacion: null }));
      this.vias = catalogos.vias.map((item) => ({ id: item.id ?? 0, descripcion: item.descripcion ?? '', activo: true, fechaCreacion: '', fechaActualizacion: null }));
      this.variedades = catalogos.variedades.map((item) => ({ id: item.id ?? 0, productoId: item.value2 ?? 0, nombre: item.descripcion ?? '', activo: true, fechaCreacion: '', fechaActualizacion: null }));
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
    modalRef.componentInstance.clientes = this.clientes;
    modalRef.componentInstance.productos = this.productos;
    modalRef.componentInstance.situaciones = this.situaciones;
    modalRef.componentInstance.navieras = this.navieras;
    modalRef.componentInstance.destinos = this.destinos;
    modalRef.componentInstance.operadores = this.operadores;
    modalRef.componentInstance.puertos = this.puertos;
    modalRef.componentInstance.vias = this.vias;
    modalRef.componentInstance.catalogoVariedades = this.variedades;

    modalRef.result
      .then(
        (resultado: boolean) => {
          if (resultado) {
            this.page = 1;
            this.cargarDespachos();
          }
        }
      )
      .catch(() => {});
  }

  private cargarPermisos(): void {
    this.puedeCrear = this.tokenService.tienePermiso(
      ModuloSistema.REGISTRO_DESPACHO,
      AccionPermiso.CREAR
    );
    this.puedeEditar = this.tokenService.tienePermiso(
      ModuloSistema.REGISTRO_DESPACHO,
      AccionPermiso.EDITAR
    );
    this.puedeCambiarEstado = this.tokenService.tienePermiso(
      ModuloSistema.REGISTRO_DESPACHO,
      AccionPermiso.ELIMINAR
    );
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

