import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent {
  @Output() onToggleSideNav = new EventEmitter<boolean>();
  @Output() onLogout = new EventEmitter<void>();

  usuario = 'AGRIHUSA';
  nombreUsuario = 'Usuario Demo';
  inicialesUsuario = 'AD';
  fecSesion = '27/08/2026 10:00 a. m.';
  roles = [
    { idRol: 1, descripcion: 'Administrador' },
    { idRol: 2, descripcion: 'Operador' }
  ];
  rolSeleccionado = 1;

  toggleMenu(esCerrar: boolean): void {
    this.onToggleSideNav.emit(esCerrar);
  }

  logout(): void {
    this.onLogout.emit();
  }
}
