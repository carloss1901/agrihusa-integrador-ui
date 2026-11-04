import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { finalize } from 'rxjs';

import { AgrihusaButtonComponent } from '../../../../shared/components/agrihusa-button/agrihusa-button.component';
import { ComunControllerService } from '../../../../api/api/services/comun-controller.service';
import { Cliente } from '../../../../core/models/cliente.model';
import { ClienteService } from '../../../../core/services/cliente.service';
import { Destino } from '../../../../core/models/destino.model';
import { DestinoService } from '../../../../core/services/destino.service';
import { Naviera } from '../../../../core/models/naviera.model';
import { NavieraService } from '../../../../core/services/naviera.service';
import { OperadorLogistico } from '../../../../core/models/operador-logistico.model';
import { OperadorLogisticoService } from '../../../../core/services/operador-logistico.service';
import { Producto } from '../../../../core/models/producto.model';
import { ProductoService } from '../../../../core/services/producto.service';
import { PuertoLlegada } from '../../../../core/models/puerto-llegada.model';
import { PuertoLlegadaService } from '../../../../core/services/puerto-llegada.service';
import { Situacion } from '../../../../core/models/situacion.model';
import { SituacionService } from '../../../../core/services/situacion.service';
import { Variedad } from '../../../../core/models/variedad.model';
import { Via } from '../../../../core/models/via.model';
import { ViaService } from '../../../../core/services/via.service';
import {
  Despacho,
  DespachoFormData,
  UnidadMedidaDespacho
} from '../../../../core/models/despacho.model';
import { DespachoService } from '../../../../core/services/despacho.service';
import { AlertService } from '../../../../core/services/alert.service';

type NombreControl =
  | 'fechaDespacho'
  | 'fechaEstimadaLlegada'
  | 'clienteId'
  | 'navieraId'
  | 'destinoId'
  | 'operadorLogisticoId'
  | 'puertoLlegadaId'
  | 'productoId'
  | 'variedadId'
  | 'viaId'
  | 'situacionId'
  | 'cantidad'
  | 'unidadMedida'
  | 'numeroContenedor'
  | 'observaciones';

interface UnidadMedidaOption {
  valor: UnidadMedidaDespacho;
  descripcion: string;
}

@Component({
  selector: 'app-modal-despacho',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    AgrihusaButtonComponent
  ],
  templateUrl:
    './modal-despacho.component.html',
  styleUrls: [
    './modal-despacho.component.scss'
  ]
})
export class ModalDespachoComponent
  implements OnInit {
  @Input() titleModal = '';
  @Input() data: Despacho | null = null;
  @Input() clientes: Cliente[] = [];
  @Input() productos: Producto[] = [];
  @Input() situaciones: Situacion[] = [];
  @Input() navieras: Naviera[] = [];
  @Input() destinos: Destino[] = [];
  @Input() operadores: OperadorLogistico[] = [];
  @Input() puertos: PuertoLlegada[] = [];
  @Input() vias: Via[] = [];
  @Input() catalogoVariedades: Variedad[] = [];

  variedades: Variedad[] = [];
  private variedadesCatalogo: Variedad[] = [];

  submitted = false;
  guardando = false;

  readonly unidadesMedida: UnidadMedidaOption[] = [
    {
      valor: UnidadMedidaDespacho.CAJAS,
      descripcion: 'CAJAS'
    },
    {
      valor: UnidadMedidaDespacho.KILOGRAMOS,
      descripcion: 'KILOGRAMOS'
    },
    {
      valor: UnidadMedidaDespacho.TONELADAS,
      descripcion: 'TONELADAS'
    },
    {
      valor: UnidadMedidaDespacho.PALETS,
      descripcion: 'PALETS'
    }
  ];

  readonly formulario = new FormGroup({
    fechaDespacho: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    fechaEstimadaLlegada: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    clienteId: new FormControl<number | null>(
      null,
      {
        validators: [Validators.required]
      }
    ),
    navieraId: new FormControl<number | null>(
      null,
      {
        validators: [Validators.required]
      }
    ),
    destinoId: new FormControl<number | null>(
      null,
      {
        validators: [Validators.required]
      }
    ),
    operadorLogisticoId:
      new FormControl<number | null>(
        null,
        {
          validators: [Validators.required]
        }
      ),
    puertoLlegadaId:
      new FormControl<number | null>(
        null,
        {
          validators: [Validators.required]
        }
      ),
    productoId: new FormControl<number | null>(
      null,
      {
        validators: [Validators.required]
      }
    ),
    variedadId: new FormControl<number | null>(
      null,
      {
        validators: [Validators.required]
      }
    ),
    viaId: new FormControl<number | null>(
      null,
      {
        validators: [Validators.required]
      }
    ),
    situacionId: new FormControl<number | null>(
      null,
      {
        validators: [Validators.required]
      }
    ),
    cantidad: new FormControl<number | null>(
      null,
      {
        validators: [
          Validators.required,
          Validators.min(0.01)
        ]
      }
    ),
    unidadMedida:
      new FormControl<UnidadMedidaDespacho | null>(
        null,
        {
          validators: [Validators.required]
        }
      ),
    numeroContenedor: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20),
        Validators.pattern(/^[A-Za-z0-9-]+$/)
      ]
    }),
    observaciones: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.maxLength(500)
      ]
    })
  });

  constructor(
    public activeModal: NgbActiveModal,
    private clienteService: ClienteService,
    private navieraService: NavieraService,
    private destinoService: DestinoService,
    private operadorService:
      OperadorLogisticoService,
    private puertoService: PuertoLlegadaService,
    private productoService: ProductoService,
    private viaService: ViaService,
    private situacionService: SituacionService,
    private despachoService: DespachoService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.variedadesCatalogo = this.catalogoVariedades;
    this.configurarCambioProducto();

    if (!this.data) {
      return;
    }

    this.cargarVariedades(
      this.data.productoId,
      false
    );

    this.formulario.patchValue(
      {
        fechaDespacho: this.data.fechaDespacho,
        fechaEstimadaLlegada:
          this.data.fechaEstimadaLlegada,
        clienteId: this.data.clienteId,
        navieraId: this.data.navieraId,
        destinoId: this.data.destinoId,
        operadorLogisticoId:
          this.data.operadorLogisticoId,
        puertoLlegadaId:
          this.data.puertoLlegadaId,
        productoId: this.data.productoId,
        variedadId: this.data.variedadId,
        viaId: this.data.viaId,
        situacionId: this.data.situacionId,
        cantidad: this.data.cantidad,
        unidadMedida: this.data.unidadMedida,
        numeroContenedor:
          this.data.numeroContenedor,
        observaciones: this.data.observaciones
      },
      {
        emitEvent: false
      }
    );
  }

  onGuardar(): void {
    this.submitted = true;
    this.formulario.markAllAsTouched();

    if (this.formulario.invalid) {
      return;
    }

    const value = this.formulario.getRawValue();

    if (
      value.fechaEstimadaLlegada <
      value.fechaDespacho
    ) {
      window.alert(
        'La fecha estimada de llegada no puede ' +
        'ser anterior a la fecha de despacho.'
      );

      return;
    }

    if (
      value.clienteId === null ||
      value.navieraId === null ||
      value.destinoId === null ||
      value.operadorLogisticoId === null ||
      value.puertoLlegadaId === null ||
      value.productoId === null ||
      value.variedadId === null ||
      value.viaId === null ||
      value.situacionId === null ||
      value.cantidad === null ||
      value.unidadMedida === null
    ) {
      return;
    }

    const resultado: DespachoFormData = {
      fechaDespacho: value.fechaDespacho,
      fechaEstimadaLlegada:
        value.fechaEstimadaLlegada,
      clienteId: value.clienteId,
      navieraId: value.navieraId,
      destinoId: value.destinoId,
      operadorLogisticoId:
        value.operadorLogisticoId,
      puertoLlegadaId: value.puertoLlegadaId,
      productoId: value.productoId,
      variedadId: value.variedadId,
      viaId: value.viaId,
      situacionId: value.situacionId,
      cantidad: value.cantidad,
      unidadMedida: value.unidadMedida,
      numeroContenedor:
        value.numeroContenedor.trim(),
      observaciones:
        value.observaciones.trim()
    };

    this.guardando = true;

    const request = this.data
      ? this.despachoService.actualizar(this.data.id, resultado)
      : this.despachoService.crear(resultado);

    request
      .pipe(finalize(() => { this.guardando = false; }))
      .subscribe({
        next: (response) => {
          this.alertService.success(response.message!);
          this.activeModal.close(true);
        },
        error: (error: HttpErrorResponse) => {
          this.alertService.error(
            (error.error as { message?: string })?.message ??
              'No se pudo guardar el despacho.'
          );
        }
      });
  }

  onCerrarModal(): void {
    if (this.guardando) {
      return;
    }

    this.activeModal.dismiss();
  }

  controlInvalido(
    nombreControl: NombreControl
  ): boolean {
    const control =
      this.formulario.controls[nombreControl];

    return (
      control.invalid &&
      (control.touched || this.submitted)
    );
  }

  private configurarCambioProducto(): void {
    this.formulario.controls.productoId
      .valueChanges
      .subscribe((productoId) => {
        this.formulario.controls.variedadId
          .setValue(null);

        this.cargarVariedades(productoId);
      });
  }

  private cargarVariedades(
    productoId: number | null,
    soloActivas = true
  ): void {
    this.variedades = [];

    if (productoId === null) {
      return;
    }

    this.variedades = this.variedadesCatalogo.filter((variedad) =>
      variedad.productoId === productoId &&
      (soloActivas ? variedad.activo : true)
    );

    const variedadActual = this.formulario.controls.variedadId.value;
    const variedadSeleccionada = this.variedades.find(
      (variedad) => variedad.id === variedadActual
    ) ?? this.variedades[0];

    this.formulario.controls.variedadId.setValue(
      variedadSeleccionada?.id ?? null,
      { emitEvent: false }
    );
  }

}
