import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { AgrihusaButtonComponent } from '../../../../shared/components/agrihusa-button/agrihusa-button.component';
import { IQueryMantNaviera } from '../../views/mantenimiento-navieras/mantenimiento-navieras.component';

@Component({
  selector: 'app-filtro-mant-navieras',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbAccordionModule, NgSelectModule, AgrihusaButtonComponent],
  templateUrl: './filtro-mant-navieras.component.html'
})
export class FiltroMantNavierasComponent implements OnInit {
  @Output() buscarNaviera = new EventEmitter<IQueryMantNaviera>();
  @Output() limpiar = new EventEmitter<void>();

  frmFiltro!: FormGroup;
  lstCboEstado: any[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.frmFiltro = this.fb.group({
      txtNaviera: [''],
      cboEstado: [null]
    });

    this.lstCboEstado = [
      { maestroId: 1, descripcion: 'ACTIVO' },
      { maestroId: 0, descripcion: 'INACTIVO' }
    ];
  }

  onBuscar() {
    const value = this.frmFiltro.value;
    const query: IQueryMantNaviera = {};
    if (value.txtNaviera) query.descripcion = value.txtNaviera;
    if (value.cboEstado != null) query.estado = value.cboEstado;
    this.buscarNaviera.emit(query);
  }

  onLimpiar() {
    this.frmFiltro.reset();
    this.limpiar.emit();
  }
}
