import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AgrihusaButtonComponent } from
  '../agrihusa-button/agrihusa-button.component';

@Component({
  selector: 'app-modal-confirmacion',
  standalone: true,
  imports: [
    CommonModule,
    AgrihusaButtonComponent
  ],
  templateUrl: './modal-confirmacion.component.html',
  styleUrls: ['./modal-confirmacion.component.scss']
})
export class ModalConfirmacionComponent {
  @Input() titulo = 'Confirmar acción';
  @Input() mensaje = '';

  constructor(
    public readonly activeModal: NgbActiveModal
  ) {}

  confirmar(): void {
    this.activeModal.close(true);
  }

  cancelar(): void {
    this.activeModal.dismiss(false);
  }
}