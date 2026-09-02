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
import { FiltroOperadoresLogisticosComponent } from '../../components/filtro-operadores-logisticos/filtro-operadores-logisticos.component';
import { ModalOperadorLogisticoComponent } from '../../components/modal-operador-logistico/modal-operador-logistico.component';
import { TablaOperadoresLogisticosComponent } from '../../components/tabla-operadores-logisticos/tabla-operadores-logisticos.component';
import {
  OperadorLogistico,
  OperadorLogisticoFilter,
  OperadorLogisticoFormData,
  OperadorLogisticoQuery
} from '../../models/operador-logistico.model';
import { OperadorLogisticoService } from '../../services/operador-logistico.service';

@Component({
  selector:
    'app-mantenimiento-operadores-logisticos',
  standalone: true,
  imports: [
    CommonModule,
    AgrihusaTopBarComponent,
    AgrihusaButtonComponent,
    FiltroOperadoresLogisticosComponent,
    TablaOperadoresLogisticosComponent
  ],
  templateUrl:
    './mantenimiento-operadores-logisticos.component.html'
})
export class MantenimientoOperadoresLogisticosComponent
  implements OnInit {
  readonly titulo =
    'Mantenimiento de Operadores Logísticos';

  operadores: OperadorLogistico[] = [];
  filaSeleccionada: OperadorLogistico | null = null;
  loading = false;
  totalItems = 0;
  page = 1;
  pageSize = 10;

  puedeCrear = false;
  puedeEditar = false;
  puedeCambiarEstado = false;

  private filtro: OperadorLogisticoFilter = {};

  constructor(
    private operadorService:
      OperadorLogisticoService,
    private authService: AuthService,
    private bitacoraService: BitacoraService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.cargarPermisos();
    this.cargarOperadores();
  }

  onBuscar(
    filtro: OperadorLogisticoFilter
  ): void {
    this.filtro = { ...filtro };
    this.page = 1;
    this.cargarOperadores();
  }

  onLimpiarFiltro(): void {
    this.filtro = {};
    this.page = 1;
    this.cargarOperadores();
  }

  onSeleccionarOperador(
    operador: OperadorLogistico
  ): void {
    this.filaSeleccionada =
      this.filaSeleccionada?.id === operador.id
        ? null
        : operador;
  }

  onChangePaginate(
    event: IChangePaginate
  ): void {
    this.page = event.page;
    this.pageSize = event.pageSize;
    this.cargarOperadores();
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
    const operador = this.filaSeleccionada;

    if (
      !this.puedeCambiarEstado ||
      !operador
    ) {
      return;
    }

    const accion = operador.activo
      ? 'desactivar'
      : 'activar';

    const confirmado = window.confirm(
      `¿Deseas ${accion} al operador ` +
      `"${operador.razonSocial}"?`
    );

    if (!confirmado) {
      return;
    }

    this.operadorService
      .cambiarEstado(operador.id)
      .subscribe((resultado) => {
        if (!resultado) {
          return;
        }

        const accionBitacora = resultado.activo
          ? AccionBitacora.ACTIVAR
          : AccionBitacora.DESACTIVAR;

        this.registrarEventoOperador(
          accionBitacora,
          resultado,
          resultado.activo
            ? `Se activó al operador ${resultado.razonSocial}.`
            : `Se desactivó al operador ${resultado.razonSocial}.`
        );

        this.cargarOperadores();
      });
  }

  private cargarOperadores(): void {
    const query: OperadorLogisticoQuery = {
      ...this.filtro,
      page: this.page,
      pageSize: this.pageSize
    };

    this.loading = true;
    this.filaSeleccionada = null;

    this.operadorService
      .listar(query)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe((resultado) => {
        this.operadores = resultado.items;
        this.totalItems = resultado.totalItems;
      });
  }

  private abrirModal(
    operador: OperadorLogistico | null
  ): void {
    const modalRef = this.modalService.open(
      ModalOperadorLogisticoComponent,
      {
        backdrop: 'static',
        keyboard: false,
        size: 'xl',
        centered: true,
        scrollable: true
      }
    );

    modalRef.componentInstance.titleModal = operador
      ? 'EDITAR OPERADOR LOGÍSTICO'
      : 'REGISTRAR OPERADOR LOGÍSTICO';

    modalRef.componentInstance.data = operador;

    modalRef.result
      .then(
        (
          resultado: OperadorLogisticoFormData
        ) => {
          if (resultado) {
            this.guardarOperador(
              resultado,
              operador
            );
          }
        }
      )
      .catch(() => {});
  }

  private guardarOperador(
    data: OperadorLogisticoFormData,
    operador: OperadorLogistico | null
  ): void {
    forkJoin({
      existeRuc:
        this.operadorService.existeRuc(
          data.ruc,
          operador?.id
        ),
      existeRazonSocial:
        this.operadorService.existeRazonSocial(
          data.razonSocial,
          operador?.id
        )
    })
      .pipe(
        switchMap(
          ({
            existeRuc,
            existeRazonSocial
          }) => {
            if (existeRuc) {
              window.alert(
                'Ya existe un operador con ese RUC.'
              );

              return EMPTY;
            }

            if (existeRazonSocial) {
              window.alert(
                'Ya existe un operador con esa razón social.'
              );

              return EMPTY;
            }

            if (!operador) {
              return this.operadorService.crear(data);
            }

            return this.operadorService.actualizar(
              operador.id,
              data
            );
          }
        )
      )
      .subscribe((operadorGuardado) => {
        if (!operadorGuardado) {
          return;
        }

        if (!operador) {
          this.registrarEventoOperador(
            AccionBitacora.CREAR,
            operadorGuardado,
            `Se creó al operador ` +
              `${operadorGuardado.razonSocial}.`
          );
        } else {
          this.registrarEventoOperador(
            AccionBitacora.EDITAR,
            operadorGuardado,
            `Se actualizó al operador ` +
              `${operadorGuardado.razonSocial}.`
          );
        }

        this.page = 1;
        this.cargarOperadores();
      });
  }

  private cargarPermisos(): void {
    forkJoin({
      crear: this.authService.tienePermiso(
        ModuloSistema.OPERADORES_LOGISTICOS,
        AccionPermiso.CREAR
      ),
      editar: this.authService.tienePermiso(
        ModuloSistema.OPERADORES_LOGISTICOS,
        AccionPermiso.EDITAR
      ),
      cambiarEstado:
        this.authService.tienePermiso(
          ModuloSistema.OPERADORES_LOGISTICOS,
          AccionPermiso.ELIMINAR
        )
    }).subscribe((permisos) => {
      this.puedeCrear = permisos.crear;
      this.puedeEditar = permisos.editar;
      this.puedeCambiarEstado =
        permisos.cambiarEstado;
    });
  }

  private registrarEventoOperador(
    accion: AccionBitacora,
    operador: OperadorLogistico,
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
      modulo:
        ModuloSistema.OPERADORES_LOGISTICOS,
      accion,
      entidad: 'Operador logístico',
      registroId: operador.id,
      detalle,
      resultado: ResultadoBitacora.EXITO
    };

    this.bitacoraService
      .registrar(evento)
      .subscribe();
  }
}