import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Output
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

import { AgrihusaButtonComponent } from '../../../../shared/components/agrihusa-button/agrihusa-button.component';
import { RolFilter } from '../../models/rol.model';

interface EstadoOption {
  valor: boolean;
  descripcion: string;
}

@Component({
  selector: 'app-filtro-roles',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbAccordionModule,
    NgSelectModule,
    AgrihusaButtonComponent
  ],
  templateUrl: './filtro-roles.component.html'
})
export class FiltroRolesComponent {
  @Output() buscar = new EventEmitter<RolFilter>();
  @Output() limpiar = new EventEmitter<void>();

  readonly estados: EstadoOption[] = [
    {
      valor: true,
      descripcion: 'ACTIVO'
    },
    {
      valor: false,
      descripcion: 'INACTIVO'
    }
  ];

  readonly formulario = new FormGroup({
    nombre: new FormControl('', {
      nonNullable: true
    }),
    estado: new FormControl<boolean | null>(null)
  });

  onBuscar(): void {
    const value = this.formulario.getRawValue();
    const filtro: RolFilter = {};

    if (value.nombre.trim()) {
      filtro.nombre = value.nombre.trim();
    }

    if (value.estado !== null) {
      filtro.estado = value.estado;
    }

    this.buscar.emit(filtro);
  }

  onLimpiar(): void {
    this.formulario.reset({
      nombre: '',
      estado: null
    });

    this.limpiar.emit();
  }
}