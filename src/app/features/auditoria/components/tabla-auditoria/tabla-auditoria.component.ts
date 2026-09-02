import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { MODULOS_SISTEMA_CONFIG } from '../../../../core/constants/modulos-sistema.constant';
import { AgrihusaLoadingComponent } from '../../../../shared/components/agrihusa-loading/agrihusa-loading.component';
import { AgrihusaNoResultsComponent } from '../../../../shared/components/agrihusa-no-results/agrihusa-no-results.component';
import {
  IChangePaginate,
  TableFooterPaginationComponent
} from '../../../../shared/components/agrihusa-table-footer/agrihusa-table-footer.component';
import {
  AccionBitacora,
  MODULO_AUTENTICACION,
  ModuloBitacora,
  RegistroBitacora,
  ResultadoBitacora
} from '../../models/bitacora.model';

@Component({
  selector: 'app-tabla-auditoria',
  standalone: true,
  imports: [
    CommonModule,
    AgrihusaLoadingComponent,
    AgrihusaNoResultsComponent,
    TableFooterPaginationComponent
  ],
  templateUrl: './tabla-auditoria.component.html'
})
export class TablaAuditoriaComponent {
  readonly ResultadoBitacora = ResultadoBitacora;
  
  @Input() datasource: RegistroBitacora[] = [];
  @Input() loading = false;
  @Input() totalItems = 0;
  @Input() page = 1;
  @Input() pageSize = 10;
  @Input()
  filaSeleccionada: RegistroBitacora | null = null;
  
  @Output()
  seleccionar =
    new EventEmitter<RegistroBitacora>();

  @Output()
  paginar =
    new EventEmitter<IChangePaginate>();

  private readonly nombresModulos =
    new Map<ModuloBitacora, string>([
      [
        MODULO_AUTENTICACION,
        'AUTENTICACIÓN'
      ],
      ...MODULOS_SISTEMA_CONFIG.map(
        (modulo) =>
          [
            modulo.codigo,
            modulo.nombre.toUpperCase()
          ] as [ModuloBitacora, string]
      )
    ]);

  private readonly nombresAcciones:
    Record<AccionBitacora, string> = {
      [AccionBitacora.INICIO_SESION]:
        'INICIO DE SESIÓN',
      [AccionBitacora.INICIO_SESION_FALLIDO]:
        'INICIO DE SESIÓN FALLIDO',
      [AccionBitacora.CIERRE_SESION]:
        'CIERRE DE SESIÓN',
      [AccionBitacora.CREAR]: 'CREAR',
      [AccionBitacora.EDITAR]: 'EDITAR',
      [AccionBitacora.ACTIVAR]: 'ACTIVAR',
      [AccionBitacora.DESACTIVAR]: 'DESACTIVAR',
      [AccionBitacora.CONSULTAR]: 'CONSULTAR',
      [AccionBitacora.EXPORTAR]: 'EXPORTAR'
    };

  onSeleccionarFila(
    fila: RegistroBitacora
  ): void {
    this.seleccionar.emit(fila);
  }

  onChangePaginate(
    event: IChangePaginate
  ): void {
    if (!this.totalItems) {
      return;
    }

    this.paginar.emit(event);
  }

  obtenerNombreModulo(
    modulo: ModuloBitacora
  ): string {
    return (
      this.nombresModulos.get(modulo) ??
      modulo.toUpperCase()
    );
  }

  obtenerNombreAccion(
    accion: AccionBitacora
  ): string {
    return this.nombresAcciones[accion];
  }

  formatearFecha(fechaIso: string): string {
    const fecha = new Date(fechaIso);

    if (Number.isNaN(fecha.getTime())) {
      return 'FECHA NO DISPONIBLE';
    }

    return new Intl.DateTimeFormat('es-PE', {
      dateStyle: 'short',
      timeStyle: 'medium'
    }).format(fecha);
  }

  trackByRegistroId(
    _index: number,
    registro: RegistroBitacora
  ): number {
    return registro.id;
  }

  get itemId(): number {
    return this.filaSeleccionada?.id ?? 0;
  }
}