import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  NavigationEnd,
  Router,
  RouterOutlet
} from '@angular/router';
import { filter } from 'rxjs';

import {
  AccionPermiso,
  ModuloSistema
} from './core/models/permiso.model';
import { AuthService } from './core/services/auth.service';
import { TokenService } from './core/services/token.service';
import { HeaderComponent } from './features/header/header.component';
import {
  MenuComponent,
  MenuItem
} from './features/menu/menu.component';
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

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router,
    destroyRef: DestroyRef
  ) {
    this.isAuthenticated =
      this.tokenService.estaVigente();

    this.router.events
      .pipe(
        filter(
          (event) =>
            event instanceof NavigationEnd
        ),
        takeUntilDestroyed(destroyRef)
      )
      .subscribe(() => {
        this.isAuthenticated =
          this.tokenService.estaVigente();
      });

    this.programarExpiracion();

    this.authService.sesion$
      .pipe(takeUntilDestroyed(destroyRef))
      .subscribe((sesion) => {
        if (
          !sesion &&
          this.tokenService.estaVigente()
        ) {
          this.isAuthenticated = true;
          return;
        }

        this.isAuthenticated =
          sesion !== null &&
          this.tokenService.estaVigente();

        if (!this.isAuthenticated) {
          this.menuVisible = true;

          if (this.router.url !== '/login') {
            void this.router.navigate(['/login']);
          }

          return;
        }

        if (sesion?.debeCambiarPassword) {
          void this.router.navigate([
            '/perfil-usuario'
          ]);
          return;
        }

        if (this.router.url === '/login') {
          void this.router.navigate(['/inicio']);
        }
      });
  }

  toggleMenu(esCerrar: boolean): void {
    this.menuVisible = !esCerrar;
  }

  onLoginSuccess(): void {
    this.isAuthenticated = true;
    this.menuVisible = true;

    const sesion =
      this.authService.obtenerSesionActual();

    const destino = sesion?.debeCambiarPassword
      ? '/perfil-usuario'
      : '/inicio';

    void this.router.navigate([destino]);
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }

  onSelectMenu(item: MenuItem): void {
    const sesion =
      this.authService.obtenerSesionActual();

    if (
      sesion?.debeCambiarPassword &&
      item.modulo !==
        ModuloSistema.PERFIL_USUARIO
    ) {
      void this.router.navigate([
        '/perfil-usuario'
      ]);
      return;
    }

    const tieneAcceso =
      this.tokenService.tienePermiso(
        item.modulo,
        AccionPermiso.CONSULTAR
      );

    if (!tieneAcceso) {
      void this.router.navigate(['/inicio']);
      return;
    }

    const ruta = this.obtenerRuta(item.modulo);

    if (ruta) {
      void this.router.navigate([ruta]);
    }
  }

  private obtenerRuta(
    modulo: ModuloSistema
  ): string | null {
    const rutas: Partial<
      Record<ModuloSistema, string>
    > = {
      [ModuloSistema.ROLES]: '/roles',
      [ModuloSistema.USUARIOS]: '/usuarios',
      [ModuloSistema.CLIENTES]: '/clientes',
      [ModuloSistema.DESTINOS]: '/destinos',
      [ModuloSistema.VIAS]: '/vias',
      [ModuloSistema.VARIEDADES]:
        '/variedades',
      [ModuloSistema.NAVIERAS]: '/navieras',
      [ModuloSistema.PUERTOS_LLEGADA]:
        '/puertos-llegada',
      [ModuloSistema.OPERADORES_LOGISTICOS]:
        '/operadores-logisticos',
      [ModuloSistema.PRODUCTOS]: '/productos',
      [ModuloSistema.SITUACIONES]:
        '/situaciones',
      [ModuloSistema.REGISTRO_DESPACHO]:
        '/registro-despacho',
      [ModuloSistema.REPORTE_DESPACHO]:
        '/reporte-despacho',
      [ModuloSistema.BITACORA]: '/auditoria',
      [ModuloSistema.PERFIL_USUARIO]:
        '/perfil-usuario'
    };

    return rutas[modulo] ?? null;
  }

  private programarExpiracion(): void {
    if (!this.isAuthenticated) {
      return;
    }

    const expiracion =
      this.tokenService.obtenerPayload()?.exp;

    if (!expiracion) {
      return;
    }

    const tiempoRestante = Math.max(
      0,
      expiracion * 1000 - Date.now()
    );

    setTimeout(() => {
      this.authService.logout();
      this.isAuthenticated = false;
      this.menuVisible = true;
      void this.router.navigate(['/login']);
    }, tiempoRestante);
  }
}