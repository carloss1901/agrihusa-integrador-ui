import { CommonModule, UpperCasePipe } from '@angular/common';
import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Output,
  ViewEncapsulation
} from '@angular/core';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  AccionPermiso,
  ModuloSistema
} from '../../core/models/permiso.model';
import {
  forkJoin,
  map,
  of,
  switchMap
} from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

export interface MenuItem {
  nombre: string;
  codigo: number;
  modulo: ModuloSistema;
}

interface MenuGroup {
  nombreModulo: string;
  codigo: number;
  subMenu: MenuItem[];
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, UpperCasePipe],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MenuComponent {
  @Output() onToggleSideNav = new EventEmitter<boolean>();
  @Output() onSelectItem = new EventEmitter<MenuItem>();

  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  menuSeleccionadoId = 0;
  menuArrAgrihusa: MenuGroup[] = [];

  private readonly menuCompleto: MenuGroup[] = [
    {
      nombreModulo: 'Módulo de Administración',
      codigo: 1,
      subMenu: [
        {
          nombre: 'Roles',
          codigo: 111,
          modulo: ModuloSistema.ROLES
        },
        {
          nombre: 'Usuarios',
          codigo: 101,
          modulo: ModuloSistema.USUARIOS
        },
        {
          nombre: 'Clientes',
          codigo: 103,
          modulo: ModuloSistema.CLIENTES
        }
      ]
    },
    {
      nombreModulo: 'Módulo de Destinos',
      codigo: 2,
      subMenu: [
        {
          nombre: 'Destinos',
          codigo: 104,
          modulo: ModuloSistema.DESTINOS
        },
        {
          nombre: 'Vías',
          codigo: 105,
          modulo: ModuloSistema.VIAS
        },
        {
          nombre: 'Navieras',
          codigo: 106,
          modulo: ModuloSistema.NAVIERAS
        },
        {
          nombre: 'Puertos de llegada',
          codigo: 110,
          modulo: ModuloSistema.PUERTOS_LLEGADA
        }
      ]
    },
    {
      nombreModulo: 'Módulo de Productos',
      codigo: 3,
      subMenu: [
        {
          nombre: 'Productos',
          codigo: 107,
          modulo: ModuloSistema.PRODUCTOS
        },
        {
          nombre: 'Variedades',
          codigo: 108,
          modulo: ModuloSistema.VARIEDADES
        }
      ]
    },
    {
      nombreModulo: 'Módulo de Seguridad',
      codigo: 4,
      subMenu: [
        {
          nombre: 'Perfil de usuario',
          codigo: 112,
          modulo: ModuloSistema.PERFIL_USUARIO
        },
        {
          nombre: 'Bitácora',
          codigo: 109,
          modulo: ModuloSistema.BITACORA
        }
      ]
    }
  ];

  constructor() {
    this.authService.sesion$
      .pipe(
        switchMap((sesion) => {
          this.menuSeleccionadoId = 0;

          if (!sesion) {
            return of<MenuGroup[]>([]);
          }

          if (sesion.debeCambiarPassword) {
            const grupoPerfil = this.menuCompleto.find(
              (grupo) =>
                grupo.subMenu.some(
                  (item) =>
                    item.modulo ===
                    ModuloSistema.PERFIL_USUARIO
                )
            );

            const itemPerfil =
              grupoPerfil?.subMenu.find(
                (item) =>
                  item.modulo ===
                  ModuloSistema.PERFIL_USUARIO
              );

            if (!grupoPerfil || !itemPerfil) {
              return of<MenuGroup[]>([]);
            }

            return of<MenuGroup[]>([
              {
                ...grupoPerfil,
                subMenu: [itemPerfil]
              }
            ]);
          }

          const gruposConPermisos =
            this.menuCompleto.map((grupo) =>
              forkJoin(
                grupo.subMenu.map((item) =>
                  this.authService
                    .tienePermiso(
                      item.modulo,
                      AccionPermiso.CONSULTAR
                    )
                    .pipe(
                      map((permitido) =>
                        permitido ? item : null
                      )
                    )
                )
              ).pipe(
                map((items) => ({
                  ...grupo,
                  subMenu: items.filter(
                    (item): item is MenuItem =>
                      item !== null
                  )
                }))
              )
            );

          return forkJoin(gruposConPermisos).pipe(
            map((grupos) =>
              grupos.filter(
                (grupo) => grupo.subMenu.length > 0
              )
            )
          );
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((gruposPermitidos) => {
        this.menuArrAgrihusa = gruposPermitidos;
      });
  }

  toggleMenu(esCerrar: boolean): void {
    this.onToggleSideNav.emit(esCerrar);
  }

  onClickMenu(subItem: MenuItem): void {
    this.menuSeleccionadoId = subItem.codigo;
    this.onSelectItem.emit(subItem);
  }
}
