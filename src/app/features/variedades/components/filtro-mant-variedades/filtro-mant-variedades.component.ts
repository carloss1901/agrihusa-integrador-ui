import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
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
import { Producto } from '../../../productos/models/producto.model';
import { ProductoService } from '../../../productos/services/producto.service';
import { VariedadFilter } from '../../models/variedad.model';

interface EstadoOption {
  valor: boolean;
  descripcion: string;
}

@Component({
  selector: 'app-filtro-mant-variedades',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbAccordionModule,
    NgSelectModule,
    AgrihusaButtonComponent
  ],
  templateUrl:
    './filtro-mant-variedades.component.html'
})
export class FiltroMantVariedadesComponent
  implements OnInit {
  @Output()
  buscar = new EventEmitter<VariedadFilter>();

  @Output()
  limpiar = new EventEmitter<void>();

  productos: Producto[] = [];

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
    productoId: new FormControl<number | null>(null),
    estado: new FormControl<boolean | null>(null)
  });

  constructor(
    private productoService: ProductoService
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  onBuscar(): void {
    const value = this.formulario.getRawValue();
    const filtro: VariedadFilter = {};

    if (value.texto.trim()) {
      filtro.texto = value.texto.trim();
    }

    if (value.productoId !== null) {
      filtro.productoId = value.productoId;
    }

    if (value.estado !== null) {
      filtro.estado = value.estado;
    }

    this.buscar.emit(filtro);
  }

  onLimpiar(): void {
    this.formulario.reset({
      texto: '',
      productoId: null,
      estado: null
    });

    this.limpiar.emit();
  }

  private cargarProductos(): void {
    this.productoService
      .listarActivos()
      .subscribe((productos) => {
        this.productos = productos;
      });
  }
}