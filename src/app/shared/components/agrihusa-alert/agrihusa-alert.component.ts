import { CommonModule } from '@angular/common';
import { Component, TemplateRef } from '@angular/core';
import { NgbToast } from '@ng-bootstrap/ng-bootstrap';

import {
  AlertService,
  AlertToast
} from '../../../core/services/alert.service';

@Component({
  selector: 'agrihusa-alert',
  standalone: true,
  imports: [CommonModule, NgbToast],
  templateUrl: './agrihusa-alert.component.html',
  styleUrls: ['./agrihusa-alert.component.scss'],
  host: { '[class.ngb-toasts]': 'true' }
})
export class AgrihusaAlertComponent {
  constructor(public alertService: AlertService) {}

  isTemplate(toast: AlertToast | null): boolean {
    return toast != null &&
      (toast.message as unknown) instanceof TemplateRef;
  }

  getIcon(type: string): string {
    switch (type) {
      case 'success':
        return 'icon-check-circle';
      case 'warning':
        return 'icon-alert-triangle';
      case 'info':
        return 'icon-info';
      default:
        return 'icon-slash';
    }
  }

  getTitle(type: string): string {
    switch (type) {
      case 'success':
        return 'Mensaje de confirmación';
      case 'warning':
        return 'Mensaje de alerta';
      case 'info':
        return 'Mensaje informativo';
      default:
        return 'Mensaje fallido';
    }
  }
}
