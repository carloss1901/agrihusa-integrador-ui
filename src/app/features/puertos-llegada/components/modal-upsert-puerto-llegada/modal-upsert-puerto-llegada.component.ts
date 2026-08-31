import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { AgrihusaButtonComponent } from '../../../../shared/components/agrihusa-button/agrihusa-button.component';
import { AccionMantenimiento } from '../../../../shared/enums/accion-mantenimiento.enum';

interface PuertoLlegada {
  idPuertoLlegada: number;
  pais: string;
  puerto: string;
  activo: boolean;
}

@Component({
  selector: 'app-modal-upsert-puerto-llegada',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule, AgrihusaButtonComponent],
  templateUrl: './modal-upsert-puerto-llegada.component.html'
})
export class ModalUpsertPuertoLlegadaComponent implements OnInit {
  readonly AccionMantenimiento = AccionMantenimiento;

  @Input() titleModal = '';
  @Input() accion: AccionMantenimiento = AccionMantenimiento.CREAR;
  @Input() data: PuertoLlegada | null = null;

  formulario!: FormGroup;
  lstCboPais: any[] = [];
  submitted = false;

  constructor(private fb: FormBuilder, public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.formulario = this.fb.group({
      cboPais: [null, [Validators.required]],
      txtPuerto: ['', [Validators.required]]
    });

    this.lstCboPais = [
      { maestroId: 'PERU', descripcion: 'PERU' },
      { maestroId: 'CHILE', descripcion: 'CHILE' },
      { maestroId: 'COLOMBIA', descripcion: 'COLOMBIA' },
      { maestroId: 'ECUADOR', descripcion: 'ECUADOR' },
      { maestroId: 'MEXICO', descripcion: 'MEXICO' }
    ];

    if (this.accion === AccionMantenimiento.ACTUALIZAR && this.data) {
      this.cboPais?.setValue(this.data.pais);
      this.txtPuerto?.setValue(this.data.puerto);
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
      pais: this.cboPais?.value,
      puerto: this.txtPuerto?.value
    });
  }

  onCerrarModal() {
    this.activeModal.close();
  }

  esControlInvalido(control: any): boolean {
    return !!(control && control.invalid && (control.touched || this.submitted));
  }

  get cboPais() {
    return this.formulario.get('cboPais');
  }

  get txtPuerto() {
    return this.formulario.get('txtPuerto');
  }
}
