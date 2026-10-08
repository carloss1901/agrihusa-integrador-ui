import { CommonModule } from '@angular/common';
import { Component, TemplateRef } from '@angular/core';
import { NgbToast } from '@ng-bootstrap/ng-bootstrap';
import { AlertService, AlertToast } from '../../../core/services/alert.service';

@Component({
  selector: 'agrihusa-alert',
  standalone: true,
  imports: [CommonModule, NgbToast],
  templateUrl: './agrihusa-alert.component.html',
  styleUrls: ['./agrihusa-alert.component.scss'],
  host: { '[class.ngb-toasts]': 'true' }
})
export class AgrihusaAlertComponent {
  constructor(public readonly alertService: AlertService) {}

  isTemplate(toast: AlertToast | null): boolean {
    return toast != null && (toast.message as unknown) instanceof TemplateRef;
  }

  getIcon(classname?: string): string {
    switch (classname?.split(' ')[0]) {
      case 'bg-alert-success': return 'icon-check-circle';
      case 'bg-alert-warning': return 'icon-alert-triangle';
      case 'bg-alert-info': return 'icon-info';
      default: return 'icon-slash';
    }
  }
}
