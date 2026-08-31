import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AgrihusaButtonComponent } from '../../../../shared/components/agrihusa-button/agrihusa-button.component';
import { AccionMantenimiento } from '../../../../shared/enums/accion-mantenimiento.enum';

interface Naviera {
  idNaviera: number;
  descripcion: string;
  activo: boolean;
}

@Component({
  selector: 'app-modal-upsert-naviera',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AgrihusaButtonComponent],
  templateUrl: './modal-upsert-naviera.component.html'
})
export class ModalUpsertNavieraComponent implements OnInit {
  readonly AccionMantenimiento = AccionMantenimiento;

  @Input() titleModal = '';
  @Input() accion: AccionMantenimiento = AccionMantenimiento.CREAR;
  @Input() data: Naviera | null = null;

  formulario!: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder, public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.formulario = this.fb.group({
      txtNaviera: ['', [Validators.required]]
    });

    if (this.accion === AccionMantenimiento.ACTUALIZAR && this.data) {
      this.txtNaviera?.setValue(this.data.descripcion);
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
      descripcion: this.txtNaviera?.value
    });
  }

  onCerrarModal() {
    this.activeModal.close();
  }

  esControlInvalido(control: any): boolean {
    return !!(control && control.invalid && (control.touched || this.submitted));
  }

  get txtNaviera() {
    return this.formulario.get('txtNaviera');
  }
}
