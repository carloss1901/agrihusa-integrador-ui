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
  Naviera,
  NavieraFormData
} from '../../models/naviera.model';

type NombreControl =
  | 'codigo'
  | 'nombre'
  | 'pais'
  | 'contacto'
  | 'correo'
  | 'telefono'
  | 'sitioWeb';

@Component({
  selector: 'app-modal-upsert-naviera',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AgrihusaButtonComponent
  ],
  templateUrl:
    './modal-upsert-naviera.component.html',
  styleUrls: [
    './modal-upsert-naviera.component.scss'
  ]
})
export class ModalUpsertNavieraComponent
  implements OnInit {
  @Input() titleModal = '';
  @Input() data: Naviera | null = null;

  submitted = false;

  readonly formulario = new FormGroup({
    codigo: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(10),
        Validators.pattern(/^[A-Za-z0-9-]+$/)
      ]
    }),
    nombre: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.maxLength(120)
      ]
    }),
    pais: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.maxLength(80)
      ]
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
    sitioWeb: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.maxLength(200),
        Validators.pattern(/^https?:\/\/[^\s]+$/)
      ]
    })
  });

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    if (!this.data) {
      return;
    }

    this.formulario.patchValue({
      codigo: this.data.codigo,
      nombre: this.data.nombre,
      pais: this.data.pais,
      contacto: this.data.contacto,
      correo: this.data.correo,
      telefono: this.data.telefono,
      sitioWeb: this.data.sitioWeb
    });
  }

  get modoEdicion(): boolean {
    return this.data !== null;
  }

  onGuardar(): void {
    this.submitted = true;
    this.formulario.markAllAsTouched();

    if (this.formulario.invalid) {
      return;
    }

    const value = this.formulario.getRawValue();

    const resultado: NavieraFormData = {
      codigo: value.codigo.trim(),
      nombre: value.nombre.trim(),
      pais: value.pais.trim(),
      contacto: value.contacto.trim(),
      correo: value.correo.trim(),
      telefono: value.telefono.trim(),
      sitioWeb: value.sitioWeb.trim()
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