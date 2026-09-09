import { CommonModule } from '@angular/common';
import {
  Component,
  Input
} from '@angular/core';
import {
  NgbActiveModal
} from '@ng-bootstrap/ng-bootstrap';

import { MODULOS_SISTEMA_CONFIG } from '../../../../core/constants/modulos-sistema.constant';
import { AgrihusaButtonComponent } from '../../../../shared/components/agrihusa-button/agrihusa-button.component';
import {
  AccionBitacora,
  MODULO_AUTENTICACION,
  ModuloBitacora,
  RegistroBitacora
} from '../../models/bitacora.model';

@Component({
  selector: 'app-modal-detalle-auditoria',
  standalone: true,
  imports: [
    CommonModule,
    AgrihusaButtonComponent
  ],
  templateUrl:
    './modal-detalle-auditoria.component.html'
})
export class ModalDetalleAuditoriaComponent {
  @Input() titleModal = '';
  @Input() data: RegistroBitacora | null = null;

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

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  obtenerNombreModulo(
    modulo?: ModuloBitacora
  ): string {
    if (!modulo) {
      return '';
    }

    return (
      this.nombresModulos.get(modulo) ??
      modulo.toUpperCase()
    );
  }

  obtenerNombreAccion(
    accion?: AccionBitacora
  ): string {
    return accion
      ? this.nombresAcciones[accion]
      : '';
  }

  formatearFecha(fechaIso?: string): string {
    if (!fechaIso) {
      return '';
    }

    const fecha = new Date(fechaIso);

    if (Number.isNaN(fecha.getTime())) {
      return 'FECHA NO DISPONIBLE';
    }

    return new Intl.DateTimeFormat('es-PE', {
      dateStyle: 'full',
      timeStyle: 'medium'
    }).format(fecha);
  }

  onCerrar(): void {
    this.activeModal.dismiss();
  }
}