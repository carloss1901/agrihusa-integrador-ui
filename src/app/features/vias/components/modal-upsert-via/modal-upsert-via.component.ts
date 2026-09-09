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
  Via,
  ViaFormData
} from '../../models/via.model';

type NombreControl = 'descripcion';

@Component({
  selector: 'app-modal-upsert-via',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AgrihusaButtonComponent
  ],
  templateUrl:
    './modal-upsert-via.component.html',
  styleUrls: [
    './modal-upsert-via.component.scss'
  ]
})
export class ModalUpsertViaComponent
  implements OnInit {
  @Input() titleModal = '';
  @Input() data: Via | null = null;

  submitted = false;

  readonly formulario = new FormGroup({
    descripcion: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(3),
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

    const resultado: ViaFormData = {
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