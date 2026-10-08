import { CommonModule, UpperCasePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';

import {
  AccionPermiso,
  ModuloSistema
} from '../../core/models/permiso.model';
import { STORAGE_KEYS } from '../../core/constants/storage-keys.constant';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { TokenService } from '../../core/services/token.service';

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
export class MenuComponent implements OnInit {
  @Output() onToggleSideNav = new EventEmitter<boolean>();
  @Output() onSelectItem = new EventEmitter<MenuItem>();

  private readonly tokenService = inject(TokenService);
  private readonly localStorageService = inject(LocalStorageService);

  menuSeleccionadoId = 0;
  menuArrAgrihusa: MenuGroup[] = [];
  private readonly gruposAbiertos = new Set<number>();

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
        },
        {
          nombre: 'Operadores logísticos',
          codigo: 113,
          modulo: ModuloSistema.OPERADORES_LOGISTICOS
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
      nombreModulo: 'Módulo de Despacho',
      codigo: 5,
      subMenu: [
        {
          nombre: 'Registro de despacho',
          codigo: 115,
          modulo: ModuloSistema.REGISTRO_DESPACHO
        },
        {
          nombre: 'Reporte de despacho',
          codigo: 116,
          modulo: ModuloSistema.REPORTE_DESPACHO
        },
        {
          nombre: 'Situaciones',
          codigo: 114,
          modulo: ModuloSistema.SITUACIONES
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
    this.menuArrAgrihusa = this.menuCompleto
      .map((grupo) => ({
        ...grupo,
        subMenu: grupo.subMenu.filter((item) =>
          this.tokenService.tienePermiso(
            item.modulo,
            AccionPermiso.CONSULTAR
          )
        )
      }))
      .filter((grupo) => grupo.subMenu.length > 0);

    this.menuArrAgrihusa.forEach((grupo) =>
      this.gruposAbiertos.add(grupo.codigo)
    );
  }

  ngOnInit(): void {
    const codigoGuardado = this.localStorageService.obtener<number>(
      STORAGE_KEYS.MENU_SELECCIONADO
    );

    if (codigoGuardado === null) {
      return;
    }

    const menuGuardado = this.menuArrAgrihusa
      .flatMap((grupo) => grupo.subMenu)
      .find((item) => item.codigo === codigoGuardado);

    if (menuGuardado) {
      this.menuSeleccionadoId = menuGuardado.codigo;
      this.onSelectItem.emit(menuGuardado);
    }
  }

  toggleMenu(esCerrar: boolean): void {
    this.onToggleSideNav.emit(esCerrar);
  }

  onClickMenu(subItem: MenuItem): void {
    this.menuSeleccionadoId = subItem.codigo;
    this.localStorageService.guardar(
      STORAGE_KEYS.MENU_SELECCIONADO,
      subItem.codigo
    );
    this.onSelectItem.emit(subItem);
  }

  estaGrupoAbierto(codigo: number): boolean {
    return this.gruposAbiertos.has(codigo);
  }

  alternarGrupo(codigo: number): void {
    if (this.gruposAbiertos.has(codigo)) {
      this.gruposAbiertos.delete(codigo);
    } else {
      this.gruposAbiertos.add(codigo);
    }
  }
}
