import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { AgrihusaButtonComponent } from '../../../../../shared/components/agrihusa-button/agrihusa-button.component';
import { MaestroFieldConfig, MaestroQuery, MaestroOption } from '../../models/mantenimiento-maestro.model';

@Component({
  selector: 'app-filtro-mantenimiento-maestro',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbAccordionModule,
    NgSelectModule,
    AgrihusaButtonComponent
  ],
  templateUrl: './filtro-mantenimiento-maestro.component.html'
})
export class FiltroMantenimientoMaestroComponent implements OnInit {
  @Input() fields: MaestroFieldConfig[] = [];

  @Output() buscar = new EventEmitter<MaestroQuery>();
  @Output() limpiar = new EventEmitter<void>();

  frmFiltro!: FormGroup;
  lstCboEstado: MaestroOption[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initFormulario();
  }

  private initFormulario() {
    const controls: Record<string, unknown> = {
      cboEstado: [null]
    };

    this.fields.forEach((field) => {
      controls[this.getControlName(field.key)] = [''];
    });

    this.frmFiltro = this.fb.group(controls);

    this.lstCboEstado = [
      { maestroId: 1, descripcion: 'ACTIVO' },
      { maestroId: 0, descripcion: 'INACTIVO' }
    ];
  }

  onBuscar() {
    const value = this.frmFiltro.value;
    const query: MaestroQuery = {};

    this.fields.forEach((field) => {
      const controlValue = value[this.getControlName(field.key)];
      if (controlValue !== null && controlValue !== undefined && controlValue !== '') {
        query[field.key] = controlValue;
      }
    });

    if (value.cboEstado != null) {
      query.estado = value.cboEstado;
    }

    this.buscar.emit(query);
  }

  onLimpiar() {
    this.frmFiltro.reset();
    this.limpiar.emit();
  }

  getControlName(key: string): string {
    return `field_${key}`;
  }
}
