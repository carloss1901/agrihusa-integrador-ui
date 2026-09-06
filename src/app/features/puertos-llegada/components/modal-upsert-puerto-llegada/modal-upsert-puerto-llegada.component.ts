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
  PuertoLlegada,
  PuertoLlegadaFormData
} from '../../models/puerto-llegada.model';

type NombreControl =
  | 'codigo'
  | 'puerto'
  | 'pais';

@Component({
  selector: 'app-modal-upsert-puerto-llegada',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AgrihusaButtonComponent
  ],
  templateUrl:
    './modal-upsert-puerto-llegada.component.html',
  styleUrls: [
    './modal-upsert-puerto-llegada.component.scss'
  ]
})
export class ModalUpsertPuertoLlegadaComponent
  implements OnInit {
  @Input() titleModal = '';
  @Input() data: PuertoLlegada | null = null;

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
    puerto: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.maxLength(100),
        Validators.pattern(
          /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s.'-]+$/
        )
      ]
    }),
    pais: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.maxLength(80),
        Validators.pattern(
          /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s.'-]+$/
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
      puerto: this.data.puerto,
      pais: this.data.pais
    });
  }

  onGuardar(): void {
    this.submitted = true;
    this.formulario.markAllAsTouched();

    if (this.formulario.invalid) {
      return;
    }

    const value = this.formulario.getRawValue();

    const resultado: PuertoLlegadaFormData = {
      codigo: value.codigo.trim(),
      puerto: value.puerto.trim(),
      pais: value.pais.trim()
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