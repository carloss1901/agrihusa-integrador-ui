import { CommonModule } from '@angular/common';
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

import { AgrihusaButtonComponent } from '../../../../shared/components/agrihusa-button/agrihusa-button.component';
import { Producto } from '../../../productos/models/producto.model';
import { ProductoService } from '../../../productos/services/producto.service';
import {
  Variedad,
  VariedadFormData
} from '../../models/variedad.model';

type NombreControl =
  | 'productoId'
  | 'nombre';

@Component({
  selector: 'app-modal-upsert-variedad',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    AgrihusaButtonComponent
  ],
  templateUrl:
    './modal-upsert-variedad.component.html',
  styleUrls: [
    './modal-upsert-variedad.component.scss'
  ]
})
export class ModalUpsertVariedadComponent
  implements OnInit {
  @Input() titleModal = '';
  @Input() data: Variedad | null = null;

  productos: Producto[] = [];
  submitted = false;

  readonly formulario = new FormGroup({
    productoId: new FormControl<number | null>(
      null,
      {
        validators: [Validators.required]
      }
    ),
    nombre: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.maxLength(100),
        Validators.pattern(
          /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9\s.'()-]+$/
        )
      ]
    })
  });

  constructor(
    public activeModal: NgbActiveModal,
    private productoService: ProductoService
  ) {}

  ngOnInit(): void {
    this.cargarProductos();

    if (!this.data) {
      return;
    }

    this.formulario.patchValue({
      productoId: this.data.productoId,
      nombre: this.data.nombre
    });
  }

  onGuardar(): void {
    this.submitted = true;
    this.formulario.markAllAsTouched();

    if (this.formulario.invalid) {
      return;
    }

    const value = this.formulario.getRawValue();

    if (value.productoId === null) {
      return;
    }

    const resultado: VariedadFormData = {
      productoId: value.productoId,
      nombre: value.nombre.trim()
    };

    this.activeModal.close(resultado);
  }

  onCerrarModal(): void {
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

  private cargarProductos(): void {
    this.productoService
      .listar({
        page: 1,
        pageSize: Number.MAX_SAFE_INTEGER
      })
      .subscribe((resultado) => {
        this.productos = this.data
          ? resultado.items
          : resultado.items.filter(
              (producto) => producto.activo
            );
      });
  }
}