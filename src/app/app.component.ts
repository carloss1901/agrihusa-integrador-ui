import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { AuditoriaComponent } from './features/auditoria/views/auditoria/auditoria.component';
import { MantenimientoDestinosComponent } from './features/destinos/views/mantenimiento-destinos/mantenimiento-destinos.component';
import { HeaderComponent } from './features/header/header.component';
import { LoginComponent } from './features/login/login.component';
import { MenuComponent } from './features/menu/menu.component';
import { MantenimientoNavierasComponent } from './features/navieras/views/mantenimiento-navieras/mantenimiento-navieras.component';
import { MantenimientoPuertosLlegadaComponent } from './features/puertos-llegada/views/mantenimiento-puertos-llegada/mantenimiento-puertos-llegada.component';
import { MantenimientoVariedadesComponent } from './features/variedades/views/mantenimiento-variedades/mantenimiento-variedades.component';
import { MantenimientoViasComponent } from './features/vias/views/mantenimiento-vias/mantenimiento-vias.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    MenuComponent,
    LoginComponent,
    MantenimientoDestinosComponent,
    MantenimientoViasComponent,
    MantenimientoVariedadesComponent,
    MantenimientoNavierasComponent,
    MantenimientoPuertosLlegadaComponent,
    AuditoriaComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isAuthenticated = false;
  menuVisible = true;
  selectedMenuLabel = 'Seleccione una opcion del menu';
  mostrarDestinos = false;
  mostrarVias = false;
  mostrarVariedades = false;
  mostrarNavieras = false;
  mostrarPuertosLlegada = false;
  mostrarAuditoria = false;

  toggleMenu(esCerrar: boolean): void {
    this.menuVisible = !esCerrar;
  }

  login(): void {
    this.isAuthenticated = true;
  }

  logout(): void {
    this.isAuthenticated = false;
    this.menuVisible = true;
    this.resetPantallas();
  }

  onSelectMenu(label: string): void {
    this.selectedMenuLabel = label;
    this.resetPantallas();
    this.mostrarDestinos = label === 'Destinos';
    this.mostrarVias = label === 'Vias';
    this.mostrarVariedades = label === 'Variedades';
    this.mostrarNavieras = label === 'Navieras';
    this.mostrarPuertosLlegada = label === 'Puertos de llegada';
    this.mostrarAuditoria =
      label === 'Auditoria' || label === 'Auditoría' || label === 'AuditorÃ­a';
  }

  private resetPantallas(): void {
    this.mostrarDestinos = false;
    this.mostrarVias = false;
    this.mostrarVariedades = false;
    this.mostrarNavieras = false;
    this.mostrarPuertosLlegada = false;
    this.mostrarAuditoria = false;
  }
}
