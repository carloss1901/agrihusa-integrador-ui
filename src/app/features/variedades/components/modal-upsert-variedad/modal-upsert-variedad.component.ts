import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AgrihusaButtonComponent } from '../../../../shared/components/agrihusa-button/agrihusa-button.component';
import { AccionMantenimiento } from '../../../../shared/enums/accion-mantenimiento.enum';

interface Variedad {
  idVariedad: number;
  descripcion: string;
  activo: boolean;
}

@Component({
  selector: 'app-modal-upsert-variedad',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AgrihusaButtonComponent],
  templateUrl: './modal-upsert-variedad.component.html'
})
export class ModalUpsertVariedadComponent implements OnInit {
  readonly AccionMantenimiento = AccionMantenimiento;

  @Input() titleModal = '';
  @Input() accion: AccionMantenimiento = AccionMantenimiento.CREAR;
  @Input() data: Variedad | null = null;

  formulario!: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder, public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.formulario = this.fb.group({
      txtVariedad: ['', [Validators.required]]
    });

    if (this.accion === AccionMantenimiento.ACTUALIZAR && this.data) {
      this.txtVariedad?.setValue(this.data.descripcion);
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
      descripcion: this.txtVariedad?.value
    });
  }

  onCerrarModal() {
    this.activeModal.close();
  }

  esControlInvalido(control: any): boolean {
    return !!(control && control.invalid && (control.touched || this.submitted));
  }

  get txtVariedad() {
    return this.formulario.get('txtVariedad');
  }
}
