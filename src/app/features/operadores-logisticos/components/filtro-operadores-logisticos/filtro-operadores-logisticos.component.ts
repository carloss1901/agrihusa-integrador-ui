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
import { OperadorLogisticoFilter } from '../../models/operador-logistico.model';

interface EstadoOption {
  valor: boolean;
  descripcion: string;
}

@Component({
  selector: 'app-filtro-operadores-logisticos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbAccordionModule,
    NgSelectModule,
    AgrihusaButtonComponent
  ],
  templateUrl:
    './filtro-operadores-logisticos.component.html'
})
export class FiltroOperadoresLogisticosComponent {
  @Output()
  buscar =
    new EventEmitter<OperadorLogisticoFilter>();

  @Output()
  limpiar = new EventEmitter<void>();

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
    texto: new FormControl('', {
      nonNullable: true
    }),
    estado: new FormControl<boolean | null>(null)
  });

  onBuscar(): void {
    const value = this.formulario.getRawValue();
    const filtro: OperadorLogisticoFilter = {};

    if (value.texto.trim()) {
      filtro.texto = value.texto.trim();
    }

    if (value.estado !== null) {
      filtro.estado = value.estado;
    }

    this.buscar.emit(filtro);
  }

  onLimpiar(): void {
    this.formulario.reset({
      texto: '',
      estado: null
    });

    this.limpiar.emit();
  }
}