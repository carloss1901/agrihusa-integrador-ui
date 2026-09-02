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
import { FiltroMantNavierasComponent } from '../../components/filtro-mant-navieras/filtro-mant-navieras.component';
import { ModalUpsertNavieraComponent } from '../../components/modal-upsert-naviera/modal-upsert-naviera.component';
import { TablaMantNavierasComponent } from '../../components/tabla-mant-navieras/tabla-mant-navieras.component';
import {
  Naviera,
  NavieraFilter,
  NavieraFormData,
  NavieraQuery
} from '../../models/naviera.model';
import { NavieraService } from '../../services/naviera.service';

@Component({
  selector: 'app-mantenimiento-navieras',
  standalone: true,
  imports: [
    CommonModule,
    AgrihusaTopBarComponent,
    AgrihusaButtonComponent,
    FiltroMantNavierasComponent,
    TablaMantNavierasComponent
  ],
  templateUrl:
    './mantenimiento-navieras.component.html'
})
export class MantenimientoNavierasComponent
  implements OnInit {
  readonly titulo = 'Mantenimiento de Navieras';

  navieras: Naviera[] = [];
  filaSeleccionada: Naviera | null = null;
  loading = false;
  totalItems = 0;
  page = 1;
  pageSize = 10;

  puedeCrear = false;
  puedeEditar = false;
  puedeCambiarEstado = false;

  private filtro: NavieraFilter = {};

  constructor(
    private navieraService: NavieraService,
    private authService: AuthService,
    private bitacoraService: BitacoraService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.cargarPermisos();
    this.cargarNavieras();
  }

  onBuscar(filtro: NavieraFilter): void {
    this.filtro = { ...filtro };
    this.page = 1;
    this.cargarNavieras();
  }

  onLimpiarFiltro(): void {
    this.filtro = {};
    this.page = 1;
    this.cargarNavieras();
  }

  onSeleccionarNaviera(
    naviera: Naviera
  ): void {
    this.filaSeleccionada =
      this.filaSeleccionada?.id === naviera.id
        ? null
        : naviera;
  }

  onChangePaginate(
    event: IChangePaginate
  ): void {
    this.page = event.page;
    this.pageSize = event.pageSize;
    this.cargarNavieras();
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
    const naviera = this.filaSeleccionada;

    if (
      !this.puedeCambiarEstado ||
      !naviera
    ) {
      return;
    }

    const accion = naviera.activo
      ? 'desactivar'
      : 'activar';

    const confirmado = window.confirm(
      `¿Deseas ${accion} la naviera ` +
      `"${naviera.nombre}"?`
    );

    if (!confirmado) {
      return;
    }

    this.navieraService
      .cambiarEstado(naviera.id)
      .subscribe((resultado) => {
        if (!resultado) {
          return;
        }

        const accionBitacora = resultado.activo
          ? AccionBitacora.ACTIVAR
          : AccionBitacora.DESACTIVAR;

        this.registrarEventoNaviera(
          accionBitacora,
          resultado,
          resultado.activo
            ? `Se activó la naviera ${resultado.nombre}.`
            : `Se desactivó la naviera ${resultado.nombre}.`
        );

        this.cargarNavieras();
      });
  }

  private cargarNavieras(): void {
    const query: NavieraQuery = {
      ...this.filtro,
      page: this.page,
      pageSize: this.pageSize
    };

    this.loading = true;
    this.filaSeleccionada = null;

    this.navieraService
      .listar(query)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe((resultado) => {
        this.navieras = resultado.items;
        this.totalItems = resultado.totalItems;
      });
  }

  private abrirModal(
    naviera: Naviera | null
  ): void {
    const modalRef = this.modalService.open(
      ModalUpsertNavieraComponent,
      {
        backdrop: 'static',
        keyboard: false,
        size: 'lg',
        centered: true,
        scrollable: true
      }
    );

    modalRef.componentInstance.titleModal = naviera
      ? 'EDITAR NAVIERA'
      : 'REGISTRAR NAVIERA';

    modalRef.componentInstance.data = naviera;

    modalRef.result
      .then((resultado: NavieraFormData) => {
        if (resultado) {
          this.guardarNaviera(
            resultado,
            naviera
          );
        }
      })
      .catch(() => { });
  }

  private guardarNaviera(
    data: NavieraFormData,
    naviera: Naviera | null
  ): void {
    forkJoin({
      existeCodigo:
        this.navieraService.existeCodigo(
          data.codigo,
          naviera?.id
        ),
      existeNombre:
        this.navieraService.existeNombre(
          data.nombre,
          naviera?.id
        )
    })
      .pipe(
        switchMap(
          ({ existeCodigo, existeNombre }) => {
            if (existeCodigo) {
              window.alert(
                'Ya existe una naviera con ese código.'
              );

              return EMPTY;
            }

            if (existeNombre) {
              window.alert(
                'Ya existe una naviera con ese nombre.'
              );

              return EMPTY;
            }

            if (!naviera) {
              return this.navieraService.crear(data);
            }

            return this.navieraService.actualizar(
              naviera.id,
              data
            );
          }
        )
      )
      .subscribe((navieraGuardada) => {
        if (!navieraGuardada) {
          return;
        }

        if (!naviera) {
          this.registrarEventoNaviera(
            AccionBitacora.CREAR,
            navieraGuardada,
            `Se creó la naviera ` +
            `${navieraGuardada.nombre}.`
          );
        } else {
          this.registrarEventoNaviera(
            AccionBitacora.EDITAR,
            navieraGuardada,
            `Se actualizó la naviera ` +
            `${navieraGuardada.nombre}.`
          );
        }

        this.page = 1;
        this.cargarNavieras();
      });
  }

  private cargarPermisos(): void {
    forkJoin({
      crear: this.authService.tienePermiso(
        ModuloSistema.NAVIERAS,
        AccionPermiso.CREAR
      ),
      editar: this.authService.tienePermiso(
        ModuloSistema.NAVIERAS,
        AccionPermiso.EDITAR
      ),
      cambiarEstado:
        this.authService.tienePermiso(
          ModuloSistema.NAVIERAS,
          AccionPermiso.ELIMINAR
        )
    }).subscribe((permisos) => {
      this.puedeCrear = permisos.crear;
      this.puedeEditar = permisos.editar;
      this.puedeCambiarEstado =
        permisos.cambiarEstado;
    });
  }

  private registrarEventoNaviera(
    accion: AccionBitacora,
    naviera: Naviera,
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
      modulo: ModuloSistema.NAVIERAS,
      accion,
      entidad: 'Naviera',
      registroId: naviera.id,
      detalle,
      resultado: ResultadoBitacora.EXITO
    };

    this.bitacoraService
      .registrar(evento)
      .subscribe();
  }
}