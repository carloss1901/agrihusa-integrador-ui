import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Output,
  ViewEncapsulation
} from '@angular/core';

import { TokenService } from '../../core/services/token.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent {
  @Output() onToggleSideNav = new EventEmitter<boolean>();
  @Output() onLogout = new EventEmitter<void>();

  private readonly tokenService = inject(TokenService);

  empresa = 'AGRIHUSA';
  nombreUsuario = '';
  nombreCompleto = '';
  fechaSesion = '';
  nombreRol = '';

  constructor() {
    const payload = this.tokenService.obtenerPayload();
    this.nombreUsuario = this.tokenService.obtenerUsuario();
    this.nombreCompleto = this.nombreUsuario;
    this.fechaSesion = payload?.iat
      ? this.formatearFecha(new Date(payload.iat * 1000).toISOString())
      : '';
    this.nombreRol = this.tokenService.obtenerRolPrincipal();
  }

  toggleMenu(esCerrar: boolean): void {
    this.onToggleSideNav.emit(esCerrar);
  }

  logout(): void {
    this.onLogout.emit();
  }

  private formatearFecha(fechaIso: string): string {
    const fecha = new Date(fechaIso);

    if (Number.isNaN(fecha.getTime())) {
      return '';
    }

    return new Intl.DateTimeFormat('es-PE', {
      dateStyle: 'short',
      timeStyle: 'short'
    }).format(fecha);
  }

  private limpiarDatosSesion(): void {
    this.nombreUsuario = '';
    this.nombreCompleto = '';
    this.fechaSesion = '';
    this.nombreRol = '';
  }
}
