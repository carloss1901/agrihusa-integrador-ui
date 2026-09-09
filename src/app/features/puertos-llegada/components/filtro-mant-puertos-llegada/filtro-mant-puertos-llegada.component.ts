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
import { PuertoLlegadaFilter } from '../../models/puerto-llegada.model';

interface EstadoOption {
  valor: boolean;
  descripcion: string;
}

@Component({
  selector: 'app-filtro-mant-puertos-llegada',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbAccordionModule,
    NgSelectModule,
    AgrihusaButtonComponent
  ],
  templateUrl:
    './filtro-mant-puertos-llegada.component.html'
})
export class FiltroMantPuertosLlegadaComponent {
  @Output()
  buscar = new EventEmitter<PuertoLlegadaFilter>();

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
    pais: new FormControl('', {
      nonNullable: true
    }),
    estado: new FormControl<boolean | null>(null)
  });

  onBuscar(): void {
    const value = this.formulario.getRawValue();
    const filtro: PuertoLlegadaFilter = {};

    if (value.texto.trim()) {
      filtro.texto = value.texto.trim();
    }

    if (value.pais.trim()) {
      filtro.pais = value.pais.trim();
    }

    if (value.estado !== null) {
      filtro.estado = value.estado;
    }

    this.buscar.emit(filtro);
  }

  onLimpiar(): void {
    this.formulario.reset({
      texto: '',
      pais: '',
      estado: null
    });

    this.limpiar.emit();
  }
}