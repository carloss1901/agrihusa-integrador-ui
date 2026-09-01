import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { of, switchMap } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';
import { RolService } from '../roles/services/rol.service';

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

  private readonly authService = inject(AuthService);
  private readonly rolService = inject(RolService);
  private readonly destroyRef = inject(DestroyRef);

  empresa = 'AGRIHUSA';
  nombreUsuario = '';
  nombreCompleto = '';
  inicialesUsuario = '';
  fechaSesion = '';
  nombreRol = '';

  constructor() {
    this.cargarDatosSesion();
  }

  toggleMenu(esCerrar: boolean): void {
    this.onToggleSideNav.emit(esCerrar);
  }

  logout(): void {
    this.onLogout.emit();
  }

  private cargarDatosSesion(): void {
    this.authService.sesion$
      .pipe(
        switchMap((sesion) => {
          if (!sesion) {
            this.limpiarDatosSesion();
            return of(null);
          }

          this.nombreUsuario = sesion.nombreUsuario;
          this.nombreCompleto = sesion.nombreCompleto;
          this.inicialesUsuario = this.obtenerIniciales(
            sesion.nombreCompleto
          );
          this.fechaSesion = this.formatearFecha(
            sesion.fechaInicio
          );

          return this.rolService.obtenerPorId(sesion.rolId);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((rol) => {
        this.nombreRol = rol?.nombre ?? 'Sin rol';
      });
  }

  private obtenerIniciales(nombreCompleto: string): string {
    return nombreCompleto
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((palabra) => palabra.charAt(0))
      .join('')
      .toUpperCase();
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
    this.inicialesUsuario = '';
    this.fechaSesion = '';
    this.nombreRol = '';
  }
}