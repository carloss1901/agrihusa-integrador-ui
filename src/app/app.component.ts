import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef
} from '@angular/core';
import { take } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MantenimientoUsuariosComponent } from './features/usuarios/views/mantenimiento-usuarios/mantenimiento-usuarios.component';
import { AuditoriaComponent } from './features/auditoria/views/auditoria/auditoria.component';
import { MantenimientoDestinosComponent } from './features/destinos/views/mantenimiento-destinos/mantenimiento-destinos.component';
import { HeaderComponent } from './features/header/header.component';
import { LoginComponent } from './features/login/login.component';
import { MantenimientoNavierasComponent } from './features/navieras/views/mantenimiento-navieras/mantenimiento-navieras.component';
import { MantenimientoPuertosLlegadaComponent } from './features/puertos-llegada/views/mantenimiento-puertos-llegada/mantenimiento-puertos-llegada.component';
import { MantenimientoVariedadesComponent } from './features/variedades/views/mantenimiento-variedades/mantenimiento-variedades.component';
import { MantenimientoViasComponent } from './features/vias/views/mantenimiento-vias/mantenimiento-vias.component';
import { MantenimientoRolesComponent } from './features/roles/views/mantenimiento-roles/mantenimiento-roles.component';
import {
  MenuComponent,
  MenuItem
} from './features/menu/menu.component';
import {
  AccionPermiso,
  ModuloSistema
} from './core/models/permiso.model';
import { AuthService } from './core/services/auth.service';
import { PerfilUsuarioComponent } from './features/perfil-usuario/views/perfil-usuario/perfil-usuario.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    MenuComponent,
    LoginComponent,
    MantenimientoUsuariosComponent,
    MantenimientoDestinosComponent,
    MantenimientoViasComponent,
    MantenimientoVariedadesComponent,
    MantenimientoNavierasComponent,
    MantenimientoPuertosLlegadaComponent,
    MantenimientoRolesComponent,
    AuditoriaComponent,
    PerfilUsuarioComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  isAuthenticated = false;
  menuVisible = true;
  selectedMenuLabel = 'Seleccione una opción del menú';
  mostrarUsuarios = false;
  mostrarDestinos = false;
  mostrarVias = false;
  mostrarVariedades = false;
  mostrarNavieras = false;
  mostrarRoles = false;
  mostrarPuertosLlegada = false;
  mostrarAuditoria = false;
  mostrarPerfilUsuario = false;

  toggleMenu(esCerrar: boolean): void {
    this.menuVisible = !esCerrar;
  }

  logout(): void {
    this.authService.logout();
  }

  onSelectMenu(item: MenuItem): void {
    const sesion = this.authService.obtenerSesionActual();

    if (
      sesion?.debeCambiarPassword &&
      item.modulo !== ModuloSistema.PERFIL_USUARIO
    ) {
      this.resetPantallas();
      this.mostrarPerfilUsuario = true;
      this.selectedMenuLabel =
        'Cambio de contraseña requerido';
      return;
    }
    this.authService.tienePermiso(
      item.modulo,
      AccionPermiso.CONSULTAR
    )
      .pipe(take(1))
      .subscribe((tieneAcceso) => {
        this.resetPantallas();

        if (!tieneAcceso) {
          this.selectedMenuLabel =
            'Acceso no autorizado';
          return;
        }

        this.selectedMenuLabel = item.nombre;

        switch (item.modulo) {
          case ModuloSistema.ROLES:
            this.mostrarRoles = true;
            break;

          case ModuloSistema.USUARIOS:
            this.mostrarUsuarios = true;
            break;

          case ModuloSistema.DESTINOS:
            this.mostrarDestinos = true;
            break;

          case ModuloSistema.VIAS:
            this.mostrarVias = true;
            break;

          case ModuloSistema.VARIEDADES:
            this.mostrarVariedades = true;
            break;

          case ModuloSistema.NAVIERAS:
            this.mostrarNavieras = true;
            break;

          case ModuloSistema.PUERTOS_LLEGADA:
            this.mostrarPuertosLlegada = true;
            break;

          case ModuloSistema.BITACORA:
            this.mostrarAuditoria = true;
            break;

          case ModuloSistema.PERFIL_USUARIO:
            this.mostrarPerfilUsuario = true;
            break;
        }
      });
  }

  private resetPantallas(): void {
    this.mostrarUsuarios = false;
    this.mostrarDestinos = false;
    this.mostrarVias = false;
    this.mostrarVariedades = false;
    this.mostrarNavieras = false;
    this.mostrarRoles = false;
    this.mostrarPuertosLlegada = false;
    this.mostrarAuditoria = false;
    this.mostrarPerfilUsuario = false;
  }

  constructor(
    private authService: AuthService,
    destroyRef: DestroyRef
  ) {
    this.authService.sesion$
      .pipe(takeUntilDestroyed(destroyRef))
      .subscribe((sesion) => {
        this.isAuthenticated = sesion !== null;

        if (!sesion) {
          this.menuVisible = true;
          this.selectedMenuLabel =
            'Seleccione una opción del menú';

          this.resetPantallas();
          return;
        }

        if (sesion.debeCambiarPassword) {
          this.menuVisible = true;
          this.resetPantallas();
          this.mostrarPerfilUsuario = true;
          this.selectedMenuLabel =
            'Cambio de contraseña requerido';
        }
      });
  }
}

