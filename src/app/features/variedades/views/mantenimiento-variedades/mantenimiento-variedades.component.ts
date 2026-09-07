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
import { Producto } from '../../../productos/models/producto.model';
import { ProductoService } from '../../../productos/services/producto.service';
import { FiltroMantVariedadesComponent } from '../../components/filtro-mant-variedades/filtro-mant-variedades.component';
import { ModalUpsertVariedadComponent } from '../../components/modal-upsert-variedad/modal-upsert-variedad.component';
import { TablaMantVariedadesComponent } from '../../components/tabla-mant-variedades/tabla-mant-variedades.component';
import {
  Variedad,
  VariedadFilter,
  VariedadFormData,
  VariedadQuery
} from '../../models/variedad.model';
import { VariedadService } from '../../services/variedad.service';

@Component({
  selector: 'app-mantenimiento-variedades',
  standalone: true,
  imports: [
    CommonModule,
    AgrihusaTopBarComponent,
    AgrihusaButtonComponent,
    FiltroMantVariedadesComponent,
    TablaMantVariedadesComponent
  ],
  templateUrl:
    './mantenimiento-variedades.component.html'
})
export class MantenimientoVariedadesComponent
  implements OnInit {
  readonly titulo = 'Mantenimiento de Variedades';

  variedades: Variedad[] = [];
  productos: Producto[] = [];
  filaSeleccionada: Variedad | null = null;
  loading = false;
  totalItems = 0;
  page = 1;
  pageSize = 10;

  puedeCrear = false;
  puedeEditar = false;
  puedeCambiarEstado = false;

  private filtro: VariedadFilter = {};

  constructor(
    private variedadService: VariedadService,
    private productoService: ProductoService,
    private authService: AuthService,
    private bitacoraService: BitacoraService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.cargarPermisos();
    this.cargarProductos();
    this.cargarVariedades();
  }

  onBuscar(
    filtro: VariedadFilter
  ): void {
    this.filtro = { ...filtro };
    this.page = 1;
    this.cargarVariedades();
  }

  onLimpiarFiltro(): void {
    this.filtro = {};
    this.page = 1;
    this.cargarVariedades();
  }

  onSeleccionarVariedad(
    variedad: Variedad
  ): void {
    this.filaSeleccionada =
      this.filaSeleccionada?.id === variedad.id
        ? null
        : variedad;
  }

  onChangePaginate(
    event: IChangePaginate
  ): void {
    this.page = event.page;
    this.pageSize = event.pageSize;
    this.cargarVariedades();
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
    const variedad = this.filaSeleccionada;

    if (
      !this.puedeCambiarEstado ||
      !variedad
    ) {
      return;
    }

    const producto = this.productos.find(
      (item) => item.id === variedad.productoId
    );

    if (
      !variedad.activo &&
      producto &&
      !producto.activo
    ) {
      window.alert(
        'No se puede activar la variedad porque ' +
        'su producto se encuentra inactivo.'
      );

      return;
    }

    const accion = variedad.activo
      ? 'desactivar'
      : 'activar';

    const confirmado = window.confirm(
      `¿Deseas ${accion} la variedad ` +
      `"${variedad.nombre}"?`
    );

    if (!confirmado) {
      return;
    }

    this.variedadService
      .cambiarEstado(variedad.id)
      .subscribe((resultado) => {
        if (!resultado) {
          return;
        }

        const accionBitacora = resultado.activo
          ? AccionBitacora.ACTIVAR
          : AccionBitacora.DESACTIVAR;

        this.registrarEventoVariedad(
          accionBitacora,
          resultado,
          resultado.activo
            ? `Se activó la variedad ${resultado.nombre}.`
            : `Se desactivó la variedad ${resultado.nombre}.`
        );

        this.cargarVariedades();
      });
  }

  private cargarProductos(): void {
    this.productoService
      .listar({
        page: 1,
        pageSize: 1000
      })
      .subscribe((resultado) => {
        this.productos = resultado.items;
      });
  }

  private cargarVariedades(): void {
    const query: VariedadQuery = {
      ...this.filtro,
      page: this.page,
      pageSize: this.pageSize
    };

    this.loading = true;
    this.filaSeleccionada = null;

    this.variedadService
      .listar(query)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe((resultado) => {
        this.variedades = resultado.items;
        this.totalItems = resultado.totalItems;
      });
  }

  private abrirModal(
    variedad: Variedad | null
  ): void {
    const modalRef = this.modalService.open(
      ModalUpsertVariedadComponent,
      {
        backdrop: 'static',
        keyboard: false,
        size: 'lg',
        centered: true
      }
    );

    modalRef.componentInstance.titleModal = variedad
      ? 'EDITAR VARIEDAD'
      : 'REGISTRAR VARIEDAD';

    modalRef.componentInstance.data = variedad;

    modalRef.result
      .then(
        (resultado: VariedadFormData) => {
          if (resultado) {
            this.guardarVariedad(
              resultado,
              variedad
            );
          }
        }
      )
      .catch(() => {});
  }

  private guardarVariedad(
    data: VariedadFormData,
    variedad: Variedad | null
  ): void {
    const producto = this.productos.find(
      (item) => item.id === data.productoId
    );

    if (!producto) {
      window.alert(
        'El producto seleccionado no existe.'
      );

      return;
    }

    this.variedadService
      .existeNombre(
        data.productoId,
        data.nombre,
        variedad?.id
      )
      .pipe(
        switchMap((existeNombre) => {
          if (existeNombre) {
            window.alert(
              'Ya existe esa variedad para el ' +
              'producto seleccionado.'
            );

            return EMPTY;
          }

          if (!variedad) {
            return this.variedadService.crear(data);
          }

          return this.variedadService.actualizar(
            variedad.id,
            data
          );
        })
      )
      .subscribe((variedadGuardada) => {
        if (!variedadGuardada) {
          return;
        }

        const nombreProducto =
          this.obtenerNombreProducto(
            variedadGuardada.productoId
          );

        if (!variedad) {
          this.registrarEventoVariedad(
            AccionBitacora.CREAR,
            variedadGuardada,
            `Se creó la variedad ` +
              `${variedadGuardada.nombre} para ` +
              `el producto ${nombreProducto}.`
          );
        } else {
          this.registrarEventoVariedad(
            AccionBitacora.EDITAR,
            variedadGuardada,
            `Se actualizó la variedad ` +
              `${variedadGuardada.nombre} para ` +
              `el producto ${nombreProducto}.`
          );
        }

        this.page = 1;
        this.cargarVariedades();
      });
  }

  private cargarPermisos(): void {
    forkJoin({
      crear: this.authService.tienePermiso(
        ModuloSistema.VARIEDADES,
        AccionPermiso.CREAR
      ),
      editar: this.authService.tienePermiso(
        ModuloSistema.VARIEDADES,
        AccionPermiso.EDITAR
      ),
      cambiarEstado:
        this.authService.tienePermiso(
          ModuloSistema.VARIEDADES,
          AccionPermiso.ELIMINAR
        )
    }).subscribe((permisos) => {
      this.puedeCrear = permisos.crear;
      this.puedeEditar = permisos.editar;
      this.puedeCambiarEstado =
        permisos.cambiarEstado;
    });
  }

  private obtenerNombreProducto(
    productoId: number
  ): string {
    return (
      this.productos.find(
        (producto) => producto.id === productoId
      )?.nombre ?? 'PRODUCTO NO DISPONIBLE'
    );
  }

  private registrarEventoVariedad(
    accion: AccionBitacora,
    variedad: Variedad,
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
      modulo: ModuloSistema.VARIEDADES,
      accion,
      entidad: 'Variedad',
      registroId: variedad.id,
      detalle,
      resultado: ResultadoBitacora.EXITO
    };

    this.bitacoraService
      .registrar(evento)
      .subscribe();
  }
}