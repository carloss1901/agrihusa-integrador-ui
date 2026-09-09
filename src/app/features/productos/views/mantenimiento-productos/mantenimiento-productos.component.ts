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
import { FiltroProductosComponent } from '../../components/filtro-productos/filtro-productos.component';
import { ModalProductoComponent } from '../../components/modal-producto/modal-producto.component';
import { TablaProductosComponent } from '../../components/tabla-productos/tabla-productos.component';
import {
  Producto,
  ProductoFilter,
  ProductoFormData,
  ProductoQuery
} from '../../models/producto.model';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-mantenimiento-productos',
  standalone: true,
  imports: [
    CommonModule,
    AgrihusaTopBarComponent,
    AgrihusaButtonComponent,
    FiltroProductosComponent,
    TablaProductosComponent
  ],
  templateUrl: './mantenimiento-productos.component.html'
})
export class MantenimientoProductosComponent implements OnInit {
  readonly titulo = 'Mantenimiento de Productos';

  productos: Producto[] = [];
  filaSeleccionada: Producto | null = null;
  loading = false;
  totalItems = 0;
  page = 1;
  pageSize = 10;

  puedeCrear = false;
  puedeEditar = false;
  puedeCambiarEstado = false;

  private filtro: ProductoFilter = {};

  constructor(
    private productoService: ProductoService,
    private authService: AuthService,
    private bitacoraService: BitacoraService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.cargarPermisos();
    this.cargarProductos();
  }

  onBuscar(
    filtro: ProductoFilter
  ): void {
    this.filtro = { ...filtro };
    this.page = 1;
    this.cargarProductos();
  }

  onLimpiarFiltro(): void {
    this.filtro = {};
    this.page = 1;
    this.cargarProductos();
  }

  onSeleccionarProducto(
    producto: Producto
  ): void {
    this.filaSeleccionada =
      this.filaSeleccionada?.id === producto.id
        ? null
        : producto;
  }

  onChangePaginate(
    event: IChangePaginate
  ): void {
    this.page = event.page;
    this.pageSize = event.pageSize;
    this.cargarProductos();
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
    const producto = this.filaSeleccionada;

    if (
      !this.puedeCambiarEstado ||
      !producto
    ) {
      return;
    }

    const accion = producto.activo
      ? 'desactivar'
      : 'activar';

    const confirmado = window.confirm(
      `¿Deseas ${accion} el producto ` +
      `"${producto.nombre}"?`
    );

    if (!confirmado) {
      return;
    }

    this.productoService
      .cambiarEstado(producto.id)
      .subscribe((resultado) => {
        if (!resultado) {
          return;
        }

        const accionBitacora = resultado.activo
          ? AccionBitacora.ACTIVAR
          : AccionBitacora.DESACTIVAR;

        this.registrarEventoProducto(
          accionBitacora,
          resultado,
          resultado.activo
            ? `Se activó el producto ${resultado.nombre}.`
            : `Se desactivó el producto ${resultado.nombre}.`
        );

        this.cargarProductos();
      });
  }

  private cargarProductos(): void {
    const query: ProductoQuery = {
      ...this.filtro,
      page: this.page,
      pageSize: this.pageSize
    };

    this.loading = true;
    this.filaSeleccionada = null;

    this.productoService
      .listar(query)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe((resultado) => {
        this.productos = resultado.items;
        this.totalItems = resultado.totalItems;
      });
  }

  private abrirModal(
    producto: Producto | null
  ): void {
    const modalRef = this.modalService.open(
      ModalProductoComponent,
      {
        backdrop: 'static',
        keyboard: false,
        size: 'lg',
        centered: true
      }
    );

    modalRef.componentInstance.titleModal = producto
      ? 'EDITAR PRODUCTO'
      : 'REGISTRAR PRODUCTO';

    modalRef.componentInstance.data = producto;

    modalRef.result
      .then(
        (resultado: ProductoFormData) => {
          if (resultado) {
            this.guardarProducto(
              resultado,
              producto
            );
          }
        }
      )
      .catch(() => {});
  }

  private guardarProducto(
    data: ProductoFormData,
    producto: Producto | null
  ): void {
    forkJoin({
      existeCodigo:
        this.productoService.existeCodigo(
          data.codigo,
          producto?.id
        ),
      existeNombre:
        this.productoService.existeNombre(
          data.nombre,
          producto?.id
        )
    })
      .pipe(
        switchMap(
          ({ existeCodigo, existeNombre }) => {
            if (existeCodigo) {
              window.alert(
                'Ya existe un producto con ese código.'
              );

              return EMPTY;
            }

            if (existeNombre) {
              window.alert(
                'Ya existe un producto con ese nombre.'
              );

              return EMPTY;
            }

            if (!producto) {
              return this.productoService.crear(data);
            }

            return this.productoService.actualizar(
              producto.id,
              data
            );
          }
        )
      )
      .subscribe((productoGuardado) => {
        if (!productoGuardado) {
          return;
        }

        if (!producto) {
          this.registrarEventoProducto(
            AccionBitacora.CREAR,
            productoGuardado,
            `Se creó el producto ` +
              `${productoGuardado.nombre}.`
          );
        } else {
          this.registrarEventoProducto(
            AccionBitacora.EDITAR,
            productoGuardado,
            `Se actualizó el producto ` +
              `${productoGuardado.nombre}.`
          );
        }

        this.page = 1;
        this.cargarProductos();
      });
  }

  private cargarPermisos(): void {
    forkJoin({
      crear: this.authService.tienePermiso(
        ModuloSistema.PRODUCTOS,
        AccionPermiso.CREAR
      ),
      editar: this.authService.tienePermiso(
        ModuloSistema.PRODUCTOS,
        AccionPermiso.EDITAR
      ),
      cambiarEstado:
        this.authService.tienePermiso(
          ModuloSistema.PRODUCTOS,
          AccionPermiso.ELIMINAR
        )
    }).subscribe((permisos) => {
      this.puedeCrear = permisos.crear;
      this.puedeEditar = permisos.editar;
      this.puedeCambiarEstado =
        permisos.cambiarEstado;
    });
  }

  private registrarEventoProducto(
    accion: AccionBitacora,
    producto: Producto,
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
      modulo: ModuloSistema.PRODUCTOS,
      accion,
      entidad: 'Producto',
      registroId: producto.id,
      detalle,
      resultado: ResultadoBitacora.EXITO
    };

    this.bitacoraService
      .registrar(evento)
      .subscribe();
  }
}