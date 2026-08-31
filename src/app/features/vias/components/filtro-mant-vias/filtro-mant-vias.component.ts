import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { AgrihusaButtonComponent } from '../../../../shared/components/agrihusa-button/agrihusa-button.component';
import { IQueryMantVia } from '../../views/mantenimiento-vias/mantenimiento-vias.component';

@Component({
  selector: 'app-filtro-mant-vias',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbAccordionModule,
    NgSelectModule,
    AgrihusaButtonComponent
  ],
  templateUrl: './filtro-mant-vias.component.html'
})
export class FiltroMantViasComponent implements OnInit {
  @Output() buscarVia = new EventEmitter<IQueryMantVia>();
  @Output() limpiar = new EventEmitter<void>();

  frmFiltro!: FormGroup;
  lstCboEstado: any[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.frmFiltro = this.fb.group({
      txtVia: [''],
      cboEstado: [null]
    });

    this.lstCboEstado = [
      { maestroId: 1, descripcion: 'ACTIVO' },
      { maestroId: 0, descripcion: 'INACTIVO' }
    ];
  }

  onBuscar() {
    const value = this.frmFiltro.value;
    const query: IQueryMantVia = {};
    if (value.txtVia) query.descripcion = value.txtVia;
    if (value.cboEstado != null) query.estado = value.cboEstado;
    this.buscarVia.emit(query);
  }

  onLimpiar() {
    this.frmFiltro.reset();
    this.limpiar.emit();
  }
}
