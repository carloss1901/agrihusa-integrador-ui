import { Component, inject } from '@angular/core';
import { CanActivateFn, Router, Routes } from '@angular/router';

import { TokenService } from './core/services/token.service';
import { LoginComponent } from './features/login/login.component';
import { MantenimientoRolesHttpComponent } from './features/roles/views/mantenimiento-roles/mantenimiento-roles-http.component';
import { MantenimientoUsuariosComponent } from './features/usuarios/views/mantenimiento-usuarios/mantenimiento-usuarios.component';
import { MantenimientoDestinosComponent } from './features/destinos/views/mantenimiento-destinos/mantenimiento-destinos.component';
import { MantenimientoViasComponent } from './features/vias/views/mantenimiento-vias/mantenimiento-vias.component';
import { MantenimientoVariedadesComponent } from './features/variedades/views/mantenimiento-variedades/mantenimiento-variedades.component';
import { MantenimientoNavierasComponent } from './features/navieras/views/mantenimiento-navieras/mantenimiento-navieras.component';
import { MantenimientoPuertosLlegadaComponent } from './features/puertos-llegada/views/mantenimiento-puertos-llegada/mantenimiento-puertos-llegada.component';
import { AuditoriaComponent } from './features/auditoria/views/auditoria/auditoria.component';
import { PerfilUsuarioComponent } from './features/perfil-usuario/views/perfil-usuario/perfil-usuario.component';
import { MantenimientoClientesComponent } from './features/clientes/views/mantenimiento-clientes/mantenimiento-clientes.component';
import { MantenimientoOperadoresLogisticosComponent } from './features/operadores-logisticos/views/mantenimiento-operadores-logisticos/mantenimiento-operadores-logisticos.component';
import { MantenimientoProductosComponent } from './features/productos/views/mantenimiento-productos/mantenimiento-productos.component';
import { MantenimientoSituacionesComponent } from './features/situaciones/views/mantenimiento-situaciones/mantenimiento-situaciones.component';
import { RegistroDespachoComponent } from './features/registro-despacho/views/registro-despacho/registro-despacho.component';
import { ReporteDespachoComponent } from './features/reporte-despacho/views/reporte-despacho/reporte-despacho.component';

@Component({
  standalone: true,
  template: `
    <section class="agrihusaApp-content_placeholder">
      <p class="eyebrow">Layout base</p>
      <h1>Seleccione una opción del menú</h1>
      <p>Seleccione un módulo para comenzar.</p>
    </section>
  `
})
class InicioComponent {}

export const authGuard: CanActivateFn = () => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  return tokenService.estaVigente()
    ? true
    : router.createUrlTree(['/login']);
};

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'inicio', canActivate: [authGuard], component: InicioComponent },
  { path: 'roles', canActivate: [authGuard], component: MantenimientoRolesHttpComponent },
  { path: 'usuarios', canActivate: [authGuard], component: MantenimientoUsuariosComponent },
  { path: 'destinos', canActivate: [authGuard], component: MantenimientoDestinosComponent },
  { path: 'vias', canActivate: [authGuard], component: MantenimientoViasComponent },
  { path: 'variedades', canActivate: [authGuard], component: MantenimientoVariedadesComponent },
  { path: 'navieras', canActivate: [authGuard], component: MantenimientoNavierasComponent },
  { path: 'puertos-llegada', canActivate: [authGuard], component: MantenimientoPuertosLlegadaComponent },
  { path: 'auditoria', canActivate: [authGuard], component: AuditoriaComponent },
  { path: 'perfil-usuario', canActivate: [authGuard], component: PerfilUsuarioComponent },
  { path: 'clientes', canActivate: [authGuard], component: MantenimientoClientesComponent },
  { path: 'operadores-logisticos', canActivate: [authGuard], component: MantenimientoOperadoresLogisticosComponent },
  { path: 'productos', canActivate: [authGuard], component: MantenimientoProductosComponent },
  { path: 'situaciones', canActivate: [authGuard], component: MantenimientoSituacionesComponent },
  { path: 'registro-despacho', canActivate: [authGuard], component: RegistroDespachoComponent },
  { path: 'reporte-despacho', canActivate: [authGuard], component: ReporteDespachoComponent },
  { path: '', pathMatch: 'full', redirectTo: 'inicio' },
  { path: '**', redirectTo: 'inicio' }
];
