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
  OperadorLogistico,
  OperadorLogisticoFormData
} from '../../models/operador-logistico.model';

type NombreControl =
  | 'ruc'
  | 'razonSocial'
  | 'nombreComercial'
  | 'contacto'
  | 'correo'
  | 'telefono'
  | 'direccion';

@Component({
  selector: 'app-modal-operador-logistico',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AgrihusaButtonComponent
  ],
  templateUrl:
    './modal-operador-logistico.component.html',
  styleUrls: [
    './modal-operador-logistico.component.scss'
  ]
})
export class ModalOperadorLogisticoComponent
  implements OnInit {
  @Input() titleModal = '';
  @Input() data: OperadorLogistico | null = null;

  submitted = false;

  readonly formulario = new FormGroup({
    ruc: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern(/^[0-9]{11}$/)
      ]
    }),
    razonSocial: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.maxLength(150)
      ]
    }),
    nombreComercial: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(120)]
    }),
    contacto: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(120)]
    }),
    correo: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.email,
        Validators.maxLength(120)
      ]
    }),
    telefono: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.maxLength(20),
        Validators.pattern(/^[0-9+\s()-]*$/)
      ]
    }),
    direccion: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(200)]
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
      ruc: this.data.ruc,
      razonSocial: this.data.razonSocial,
      nombreComercial: this.data.nombreComercial,
      contacto: this.data.contacto,
      correo: this.data.correo,
      telefono: this.data.telefono,
      direccion: this.data.direccion
    });
  }

  onGuardar(): void {
    this.submitted = true;
    this.formulario.markAllAsTouched();

    if (this.formulario.invalid) {
      return;
    }

    const value = this.formulario.getRawValue();

    const resultado: OperadorLogisticoFormData = {
      ruc: value.ruc.trim(),
      razonSocial: value.razonSocial.trim(),
      nombreComercial:
        value.nombreComercial.trim(),
      contacto: value.contacto.trim(),
      correo: value.correo.trim(),
      telefono: value.telefono.trim(),
      direccion: value.direccion.trim()
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