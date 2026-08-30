import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { AgrihusaButtonComponent } from '../../../../shared/components/agrihusa-button/agrihusa-button.component';
import { IQueryAuditoria } from '../../views/auditoria/auditoria.component';

@Component({
  selector: 'app-filtro-auditoria',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbAccordionModule,
    NgSelectModule,
    AgrihusaButtonComponent
  ],
  templateUrl: './filtro-auditoria.component.html'
})
export class FiltroAuditoriaComponent implements OnInit {
  @Output() buscar = new EventEmitter<IQueryAuditoria>();
  @Output() limpiar = new EventEmitter<void>();

  frmFiltro!: FormGroup;
  lstCboAccion: any[] = [];
  lstCboEntidad: any[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initFormulario();
  }

  private initFormulario() {
    this.frmFiltro = this.fb.group({
      txtUsuario: [''],
      cboAccion: [null],
      cboEntidad: [null],
      txtFechaIni: [''],
      txtFechaFin: ['']
    });

    this.lstCboAccion = [
      { maestroId: 'CREAR', descripcion: 'CREAR' },
      { maestroId: 'EDITAR', descripcion: 'EDITAR' },
      { maestroId: 'ELIMINAR', descripcion: 'ELIMINAR' },
      { maestroId: 'CONSULTAR', descripcion: 'CONSULTAR' }
    ];

    this.lstCboEntidad = [
      { maestroId: 'DESTINO', descripcion: 'DESTINO' },
      { maestroId: 'VÍA', descripcion: 'VÍA' },
      { maestroId: 'TRANSPORTISTA', descripcion: 'TRANSPORTISTA' },
      { maestroId: 'USUARIO', descripcion: 'USUARIO' }
    ];
  }

  onBuscar() {
    const value = this.frmFiltro.value;
    const query: IQueryAuditoria = {};
    if (value.txtUsuario) query.usuario = value.txtUsuario;
    if (value.cboAccion) query.accion = value.cboAccion;
    if (value.cboEntidad) query.entidad = value.cboEntidad;
    if (value.txtFechaIni) query.fechaIni = value.txtFechaIni;
    if (value.txtFechaFin) query.fechaFin = value.txtFechaFin;
    this.buscar.emit(query);
  }

  onLimpiar() {
    this.frmFiltro.reset();
    this.limpiar.emit();
  }
}