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
import { AlertService } from '../../../../core/services/alert.service';
import { DestinoService } from '../../../../core/services/destino.service';
import { ModalCrudBase } from '../../../../shared/components/modal-crud/modal-crud-base';

import { AgrihusaButtonComponent } from '../../../../shared/components/agrihusa-button/agrihusa-button.component';
import {
  Destino,
  DestinoFormData
} from '../../../../core/models/destino.model';

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
  extends ModalCrudBase<DestinoFormData> implements OnInit {
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
    activeModal: NgbActiveModal,
    alertService: AlertService,
    private readonly destinoService: DestinoService
  ) { super(activeModal, alertService); }

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

    const request = this.data
      ? this.destinoService.actualizar(this.data.id, resultado)
      : this.destinoService.crear(resultado);
    this.ejecutarGuardado(request, resultado);
  }

  onCerrarModal(): void {
    this.cerrarModal();
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
