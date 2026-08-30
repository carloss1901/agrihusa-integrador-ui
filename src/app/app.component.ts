import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { HeaderComponent } from './features/header/header.component';
import { LoginComponent } from './features/login/login.component';
import { MenuComponent } from './features/menu/menu.component';
import { MantenimientoDestinosComponent } from './features/destinos/views/mantenimiento-destinos/mantenimiento-destinos.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HeaderComponent, MenuComponent, LoginComponent, MantenimientoDestinosComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isAuthenticated = false;
  menuVisible = true;
  selectedMenuLabel = 'Seleccione una opcion del menu';
  mostrarDestinos = false;

  toggleMenu(esCerrar: boolean): void {
    this.menuVisible = !esCerrar;
  }

  login(): void {
    this.isAuthenticated = true;
  }

  logout(): void {
    this.isAuthenticated = false;
    this.menuVisible = true;
    this.mostrarDestinos = false;
  }

  onSelectMenu(label: string): void {
    this.selectedMenuLabel = label;
    this.mostrarDestinos = label === 'Destinos';
  }
}
