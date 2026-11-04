import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AgrihusaButtonComponent } from '../../../../shared/components/agrihusa-button/agrihusa-button.component';

@Component({
  selector: 'app-modal-confirmar-via',
  standalone: true,
  imports: [CommonModule, AgrihusaButtonComponent],
  templateUrl: './modal-confirmar-via.component.html',
  styleUrls: ['./modal-confirmar-via.component.scss']
})
export class ModalConfirmarViaComponent {
  @Input() titulo = 'Confirmar eliminación';
  @Input() mensaje = '';

  constructor(public readonly activeModal: NgbActiveModal) {}

  confirmar(): void {
    this.activeModal.close(true);
  }

  cancelar(): void {
    this.activeModal.dismiss(false);
  }
}
