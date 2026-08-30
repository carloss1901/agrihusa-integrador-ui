import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AgrihusaTopBarComponent } from '../../../../shared/components/agrihusa-topbar/agrihusa-topbar.component';
import { AgrihusaButtonComponent } from '../../../../shared/components/agrihusa-button/agrihusa-button.component';
import { FiltroMantDestinosComponent } from '../../components/filtro-mant-destinos/filtro-mant-destinos.component';
import { TablaMantDestinosComponent } from '../../components/tabla-mant-destinos/tabla-mant-destinos.component';
import { ModalUpsertDestinoComponent } from '../../components/modal-upsert-destino/modal-upsert-destino.component';
import { IChangePaginate } from '../../../../shared/components/agrihusa-table-footer/agrihusa-table-footer.component';
import { AccionMantenimiento } from '../../../../shared/enums/accion-mantenimiento.enum';

export interface IQueryMantDestino {
  pais?: string;
  ciudad?: string;
  estado?: number;
  page?: number;
  size?: number;
}

interface Destino {
  idDestino: number;
  pais: string;
  ciudad: string;
  activo: boolean;
}

@Component({
  selector: 'app-mantenimiento-destinos',
  standalone: true,
  imports: [
    CommonModule,
    AgrihusaTopBarComponent,
    AgrihusaButtonComponent,
    FiltroMantDestinosComponent,
    TablaMantDestinosComponent,
    ModalUpsertDestinoComponent
  ],
  templateUrl: './mantenimiento-destinos.component.html'
})
export class MantenimientoDestinosComponent implements OnInit {
  readonly AccionMantenimiento = AccionMantenimiento;

  getNombreMantenimiento = 'Mantenimiento de Destinos';

  filaSeleccionada: any = null;
  dataDestinos: Destino[] = [];
  loading = false;
  totalItems = 0;
  page = 1;
  pageSize = 10;

  private todosDestinos: Destino[] = [];
  private queryFilter: IQueryMantDestino = { page: 1, size: 10 };

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    this.cargarMocks();
    this.aplicarGrilla();
  }

  private cargarMocks() {
    const paises = ['PERÚ', 'ECUADOR', 'COLOMBIA', 'CHILE', 'BOLIVIA'];
    const ciudades = ['LIMA', 'QUITO', 'BOGOTÁ', 'SANTIAGO', 'GUAYAQUIL', 'CALI', 'MEDELLÍN', 'BUENOS AIRES', 'LA PAZ', 'MEXICO'];
    const total = 23;
    this.todosDestinos = [];
    for (let i = 1; i <= total; i++) {
      this.todosDestinos.push({
        idDestino: i,
        pais: paises[i % paises.length],
        ciudad: ciudades[i % ciudades.length],
        activo: i % 4 !== 0
      });
    }
  }

  private aplicarGrilla() {
    this.filaSeleccionada = null;

    const q = this.queryFilter;
    const filtrados = this.todosDestinos.filter((d) => {
      if (q.pais && d.pais !== q.pais) return false;
      if (q.ciudad && !d.ciudad.toUpperCase().includes(q.ciudad.toUpperCase()))
        return false;
      if (q.estado != null) {
        const activo = q.estado === 1;
        if (d.activo !== activo) return false;
      }
      return true;
    });

    this.totalItems = filtrados.length;
    const inicio = (this.page - 1) * this.pageSize;
    this.dataDestinos = filtrados.slice(inicio, inicio + this.pageSize);
  }

  onBuscar(query: IQueryMantDestino) {
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
    if (this.filaSeleccionada?.idDestino === item.idDestino) {
      this.filaSeleccionada = null;
    } else {
      this.filaSeleccionada = item;
    }
  }

  onChangePaginate(event: IChangePaginate) {
    this.page = event.page;
    this.pageSize = event.pageSize;
    this.aplicarGrilla();
  }

  mostrarModalUpsert(accion: AccionMantenimiento) {
    const modalRef = this.modalService.open(ModalUpsertDestinoComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
      centered: true
    });

    modalRef.componentInstance.titleModal =
      accion === AccionMantenimiento.CREAR ? 'REGISTRAR DESTINO' : 'EDITAR DESTINO';
    modalRef.componentInstance.accion = accion;
    modalRef.componentInstance.data =
      accion === AccionMantenimiento.ACTUALIZAR ? this.filaSeleccionada : null;

    modalRef.result
      .then((result: { accion: AccionMantenimiento; pais: string; ciudad: string }) => {
        if (result) {
          this.onGuardarModal(result.accion, {
            pais: result.pais,
            ciudad: result.ciudad
          });
        }
      })
      .catch(() => {});
  }

  private onGuardarModal(
    accion: AccionMantenimiento,
    data: { pais: string; ciudad: string }
  ) {
    if (accion === AccionMantenimiento.CREAR) {
      const nuevoId =
        this.todosDestinos.length > 0
          ? Math.max(...this.todosDestinos.map((d) => d.idDestino)) + 1
          : 1;
      this.todosDestinos.unshift({
        idDestino: nuevoId,
        pais: data.pais,
        ciudad: data.ciudad,
        activo: true
      });
    } else {
      const target = this.todosDestinos.find(
        (d) => d.idDestino === this.filaSeleccionada?.idDestino
      );
      if (target) {
        target.pais = data.pais;
        target.ciudad = data.ciudad;
      }
    }

    this.page = 1;
    this.aplicarGrilla();
  }

  eliminarDestino() {
    const fila = this.filaSeleccionada;
    if (!fila) return;

    const target = this.todosDestinos.find(
      (d) => d.idDestino === fila.idDestino
    );
    if (target) {
      target.activo = !target.activo;
    }
    this.aplicarGrilla();
  }
}
