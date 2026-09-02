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
  Destino,
  DestinoFormData
} from '../../models/destino.model';

type NombreControl = 'pais' | 'ciudad';

@Component({
  selector: 'app-modal-upsert-destino',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AgrihusaButtonComponent
  ],
  templateUrl:
    './modal-upsert-destino.component.html',
  styleUrls: [
    './modal-upsert-destino.component.scss'
  ]
})
export class ModalUpsertDestinoComponent
  implements OnInit {
  @Input() titleModal = '';
  @Input() data: Destino | null = null;

  submitted = false;

  readonly formulario = new FormGroup({
    pais: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.maxLength(80),
        Validators.pattern(
          /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s.'-]+$/
        )
      ]
    }),
    ciudad: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.maxLength(100),
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
      pais: this.data.pais,
      ciudad: this.data.ciudad
    });
  }

  onGuardar(): void {
    this.submitted = true;
    this.formulario.markAllAsTouched();

    if (this.formulario.invalid) {
      return;
    }

    const value = this.formulario.getRawValue();

    const resultado: DestinoFormData = {
      pais: value.pais.trim(),
      ciudad: value.ciudad.trim()
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