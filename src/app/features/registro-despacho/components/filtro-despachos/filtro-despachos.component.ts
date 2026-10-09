import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
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
import { Cliente } from '../../../../core/models/cliente.model';
import { Producto } from '../../../../core/models/producto.model';
import { Situacion } from '../../../../core/models/situacion.model';
import { DespachoFilter } from '../../../../core/models/despacho.model';

interface EstadoOption {
  valor: boolean;
  descripcion: string;
}

@Component({
  selector: 'app-filtro-despachos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbAccordionModule,
    NgSelectModule,
    AgrihusaButtonComponent
  ],
  templateUrl:
    './filtro-despachos.component.html'
})
export class FiltroDespachosComponent
  implements OnInit {
  @Output()
  buscar = new EventEmitter<DespachoFilter>();

  @Output()
  limpiar = new EventEmitter<void>();

  @Input() clientes: Cliente[] = [];
  @Input() productos: Producto[] = [];
  @Input() situaciones: Situacion[] = [];

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
    fechaDesde: new FormControl('', {
      nonNullable: true
    }),
    fechaHasta: new FormControl('', {
      nonNullable: true
    }),
    clienteId: new FormControl<number | null>(null),
    productoId: new FormControl<number | null>(null),
    situacionId: new FormControl<number | null>(null),
    estado: new FormControl<boolean | null>(null)
  });

  constructor() {}

  ngOnInit(): void {}

  onBuscar(): void {
    const value = this.formulario.getRawValue();

    if (
      value.fechaDesde &&
      value.fechaHasta &&
      value.fechaDesde > value.fechaHasta
    ) {
      window.alert(
        'La fecha desde no puede ser mayor que ' +
        'la fecha hasta.'
      );

      return;
    }

    const filtro: DespachoFilter = {};

    if (value.texto.trim()) {
      filtro.texto = value.texto.trim();
    }

    if (value.fechaDesde) {
      filtro.fechaDesde = value.fechaDesde;
    }

    if (value.fechaHasta) {
      filtro.fechaHasta = value.fechaHasta;
    }

    if (value.clienteId !== null) {
      filtro.clienteId = value.clienteId;
    }

    if (value.productoId !== null) {
      filtro.productoId = value.productoId;
    }

    if (value.situacionId !== null) {
      filtro.situacionId = value.situacionId;
    }

    if (value.estado !== null) {
      filtro.estado = value.estado;
    }

    this.buscar.emit(filtro);
  }

  onLimpiar(): void {
    this.formulario.reset({
      texto: '',
      fechaDesde: '',
      fechaHasta: '',
      clienteId: null,
      productoId: null,
      situacionId: null,
      estado: null
    });

    this.limpiar.emit();
  }

}
