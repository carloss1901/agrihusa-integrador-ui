import { Injectable, NgZone } from '@angular/core';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface AlertToast {
  message: string;
  type: AlertType;
  delay: number;
}

@Injectable({ providedIn: 'root' })
export class AlertService {
  readonly toasts: AlertToast[] = [];

  constructor(private readonly zone: NgZone) {}

  success(message: string, duration = 3000): void {
    this.show(message, 'success', duration);
  }

  error(message = 'Error', duration = 4000): void {
    this.show(message, 'error', duration);
  }

  warning(message: string, duration = 4000): void {
    this.show(message, 'warning', duration);
  }

  info(message: string, duration = 4000): void {
    this.show(message, 'info', duration);
  }

  remove(toast: AlertToast): void {
    this.zone.run(() => {
      const index = this.toasts.indexOf(toast);

      if (index >= 0) {
        this.toasts.splice(index, 1);
      }
    });
  }

  private show(message: string, type: AlertType, delay: number): void {
    setTimeout(() => {
      this.zone.run(() => {
        this.toasts.push({ message, type, delay });
      });
    });
  }
}
