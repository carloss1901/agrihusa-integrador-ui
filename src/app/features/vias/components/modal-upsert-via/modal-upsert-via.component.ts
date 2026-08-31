import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AgrihusaButtonComponent } from '../../../../shared/components/agrihusa-button/agrihusa-button.component';
import { AccionMantenimiento } from '../../../../shared/enums/accion-mantenimiento.enum';

interface Via {
  idVia: number;
  descripcion: string;
  activo: boolean;
}

@Component({
  selector: 'app-modal-upsert-via',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AgrihusaButtonComponent],
  templateUrl: './modal-upsert-via.component.html'
})
export class ModalUpsertViaComponent implements OnInit {
  readonly AccionMantenimiento = AccionMantenimiento;

  @Input() titleModal = '';
  @Input() accion: AccionMantenimiento = AccionMantenimiento.CREAR;
  @Input() data: Via | null = null;

  formulario!: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder, public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.formulario = this.fb.group({
      txtVia: ['', [Validators.required]]
    });

    if (this.accion === AccionMantenimiento.ACTUALIZAR && this.data) {
      this.txtVia?.setValue(this.data.descripcion);
    }
  }

  onGuardar() {
    this.submitted = true;
    if (this.formulario.invalid) {
      Object.values(this.formulario.controls).forEach((control) => control.markAllAsTouched());
      return;
    }
    this.activeModal.close({
      accion: this.accion,
      descripcion: this.txtVia?.value
    });
  }

  onCerrarModal() {
    this.activeModal.close();
  }

  esControlInvalido(control: any): boolean {
    return !!(control && control.invalid && (control.touched || this.submitted));
  }

  get txtVia() {
    return this.formulario.get('txtVia');
  }
}
