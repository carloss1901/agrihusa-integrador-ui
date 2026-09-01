import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  EMPTY,
  finalize,
  switchMap
} from 'rxjs';

import {
  IChangePaginate
} from '../../../../shared/components/agrihusa-table-footer/agrihusa-table-footer.component';
import { AgrihusaButtonComponent } from '../../../../shared/components/agrihusa-button/agrihusa-button.component';
import { AgrihusaTopBarComponent } from '../../../../shared/components/agrihusa-topbar/agrihusa-topbar.component';
import { FiltroRolesComponent } from '../../components/filtro-roles/filtro-roles.component';
import { ModalRolComponent } from '../../components/modal-rol/modal-rol.component';
import { TablaRolesComponent } from '../../components/tabla-roles/tabla-roles.component';
import {
  Rol,
  RolFilter,
  RolFormData,
  RolQuery
} from '../../models/rol.model';
import { RolService } from '../../services/rol.service';
import { ModuloSistema } from '../../../../core/models/permiso.model';
import { AuthService } from '../../../../core/services/auth.service';
import {
  AccionBitacora,
  RegistroBitacoraCrearData,
  ResultadoBitacora
} from '../../../auditoria/models/bitacora.model';
import { BitacoraService } from '../../../auditoria/services/bitacora.service';

@Component({
  selector: 'app-mantenimiento-roles',
  standalone: true,
  imports: [
    CommonModule,
    AgrihusaTopBarComponent,
    AgrihusaButtonComponent,
    FiltroRolesComponent,
    TablaRolesComponent
  ],
  templateUrl: './mantenimiento-roles.component.html'
})
export class MantenimientoRolesComponent
  implements OnInit {
  readonly titulo = 'Mantenimiento de Roles';

  roles: Rol[] = [];
  filaSeleccionada: Rol | null = null;
  loading = false;
  totalItems = 0;
  page = 1;
  pageSize = 10;

  private filtro: RolFilter = {};

  constructor(
    private rolService: RolService,
    private authService: AuthService,
    private bitacoraService: BitacoraService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.cargarRoles();
  }

  onBuscar(filtro: RolFilter): void {
    this.filtro = { ...filtro };
    this.page = 1;
    this.cargarRoles();
  }

  onLimpiarFiltro(): void {
    this.filtro = {};
    this.page = 1;
    this.cargarRoles();
  }

  onSeleccionarRol(rol: Rol): void {
    this.filaSeleccionada =
      this.filaSeleccionada?.id === rol.id
        ? null
        : rol;
  }

  onChangePaginate(
    event: IChangePaginate
  ): void {
    this.page = event.page;
    this.pageSize = event.pageSize;
    this.cargarRoles();
  }

  mostrarModalCrear(): void {
    this.abrirModal(null);
  }

  mostrarModalEditar(): void {
    if (
      !this.filaSeleccionada ||
      this.filaSeleccionada.esSistema
    ) {
      return;
    }

    this.abrirModal(this.filaSeleccionada);
  }

  cambiarEstado(): void {
    const rol = this.filaSeleccionada;

    if (!rol || rol.esSistema) {
      return;
    }

    const accion = rol.activo
      ? 'desactivar'
      : 'activar';

    const confirmado = window.confirm(
      `¿Deseas ${accion} el rol "${rol.nombre}"?`
    );

    if (!confirmado) {
      return;
    }

    this.rolService
      .cambiarEstado(rol.id)
      .subscribe((resultado) => {
        if (!resultado) {
          return;
        }

        const accionBitacora = resultado.activo
          ? AccionBitacora.ACTIVAR
          : AccionBitacora.DESACTIVAR;

        this.registrarEventoRol(
          accionBitacora,
          resultado,
          resultado.activo
            ? `Se activó el rol ${resultado.nombre}.`
            : `Se desactivó el rol ${resultado.nombre}.`
        );

        this.cargarRoles();
      });
  }

  private cargarRoles(): void {
    const query: RolQuery = {
      ...this.filtro,
      page: this.page,
      pageSize: this.pageSize
    };

    this.loading = true;
    this.filaSeleccionada = null;

    this.rolService
      .listar(query)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe((resultado) => {
        this.roles = resultado.items;
        this.totalItems = resultado.totalItems;
      });
  }

  private abrirModal(rol: Rol | null): void {
    const modalRef = this.modalService.open(
      ModalRolComponent,
      {
        backdrop: 'static',
        keyboard: false,
        size: 'xl',
        centered: true
      }
    );

    modalRef.componentInstance.titleModal = rol
      ? 'EDITAR ROL'
      : 'REGISTRAR ROL';

    modalRef.componentInstance.data = rol;

    modalRef.result
      .then((resultado: RolFormData) => {
        if (resultado) {
          this.guardarRol(resultado, rol);
        }
      })
      .catch(() => { });
  }

  private guardarRol(
    data: RolFormData,
    rol: Rol | null
  ): void {
    this.rolService
      .existeNombre(data.nombre, rol?.id)
      .pipe(
        switchMap((existe) => {
          if (existe) {
            window.alert(
              'Ya existe un rol con el mismo nombre.'
            );

            return EMPTY;
          }

          return rol
            ? this.rolService.actualizar(rol.id, data)
            : this.rolService.crear(data);
        })
      )
      .subscribe((resultado) => {
        if (!resultado) {
          return;
        }

        if (rol) {
          this.registrarEventoRol(
            AccionBitacora.EDITAR,
            resultado,
            `Se actualizó el rol ${resultado.nombre}.`
          );
        } else {
          this.registrarEventoRol(
            AccionBitacora.CREAR,
            resultado,
            `Se creó el rol ${resultado.nombre}.`
          );
        }

        this.page = 1;
        this.cargarRoles();
      });
  }

  private registrarEventoRol(
    accion: AccionBitacora,
    rol: Rol,
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
      modulo: ModuloSistema.ROLES,
      accion,
      entidad: 'Rol',
      registroId: rol.id,
      detalle,
      resultado: ResultadoBitacora.EXITO
    };

    this.bitacoraService
      .registrar(evento)
      .subscribe();
  }
}