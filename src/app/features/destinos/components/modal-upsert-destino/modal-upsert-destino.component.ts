import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { AgrihusaButtonComponent } from '../../../../shared/components/agrihusa-button/agrihusa-button.component';
import { AccionMantenimiento } from '../../../../shared/enums/accion-mantenimiento.enum';

interface Destino {
  idDestino: number;
  pais: string;
  ciudad: string;
  activo: boolean;
}

@Component({
  selector: 'app-modal-upsert-destino',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    AgrihusaButtonComponent
  ],
  templateUrl: './modal-upsert-destino.component.html'
})
export class ModalUpsertDestinoComponent implements OnInit {
  readonly AccionMantenimiento = AccionMantenimiento;

  @Input() titleModal = '';
  @Input() accion: AccionMantenimiento = AccionMantenimiento.CREAR;
  @Input() data: Destino | null = null;

  formulario!: FormGroup;
  lstCboPais: any[] = [];
  submitted = false;

  constructor(private fb: FormBuilder, public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.initFormulario();
  }

  private initFormulario() {
    this.formulario = this.fb.group({
      cboPais: [null, [Validators.required]],
      txtCiudad: ['', [Validators.required]]
    });

    this.lstCboPais = [
      { maestroId: 'PERÚ', descripcion: 'PERÚ' },
      { maestroId: 'ECUADOR', descripcion: 'ECUADOR' },
      { maestroId: 'COLOMBIA', descripcion: 'COLOMBIA' },
      { maestroId: 'CHILE', descripcion: 'CHILE' },
      { maestroId: 'BOLIVIA', descripcion: 'BOLIVIA' }
    ];

    if (this.accion === AccionMantenimiento.ACTUALIZAR && this.data) {
      this.cboPais?.setValue(this.data.pais);
      this.txtCiudad?.setValue(this.data.ciudad);
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
    this.activeModal.close({
      accion: this.accion,
      pais: this.cboPais?.value,
      ciudad: this.txtCiudad?.value
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
  get txtCiudad() {
    return this.formulario.get('txtCiudad');
  }
}
