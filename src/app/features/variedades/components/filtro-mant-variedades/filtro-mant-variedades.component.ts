import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { AgrihusaButtonComponent } from '../../../../shared/components/agrihusa-button/agrihusa-button.component';
import { IQueryMantVariedad } from '../../views/mantenimiento-variedades/mantenimiento-variedades.component';

@Component({
  selector: 'app-filtro-mant-variedades',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbAccordionModule, NgSelectModule, AgrihusaButtonComponent],
  templateUrl: './filtro-mant-variedades.component.html'
})
export class FiltroMantVariedadesComponent implements OnInit {
  @Output() buscarVariedad = new EventEmitter<IQueryMantVariedad>();
  @Output() limpiar = new EventEmitter<void>();

  frmFiltro!: FormGroup;
  lstCboEstado: any[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.frmFiltro = this.fb.group({
      txtVariedad: [''],
      cboEstado: [null]
    });

    this.lstCboEstado = [
      { maestroId: 1, descripcion: 'ACTIVO' },
      { maestroId: 0, descripcion: 'INACTIVO' }
    ];
  }

  onBuscar() {
    const value = this.frmFiltro.value;
    const query: IQueryMantVariedad = {};
    if (value.txtVariedad) query.descripcion = value.txtVariedad;
    if (value.cboEstado != null) query.estado = value.cboEstado;
    this.buscarVariedad.emit(query);
  }

  onLimpiar() {
    this.frmFiltro.reset();
    this.limpiar.emit();
  }
}
