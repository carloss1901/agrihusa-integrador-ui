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
import { forkJoin } from 'rxjs';

import { AgrihusaButtonComponent } from '../../../../shared/components/agrihusa-button/agrihusa-button.component';
import { Cliente } from '../../../clientes/models/cliente.model';
import { ClienteService } from '../../../clientes/services/cliente.service';
import { Producto } from '../../../productos/models/producto.model';
import { ProductoService } from '../../../productos/services/producto.service';
import { Situacion } from '../../../situaciones/models/situacion.model';
import { SituacionService } from '../../../situaciones/services/situacion.service';
import { Variedad } from '../../../variedades/models/variedad.model';
import { VariedadService } from '../../../variedades/services/variedad.service';
import { Via } from '../../../vias/models/via.model';
import { ViaService } from '../../../vias/services/via.service';
import { ReporteDespachoFilter } from '../../models/reporte-despacho.model';

interface EstadoOption {
  valor: boolean;
  descripcion: string;
}

@Component({
  selector: 'app-filtro-reporte-despacho',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbAccordionModule,
    NgSelectModule,
    AgrihusaButtonComponent
  ],
  templateUrl:
    './filtro-reporte-despacho.component.html'
})
export class FiltroReporteDespachoComponent
  implements OnInit {
  @Output()
  buscar =
    new EventEmitter<ReporteDespachoFilter>();

  @Output()
  limpiar = new EventEmitter<void>();

  clientes: Cliente[] = [];
  productos: Producto[] = [];
  variedades: Variedad[] = [];
  vias: Via[] = [];
  situaciones: Situacion[] = [];

  private todasVariedades: Variedad[] = [];

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
    fechaDesde: new FormControl('', {
      nonNullable: true
    }),
    fechaHasta: new FormControl('', {
      nonNullable: true
    }),
    clienteId: new FormControl<number | null>(null),
    productoId: new FormControl<number | null>(null),
    variedadId: new FormControl<number | null>(null),
    viaId: new FormControl<number | null>(null),
    situacionId: new FormControl<number | null>(null),
    estado: new FormControl<boolean | null>(null)
  });

  constructor(
    private clienteService: ClienteService,
    private productoService: ProductoService,
    private variedadService: VariedadService,
    private viaService: ViaService,
    private situacionService: SituacionService
  ) {}

  ngOnInit(): void {
    this.cargarCatalogos();
    this.configurarCambioProducto();
  }

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

    const filtro: ReporteDespachoFilter = {};

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

    if (value.variedadId !== null) {
      filtro.variedadId = value.variedadId;
    }

    if (value.viaId !== null) {
      filtro.viaId = value.viaId;
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
      fechaDesde: '',
      fechaHasta: '',
      clienteId: null,
      productoId: null,
      variedadId: null,
      viaId: null,
      situacionId: null,
      estado: null
    });

    this.variedades = [];
    this.limpiar.emit();
  }

  private configurarCambioProducto(): void {
    this.formulario.controls.productoId
      .valueChanges
      .subscribe((productoId) => {
        this.formulario.controls.variedadId
          .setValue(null);

        this.variedades = productoId === null
          ? []
          : this.todasVariedades.filter(
              (variedad) =>
                variedad.productoId === productoId
            );
      });
  }

  private cargarCatalogos(): void {
    const consulta = {
      page: 1,
      pageSize: 1000
    };

    forkJoin({
      clientes:
        this.clienteService.listar(consulta),
      productos:
        this.productoService.listar(consulta),
      variedades:
        this.variedadService.listar(consulta),
      vias:
        this.viaService.listar(consulta),
      situaciones:
        this.situacionService.listar(consulta)
    }).subscribe((catalogos) => {
      this.clientes = catalogos.clientes.items;
      this.productos = catalogos.productos.items;
      this.todasVariedades =
        catalogos.variedades.items;
      this.vias = catalogos.vias.items;
      this.situaciones =
        catalogos.situaciones.items;
    });
  }
}