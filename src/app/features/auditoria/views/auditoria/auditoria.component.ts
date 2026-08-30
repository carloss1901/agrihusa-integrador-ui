import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AgrihusaTopBarComponent } from '../../../../shared/components/agrihusa-topbar/agrihusa-topbar.component';
import { AgrihusaButtonComponent } from '../../../../shared/components/agrihusa-button/agrihusa-button.component';
import { FiltroAuditoriaComponent } from '../../components/filtro-auditoria/filtro-auditoria.component';
import { TablaAuditoriaComponent } from '../../components/tabla-auditoria/tabla-auditoria.component';
import { ModalDetalleAuditoriaComponent } from '../../components/modal-detalle-auditoria/modal-detalle-auditoria.component';
import { IChangePaginate } from '../../../../shared/components/agrihusa-table-footer/agrihusa-table-footer.component';
import { AccionMantenimiento } from '../../../../shared/enums/accion-mantenimiento.enum';

export interface IQueryAuditoria {
  usuario?: string;
  accion?: string;
  entidad?: string;
  fechaIni?: string;
  fechaFin?: string;
}

interface RegistroAuditoria {
  idAuditoria: number;
  fecha: string;
  usuario: string;
  accion: string;
  entidad: string;
  detalle: string;
  ip: string;
}

@Component({
  selector: 'app-auditoria',
  standalone: true,
  imports: [
    CommonModule,
    AgrihusaTopBarComponent,
    AgrihusaButtonComponent,
    FiltroAuditoriaComponent,
    TablaAuditoriaComponent,
    ModalDetalleAuditoriaComponent
  ],
  templateUrl: './auditoria.component.html'
})
export class AuditoriaComponent implements OnInit {
  getNombreMantenimiento = 'Auditoría';

  filaSeleccionada: any | null = null;
  dataAuditoria: RegistroAuditoria[] = [];
  loading = false;
  totalItems = 0;
  page = 1;
  pageSize = 10;

  private todosRegistros: RegistroAuditoria[] = [];
  private queryFilter: IQueryAuditoria = {};

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    this.cargarMocks();
    this.aplicarGrilla();
  }

  private cargarMocks() {
    const usuarios = ['ADMIN', 'JORGE PÉREZ', 'ANA LÓPEZ', 'LUIS MARTÍNEZ'];
    const acciones = ['CREAR', 'EDITAR', 'ELIMINAR', 'CONSULTAR'];
    const entidades = ['DESTINO', 'VÍA', 'TRANSPORTISTA', 'USUARIO'];
    const ips = ['192.168.1.10', '192.168.1.25', '10.0.0.7', '172.16.4.3'];
    const detalles = [
      'Se registró el destino PERÚ',
      'Se modificó el destino BOGOTÁ',
      'Se eliminó la vía CALI',
      'Se consultó el registro del transportista',
      'Se actualizó el usuario LUIS MARTÍNEZ',
      'Se creó la entidad MEDELLÍN',
      'Se modificó la vía principal',
      'Se consultó el detalle de auditoría'
    ];

    this.todosRegistros = [];
    const base = new Date(2024, 0, 15);
    for (let i = 1; i <= 23; i++) {
      const day = new Date(base);
      day.setDate(day.getDate() + i);
      const fecha = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')} ${String(8 + (i % 10)).padStart(2, '0')}:${String((i * 7) % 60).padStart(2, '0')}`;
      this.todosRegistros.push({
        idAuditoria: i,
        fecha,
        usuario: usuarios[i % usuarios.length],
        accion: acciones[i % acciones.length],
        entidad: entidades[i % entidades.length],
        detalle: detalles[i % detalles.length],
        ip: ips[i % ips.length]
      });
    }
  }

  private aplicarGrilla() {
    const q = this.queryFilter;
    const filtrados = this.todosRegistros.filter((r) => {
      if (q.usuario && !r.usuario.toUpperCase().includes(q.usuario.toUpperCase()))
        return false;
      if (q.accion && r.accion !== q.accion) return false;
      if (q.entidad && r.entidad !== q.entidad) return false;
      if (q.fechaIni && r.fecha < q.fechaIni) return false;
      if (q.fechaFin && r.fecha > `${q.fechaFin} 23:59`) return false;
      return true;
    });

    this.totalItems = filtrados.length;
    const inicio = (this.page - 1) * this.pageSize;
    this.dataAuditoria = filtrados.slice(inicio, inicio + this.pageSize);
  }

  onBuscar(query: IQueryAuditoria) {
    this.queryFilter = { ...query };
    this.page = 1;
    this.aplicarGrilla();
  }

  onLimpiar() {
    this.queryFilter = {};
    this.page = 1;
    this.aplicarGrilla();
  }

  onSeleccionarItem(item: any) {
    if (this.filaSeleccionada?.idAuditoria === item.idAuditoria) {
      this.filaSeleccionada = null;
    } else {
      this.filaSeleccionada = item;
    }
  }

  mostrarModalDetalle() {
    const modalRef = this.modalService.open(ModalDetalleAuditoriaComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
      centered: true
    });

    modalRef.componentInstance.titleModal = 'DETALLE DE AUDITORÍA';
    modalRef.componentInstance.accion = AccionMantenimiento.VER;
    modalRef.componentInstance.data = this.filaSeleccionada;

    modalRef.result
      .then(() => {})
      .catch(() => {});
  }

  onChangePaginate(event: IChangePaginate) {
    this.page = event.page;
    this.pageSize = event.pageSize;
    this.aplicarGrilla();
  }
}