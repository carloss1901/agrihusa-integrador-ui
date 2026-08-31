import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { AgrihusaButtonComponent } from '../../../../shared/components/agrihusa-button/agrihusa-button.component';
import { IQueryMantPuertoLlegada } from '../../views/mantenimiento-puertos-llegada/mantenimiento-puertos-llegada.component';

@Component({
  selector: 'app-filtro-mant-puertos-llegada',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbAccordionModule, NgSelectModule, AgrihusaButtonComponent],
  templateUrl: './filtro-mant-puertos-llegada.component.html'
})
export class FiltroMantPuertosLlegadaComponent implements OnInit {
  @Output() buscarPuertoLlegada = new EventEmitter<IQueryMantPuertoLlegada>();
  @Output() limpiar = new EventEmitter<void>();

  frmFiltro!: FormGroup;
  lstCboEstado: any[] = [];
  lstCboPais: any[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.frmFiltro = this.fb.group({
      cboPais: [null],
      txtPuerto: [''],
      cboEstado: [null]
    });

    this.lstCboEstado = [
      { maestroId: 1, descripcion: 'ACTIVO' },
      { maestroId: 0, descripcion: 'INACTIVO' }
    ];

    this.lstCboPais = [
      { maestroId: 'PERU', descripcion: 'PERU' },
      { maestroId: 'CHILE', descripcion: 'CHILE' },
      { maestroId: 'COLOMBIA', descripcion: 'COLOMBIA' },
      { maestroId: 'ECUADOR', descripcion: 'ECUADOR' },
      { maestroId: 'MEXICO', descripcion: 'MEXICO' }
    ];
  }

  onBuscar() {
    const value = this.frmFiltro.value;
    const query: IQueryMantPuertoLlegada = {};
    if (value.cboPais) query.pais = value.cboPais;
    if (value.txtPuerto) query.puerto = value.txtPuerto;
    if (value.cboEstado != null) query.estado = value.cboEstado;
    this.buscarPuertoLlegada.emit(query);
  }

  onLimpiar() {
    this.frmFiltro.reset();
    this.limpiar.emit();
  }
}
