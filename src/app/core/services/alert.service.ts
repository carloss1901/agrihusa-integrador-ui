import { Injectable, NgZone } from '@angular/core';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface AlertErrorDetail {
  campo?: string;
  mensaje?: string;
}

export interface AlertToast {
  message?: string;
  classname?: string;
  delay?: number;
  errores?: AlertErrorDetail[];
}

@Injectable({ providedIn: 'root' })
export class AlertService {
  toasts: AlertToast[] = [];

  constructor(private readonly zone: NgZone) {}

  success(message: string, duration = 3000): void {
    this.show(message, 'bg-alert-success mb-1', duration);
  }

  error(message = 'Error', errores: AlertErrorDetail[] = [], delay = 4000): void {
    this.show(message, 'bg-alert-danger mb-1', delay, errores);
  }

  warning(message: string, errores: AlertErrorDetail[] = [], duration = 4000): void {
    this.show(message, 'bg-alert-warning mb-1', duration, errores);
  }

  info(message = '', errores: AlertErrorDetail[] = [], delay = 4000): void {
    this.show(message, 'bg-alert-info mb-1', delay, errores);
  }

  show(message: string, classname: string, delay: number, errores: AlertErrorDetail[] = []): void {
    setTimeout(() => {
      this.zone.run(() => {
        this.toasts.push({ message, classname, delay, errores });
      });
    });
  }

  remove(toast: AlertToast): void {
    setTimeout(() => {
      this.zone.run(() => {
        this.toasts = this.toasts.filter((item) => item !== toast);
      });
    });
  }
}
