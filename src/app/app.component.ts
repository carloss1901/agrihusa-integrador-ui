import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef
} from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HeaderComponent } from './features/header/header.component';
import {
  MenuComponent,
  MenuItem
} from './features/menu/menu.component';
import {
  AccionPermiso,
  ModuloSistema
} from './core/models/permiso.model';
import { AuthService } from './core/services/auth.service';
import { TokenService } from './core/services/token.service';
import { AgrihusaAlertComponent } from './shared/components/agrihusa-alert/agrihusa-alert.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    MenuComponent,
    AgrihusaAlertComponent
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
  mostrarClientes = false;
  mostrarProductos = false;
  mostrarSituaciones = false;
  mostrarRegistroDespacho = false;
  mostrarReporteDespacho = false;
  mostrarOperadoresLogisticos = false;
  toggleMenu(esCerrar: boolean): void {
    this.menuVisible = !esCerrar;
  }

  onLoginSuccess(): void {
    this.isAuthenticated = true;
    this.menuVisible = true;
    this.resetPantallas();
    this.selectedMenuLabel = 'Seleccione una opción del menú';
    void this.router.navigate(['/inicio']);
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }

  onSelectMenu(item: MenuItem): void {
    const ruta = this.obtenerRuta(item.modulo);
    if (ruta) {
      void this.router.navigate([ruta]);
    }

    return;

    /*
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
    const tieneAcceso = this.tokenService.tienePermiso(
      item.modulo,
      AccionPermiso.CONSULTAR
    );
    this.resetPantallas();

    if (!tieneAcceso) {
      this.selectedMenuLabel = 'Acceso no autorizado';
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

          case ModuloSistema.CLIENTES:
            this.mostrarClientes = true;
            break;
          
          case ModuloSistema.OPERADORES_LOGISTICOS:
            this.mostrarOperadoresLogisticos = true;
            break;

          case ModuloSistema.PRODUCTOS:
            this.mostrarProductos = true;
            break;

          case ModuloSistema.SITUACIONES:
            this.mostrarSituaciones = true;
            break;

          case ModuloSistema.REGISTRO_DESPACHO:
            this.mostrarRegistroDespacho = true;
            break;
          case ModuloSistema.REPORTE_DESPACHO:
            this.mostrarReporteDespacho = true;
            break;
    }
    */
  }

  private obtenerRuta(modulo: ModuloSistema): string | null {
    const rutas: Partial<Record<ModuloSistema, string>> = {
      [ModuloSistema.ROLES]: '/roles',
      [ModuloSistema.USUARIOS]: '/usuarios',
      [ModuloSistema.DESTINOS]: '/destinos',
      [ModuloSistema.VIAS]: '/vias',
      [ModuloSistema.VARIEDADES]: '/variedades',
      [ModuloSistema.NAVIERAS]: '/navieras',
      [ModuloSistema.PUERTOS_LLEGADA]: '/puertos-llegada',
      [ModuloSistema.BITACORA]: '/auditoria',
      [ModuloSistema.PERFIL_USUARIO]: '/perfil-usuario',
      [ModuloSistema.CLIENTES]: '/clientes',
      [ModuloSistema.OPERADORES_LOGISTICOS]: '/operadores-logisticos',
      [ModuloSistema.PRODUCTOS]: '/productos',
      [ModuloSistema.SITUACIONES]: '/situaciones',
      [ModuloSistema.REGISTRO_DESPACHO]: '/registro-despacho',
      [ModuloSistema.REPORTE_DESPACHO]: '/reporte-despacho'
    };

    return rutas[modulo] ?? null;
  }

  private resetPantallas(): void {
    this.mostrarUsuarios = false;
    this.mostrarDestinos = false;
    this.mostrarVias = false;
    this.mostrarVariedades = false;
    this.mostrarNavieras = false;
    this.mostrarRoles = false;
    this.mostrarSituaciones = false;
    this.mostrarProductos = false;
    this.mostrarPuertosLlegada = false;
    this.mostrarAuditoria = false;
    this.mostrarPerfilUsuario = false;
    this.mostrarClientes = false;
    this.mostrarRegistroDespacho = false;
    this.mostrarReporteDespacho = false;
    this.mostrarOperadoresLogisticos = false;
  }

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router,
    destroyRef: DestroyRef
  ) {
    this.isAuthenticated = this.tokenService.estaVigente();

    if (this.isAuthenticated && this.router.url === '/login') {
      void this.router.navigate(['/inicio']);
    }

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(destroyRef)
      )
      .subscribe(() => {
        this.isAuthenticated = this.tokenService.estaVigente();
      });

    if (this.isAuthenticated) {
      const expiracion = this.tokenService.obtenerPayload()?.exp;
      if (expiracion) {
        setTimeout(() => {
          localStorage.removeItem('token');
          this.isAuthenticated = false;
          this.menuVisible = true;
          this.resetPantallas();
        }, Math.max(0, expiracion * 1000 - Date.now()));
      }
    }

    this.authService.sesion$
      .pipe(takeUntilDestroyed(destroyRef))
      .subscribe((sesion) => {
        if (!sesion && this.tokenService.estaVigente()) {
          this.isAuthenticated = true;
          return;
        }

        this.isAuthenticated = sesion !== null
          && this.tokenService.estaVigente();

        if (!sesion || !this.isAuthenticated) {
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

