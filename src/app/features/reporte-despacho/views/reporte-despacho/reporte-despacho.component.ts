import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit
} from '@angular/core';
import { finalize } from 'rxjs';

import {
  AccionPermiso,
  ModuloSistema
} from '../../../../core/models/permiso.model';
import { AuthService } from '../../../../core/services/auth.service';
import { AgrihusaButtonComponent } from '../../../../shared/components/agrihusa-button/agrihusa-button.component';
import {
  IChangePaginate
} from '../../../../shared/components/agrihusa-table-footer/agrihusa-table-footer.component';
import { AgrihusaTopBarComponent } from '../../../../shared/components/agrihusa-topbar/agrihusa-topbar.component';
import {
  AccionBitacora,
  ResultadoBitacora
} from '../../../auditoria/models/bitacora.model';
import { BitacoraService } from '../../../auditoria/services/bitacora.service';
import { FiltroReporteDespachoComponent } from '../../components/filtro-reporte-despacho/filtro-reporte-despacho.component';
import { TablaReporteDespachoComponent } from '../../components/tabla-reporte-despacho/tabla-reporte-despacho.component';
import {
  ReporteDespachoFilter,
  ReporteDespachoItem,
  ResumenReporteDespacho
} from '../../models/reporte-despacho.model';
import { ReporteDespachoService } from '../../services/reporte-despacho.service';

@Component({
  selector: 'app-reporte-despacho',
  standalone: true,
  imports: [
    CommonModule,
    AgrihusaTopBarComponent,
    AgrihusaButtonComponent,
    FiltroReporteDespachoComponent,
    TablaReporteDespachoComponent
  ],
  templateUrl:
    './reporte-despacho.component.html',
  styleUrls: [
    './reporte-despacho.component.scss'
  ]
})
export class ReporteDespachoComponent
  implements OnInit {
  readonly titulo =
    'Reporte de Despacho';

  datasource: ReporteDespachoItem[] = [];

  loading = false;
  exportando = false;

  totalItems = 0;
  page = 1;
  pageSize = 10;

  puedeExportar = false;

  resumen: ResumenReporteDespacho = {
    totalRegistros: 0,
    totalActivos: 0,
    totalEntregados: 0,
    totalEnTransito: 0
  };

  private resultados:
    ReporteDespachoItem[] = [];

  private filtro:
    ReporteDespachoFilter = {};

  constructor(
    private reporteService:
      ReporteDespachoService,
    private authService:
      AuthService,
    private bitacoraService:
      BitacoraService
  ) {}

  ngOnInit(): void {
    this.cargarPermisoExportar();
    this.generarReporte();
  }

  onBuscar(
    filtro: ReporteDespachoFilter
  ): void {
    this.filtro = {
      ...filtro
    };

    this.page = 1;
    this.generarReporte();
  }

  onLimpiarFiltro(): void {
    this.filtro = {};
    this.page = 1;
    this.generarReporte();
  }

  onChangePaginate(
    event: IChangePaginate
  ): void {
    this.page = event.page;
    this.pageSize = event.pageSize;

    this.aplicarPaginacion();
  }

  async exportarExcel(): Promise<void> {
    if (
      !this.puedeExportar ||
      this.exportando
    ) {
      return;
    }

    if (!this.resultados.length) {
      window.alert(
        'No existen despachos para exportar.'
      );

      return;
    }

    this.exportando = true;

    try {
      await this.reporteService
        .exportarExcel(
          this.resultados
        );

      this.registrarExportacion(
        this.resultados.length
      );
    } catch (error) {
      console.error(
        'Error al exportar el reporte:',
        error
      );

      window.alert(
        'No se pudo generar el archivo Excel.'
      );
    } finally {
      this.exportando = false;
    }
  }

  private generarReporte(): void {
    this.loading = true;

    this.reporteService
      .consultar(this.filtro)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe((resultados) => {
        this.resultados =
          resultados;

        this.totalItems =
          resultados.length;

        this.resumen =
          this.reporteService
            .obtenerResumen(
              resultados
            );

        this.ajustarPagina();
        this.aplicarPaginacion();
      });
  }

  private aplicarPaginacion(): void {
    const inicio =
      (this.page - 1) *
      this.pageSize;

    this.datasource =
      this.resultados.slice(
        inicio,
        inicio + this.pageSize
      );
  }

  private ajustarPagina(): void {
    const totalPaginas =
      Math.max(
        1,
        Math.ceil(
          this.totalItems /
            this.pageSize
        )
      );

    if (this.page > totalPaginas) {
      this.page = totalPaginas;
    }
  }

  private cargarPermisoExportar(): void {
    this.authService
      .tienePermiso(
        ModuloSistema.REPORTE_DESPACHO,
        AccionPermiso.EXPORTAR
      )
      .subscribe((permitido) => {
        this.puedeExportar =
          permitido;
      });
  }

  private registrarExportacion(
    cantidad: number
  ): void {
    const sesion =
      this.authService
        .obtenerSesionActual();

    if (!sesion) {
      return;
    }

    this.bitacoraService
      .registrar({
        usuarioId:
          sesion.usuarioId,
        nombreUsuario:
          sesion.nombreUsuario,
        modulo:
          ModuloSistema.REPORTE_DESPACHO,
        accion:
          AccionBitacora.EXPORTAR,
        entidad:
          'Reporte de despacho',
        registroId: null,
        detalle:
          `Se exportaron ${cantidad} despachos a Excel.`,
        resultado:
          ResultadoBitacora.EXITO
      })
      .subscribe();
  }
}