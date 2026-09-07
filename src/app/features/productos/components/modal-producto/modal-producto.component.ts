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

import { AgrihusaButtonComponent } from '../../../../shared/components/agrihusa-button/agrihusa-button.component';
import {
  Producto,
  ProductoFormData
} from '../../models/producto.model';

type NombreControl =
  | 'codigo'
  | 'nombre'
  | 'descripcion';

@Component({
  selector: 'app-modal-producto',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AgrihusaButtonComponent
  ],
  templateUrl: './modal-producto.component.html',
  styleUrls: ['./modal-producto.component.scss']
})
export class ModalProductoComponent implements OnInit {
  @Input() titleModal = '';
  @Input() data: Producto | null = null;

  submitted = false;

  readonly formulario = new FormGroup({
    codigo: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
        Validators.pattern(/^[A-Za-z0-9-]+$/)
      ]
    }),
    nombre: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.maxLength(100),
        Validators.pattern(
          /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9\s.'()-]+$/
        )
      ]
    }),
    descripcion: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.maxLength(250),
        Validators.pattern(
          /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9\s.,;:'"()/-]+$/
        )
      ]
    })
  });

  constructor(
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    if (!this.data) {
      return;
    }

    this.formulario.patchValue({
      codigo: this.data.codigo,
      nombre: this.data.nombre,
      descripcion: this.data.descripcion
    });
  }

  onGuardar(): void {
    this.submitted = true;
    this.formulario.markAllAsTouched();

    if (this.formulario.invalid) {
      return;
    }

    const value = this.formulario.getRawValue();

    const resultado: ProductoFormData = {
      codigo: value.codigo.trim(),
      nombre: value.nombre.trim(),
      descripcion: value.descripcion.trim()
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
}