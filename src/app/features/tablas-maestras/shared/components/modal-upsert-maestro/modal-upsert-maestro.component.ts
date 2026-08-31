import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { AgrihusaButtonComponent } from '../../../../../shared/components/agrihusa-button/agrihusa-button.component';
import { AccionMantenimiento } from '../../../../../shared/enums/accion-mantenimiento.enum';
import { MaestroFieldConfig, MaestroItem } from '../../models/mantenimiento-maestro.model';

@Component({
  selector: 'app-modal-upsert-maestro',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    AgrihusaButtonComponent
  ],
  templateUrl: './modal-upsert-maestro.component.html'
})
export class ModalUpsertMaestroComponent implements OnInit {
  readonly AccionMantenimiento = AccionMantenimiento;

  @Input() titleModal = '';
  @Input() accion: AccionMantenimiento = AccionMantenimiento.CREAR;
  @Input() data: MaestroItem | null = null;
  @Input() fields: MaestroFieldConfig[] = [];

  formulario!: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder, public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.initFormulario();
  }

  private initFormulario() {
    const controls: Record<string, unknown> = {};

    this.fields.forEach((field) => {
      controls[this.getControlName(field.key)] = [null, [Validators.required]];
    });

    this.formulario = this.fb.group(controls);

    if (this.accion === AccionMantenimiento.ACTUALIZAR && this.data) {
      this.fields.forEach((field) => {
        this.formulario.get(this.getControlName(field.key))?.setValue(this.data?.[field.key] ?? null);
      });
    }
  }

  onGuardar() {
    this.submitted = true;
    if (this.formulario.invalid) {
      Object.values(this.formulario.controls).forEach((control) =>
        control.markAllAsTouched()
      );
      return;
    }

    const payload: Record<string, string | number> = {};
    this.fields.forEach((field) => {
      payload[field.key] = this.formulario.get(this.getControlName(field.key))?.value;
    });

    this.activeModal.close({
      accion: this.accion,
      values: payload
    });
  }

  onCerrarModal() {
    this.activeModal.close();
  }

  esControlInvalido(controlName: string): boolean {
    const control = this.formulario.get(controlName);
    return !!(control && control.invalid && (control.touched || this.submitted));
  }

  getControlName(key: string): string {
    return `field_${key}`;
  }
}
