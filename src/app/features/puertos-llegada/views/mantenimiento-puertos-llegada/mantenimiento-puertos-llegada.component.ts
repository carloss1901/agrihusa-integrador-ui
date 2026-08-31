import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AgrihusaButtonComponent } from '../../../../shared/components/agrihusa-button/agrihusa-button.component';
import { IChangePaginate } from '../../../../shared/components/agrihusa-table-footer/agrihusa-table-footer.component';
import { AgrihusaTopBarComponent } from '../../../../shared/components/agrihusa-topbar/agrihusa-topbar.component';
import { AccionMantenimiento } from '../../../../shared/enums/accion-mantenimiento.enum';
import { FiltroMantPuertosLlegadaComponent } from '../../components/filtro-mant-puertos-llegada/filtro-mant-puertos-llegada.component';
import { ModalUpsertPuertoLlegadaComponent } from '../../components/modal-upsert-puerto-llegada/modal-upsert-puerto-llegada.component';
import { TablaMantPuertosLlegadaComponent } from '../../components/tabla-mant-puertos-llegada/tabla-mant-puertos-llegada.component';

export interface IQueryMantPuertoLlegada {
  pais?: string;
  puerto?: string;
  estado?: number;
  page?: number;
  size?: number;
}

interface PuertoLlegada {
  idPuertoLlegada: number;
  pais: string;
  puerto: string;
  activo: boolean;
}

@Component({
  selector: 'app-mantenimiento-puertos-llegada',
  standalone: true,
  imports: [CommonModule, AgrihusaTopBarComponent, AgrihusaButtonComponent, FiltroMantPuertosLlegadaComponent, TablaMantPuertosLlegadaComponent],
  templateUrl: './mantenimiento-puertos-llegada.component.html'
})
export class MantenimientoPuertosLlegadaComponent implements OnInit {
  readonly AccionMantenimiento = AccionMantenimiento;

  getNombreMantenimiento = 'Mantenimiento de Puertos de Llegada';
  filaSeleccionada: any = null;
  dataPuertosLlegada: PuertoLlegada[] = [];
  loading = false;
  totalItems = 0;
  page = 1;
  pageSize = 10;

  private todosPuertosLlegada: PuertoLlegada[] = [];
  private queryFilter: IQueryMantPuertoLlegada = { page: 1, size: 10 };

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    this.todosPuertosLlegada = [
      { idPuertoLlegada: 1, pais: 'PERU', puerto: 'CALLAO', activo: true },
      { idPuertoLlegada: 2, pais: 'CHILE', puerto: 'VALPARAISO', activo: true },
      { idPuertoLlegada: 3, pais: 'COLOMBIA', puerto: 'BUENAVENTURA', activo: true },
      { idPuertoLlegada: 4, pais: 'ECUADOR', puerto: 'GUAYAQUIL', activo: false },
      { idPuertoLlegada: 5, pais: 'MEXICO', puerto: 'MANZANILLO', activo: true }
    ];
    this.aplicarGrilla();
  }

  onBuscar(query: IQueryMantPuertoLlegada) {
    this.queryFilter = { ...query, page: 1, size: this.pageSize };
    this.page = 1;
    this.aplicarGrilla();
  }

  onLimpiarFiltro() {
    this.queryFilter = { page: 1, size: this.pageSize };
    this.page = 1;
    this.aplicarGrilla();
  }

  onSeleccionarItem(item: any) {
    this.filaSeleccionada =
      this.filaSeleccionada?.idPuertoLlegada === item.idPuertoLlegada ? null : item;
  }

  onChangePaginate(event: IChangePaginate) {
    this.page = event.page;
    this.pageSize = event.pageSize;
    this.aplicarGrilla();
  }

  mostrarModalUpsert(accion: AccionMantenimiento) {
    const modalRef = this.modalService.open(ModalUpsertPuertoLlegadaComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
      centered: true
    });

    modalRef.componentInstance.titleModal =
      accion === AccionMantenimiento.CREAR
        ? 'REGISTRAR PUERTO DE LLEGADA'
        : 'EDITAR PUERTO DE LLEGADA';
    modalRef.componentInstance.accion = accion;
    modalRef.componentInstance.data =
      accion === AccionMantenimiento.ACTUALIZAR ? this.filaSeleccionada : null;

    modalRef.result
      .then((result: { accion: AccionMantenimiento; pais: string; puerto: string }) => {
        if (result) this.onGuardarModal(result.accion, result.pais, result.puerto);
      })
      .catch(() => {});
  }

  eliminarPuertoLlegada() {
    const target = this.todosPuertosLlegada.find(
      (item) => item.idPuertoLlegada === this.filaSeleccionada?.idPuertoLlegada
    );
    if (target) target.activo = !target.activo;
    this.aplicarGrilla();
  }

  private aplicarGrilla() {
    this.filaSeleccionada = null;

    const filtrados = this.todosPuertosLlegada.filter((item) => {
      if (this.queryFilter.pais && item.pais !== this.queryFilter.pais) return false;
      if (this.queryFilter.puerto && !item.puerto.toUpperCase().includes(this.queryFilter.puerto.toUpperCase())) return false;
      if (this.queryFilter.estado != null) {
        const activo = this.queryFilter.estado === 1;
        if (item.activo !== activo) return false;
      }
      return true;
    });

    this.totalItems = filtrados.length;
    const inicio = (this.page - 1) * this.pageSize;
    this.dataPuertosLlegada = filtrados.slice(inicio, inicio + this.pageSize);
  }

  private onGuardarModal(
    accion: AccionMantenimiento,
    pais: string,
    puerto: string
  ) {
    if (accion === AccionMantenimiento.CREAR) {
      const nuevoId =
        this.todosPuertosLlegada.length > 0
          ? Math.max(...this.todosPuertosLlegada.map((item) => item.idPuertoLlegada)) + 1
          : 1;
      this.todosPuertosLlegada.unshift({
        idPuertoLlegada: nuevoId,
        pais,
        puerto,
        activo: true
      });
    } else {
      const target = this.todosPuertosLlegada.find(
        (item) => item.idPuertoLlegada === this.filaSeleccionada?.idPuertoLlegada
      );
      if (target) {
        target.pais = pais;
        target.puerto = puerto;
      }
    }

    this.page = 1;
    this.aplicarGrilla();
  }
}
