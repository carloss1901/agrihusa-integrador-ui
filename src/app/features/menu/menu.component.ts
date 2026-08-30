import { CommonModule, UpperCasePipe } from '@angular/common';
import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';

interface MenuItem {
  nombre: string;
  codigo: number;
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
  @Output() onSelectItem = new EventEmitter<string>();

  menuSeleccionadoId = 101;
  menuArrAgrihusa: MenuGroup[] = [
    {
      nombreModulo: 'Modulo de Administracion',
      codigo: 1,
      subMenu: [
        { nombre: 'Usuarios', codigo: 101 },
        { nombre: 'Tablas maestras', codigo: 102 },
        { nombre: 'Clientes', codigo: 103 }
      ]
    },
    {
      nombreModulo: 'Modulo de Destinos',
      codigo: 2,
      subMenu: [
        { nombre: 'Destinos', codigo: 104 },
        { nombre: 'Vias', codigo: 105 },
        { nombre: 'Transportistas', codigo: 106 }
      ]
    },
    {
      nombreModulo: 'Modulo de Productos',
      codigo: 3,
      subMenu: [
        { nombre: 'Productos', codigo: 107 },
        { nombre: 'Variedades', codigo: 108 }
      ]
    },
    {
      nombreModulo: 'Modulo de Auditoría',
      codigo: 4,
      subMenu: [
        { nombre: 'Auditoría', codigo: 109 }
      ]
    }
  ];

  toggleMenu(esCerrar: boolean): void {
    this.onToggleSideNav.emit(esCerrar);
  }

  onClickMenu(subItem: MenuItem): void {
    this.menuSeleccionadoId = subItem.codigo;
    this.onSelectItem.emit(subItem.nombre);
  }
}
