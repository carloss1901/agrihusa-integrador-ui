import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AgrihusaButtonComponent } from '../../../../shared/components/agrihusa-button/agrihusa-button.component';

@Component({
  selector: 'app-modal-confirmar-naviera',
  standalone: true,
  imports: [CommonModule, AgrihusaButtonComponent],
  templateUrl: './modal-confirmar-naviera.component.html',
  styleUrls: ['./modal-confirmar-naviera.component.scss']
})
export class ModalConfirmarNavieraComponent {
  @Input() titulo = 'Confirmar eliminación';
  @Input() mensaje = '';

  constructor(public readonly activeModal: NgbActiveModal) {}

  confirmar(): void { this.activeModal.close(true); }
  cancelar(): void { this.activeModal.dismiss(false); }
}
