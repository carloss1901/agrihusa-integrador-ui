import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { AgrihusaButtonComponent } from '../../../../shared/components/agrihusa-button/agrihusa-button.component';
import { IQueryMantDestino } from '../../views/mantenimiento-destinos/mantenimiento-destinos.component';

@Component({
  selector: 'app-filtro-mant-destinos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbAccordionModule,
    NgSelectModule,
    AgrihusaButtonComponent
  ],
  templateUrl: './filtro-mant-destinos.component.html'
})
export class FiltroMantDestinosComponent implements OnInit {
  @Output() buscarDestino = new EventEmitter<IQueryMantDestino>();
  @Output() limpiar = new EventEmitter<void>();

  frmFiltro!: FormGroup;
  lstCboPais: any[] = [];
  lstCboEstado: any[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initFormulario();
  }

  private initFormulario() {
    this.frmFiltro = this.fb.group({
      cboPais: [null],
      txtCiudad: [''],
      cboEstado: [null]
    });

    this.lstCboEstado = [
      { maestroId: 1, descripcion: 'ACTIVO' },
      { maestroId: 0, descripcion: 'INACTIVO' }
    ];

    this.lstCboPais = [
      { maestroId: 'PERÚ', descripcion: 'PERÚ' },
      { maestroId: 'ECUADOR', descripcion: 'ECUADOR' },
      { maestroId: 'COLOMBIA', descripcion: 'COLOMBIA' },
      { maestroId: 'CHILE', descripcion: 'CHILE' },
      { maestroId: 'BOLIVIA', descripcion: 'BOLIVIA' }
    ];
  }

  onBuscar() {
    const value = this.frmFiltro.value;
    const query: IQueryMantDestino = {};
    if (value.cboPais) query.pais = value.cboPais;
    if (value.txtCiudad) query.ciudad = value.txtCiudad;
    if (value.cboEstado != null) query.estado = value.cboEstado;
    this.buscarDestino.emit(query);
  }

  onLimpiar() {
    this.frmFiltro.reset();
    this.limpiar.emit();
  }
}
