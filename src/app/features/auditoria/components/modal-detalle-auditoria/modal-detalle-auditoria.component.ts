import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AgrihusaButtonComponent } from '../../../../shared/components/agrihusa-button/agrihusa-button.component';
import { AccionMantenimiento } from '../../../../shared/enums/accion-mantenimiento.enum';

interface RegistroAuditoria {
  idAuditoria: number;
  fecha: string;
  usuario: string;
  accion: string;
  entidad: string;
  detalle: string;
  ip: string;
}

@Component({
  selector: 'app-modal-detalle-auditoria',
  standalone: true,
  imports: [CommonModule, AgrihusaButtonComponent],
  templateUrl: './modal-detalle-auditoria.component.html'
})
export class ModalDetalleAuditoriaComponent {
  readonly AccionMantenimiento = AccionMantenimiento;

  @Input() titleModal = '';
  @Input() accion: AccionMantenimiento = AccionMantenimiento.VER;
  @Input() data: RegistroAuditoria | null = null;

  constructor(public activeModal: NgbActiveModal) {}

  onCerrar() {
    this.activeModal.close();
  }
}