import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';

import { AgrihusaButtonComponent } from '../../../../shared/components/agrihusa-button/agrihusa-button.component';
import {
  IChangePaginate
} from '../../../../shared/components/agrihusa-table-footer/agrihusa-table-footer.component';
import { AgrihusaTopBarComponent } from '../../../../shared/components/agrihusa-topbar/agrihusa-topbar.component';
import { FiltroAuditoriaComponent } from '../../components/filtro-auditoria/filtro-auditoria.component';
import { ModalDetalleAuditoriaComponent } from '../../components/modal-detalle-auditoria/modal-detalle-auditoria.component';
import { TablaAuditoriaComponent } from '../../components/tabla-auditoria/tabla-auditoria.component';
import {
  AccionBitacora,
  BitacoraFilter,
  BitacoraQuery,
  RegistroBitacora,
  ResultadoBitacora
} from '../../models/bitacora.model';
import {
  AccionPermiso,
  ModuloSistema
} from '../../../../core/models/permiso.model';
import { BitacoraService } from '../../services/bitacora.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-auditoria',
  standalone: true,
  imports: [
    CommonModule,
    AgrihusaTopBarComponent,
    AgrihusaButtonComponent,
    FiltroAuditoriaComponent,
    TablaAuditoriaComponent
  ],
  templateUrl: './auditoria.component.html'
})
export class AuditoriaComponent
  implements OnInit {
  readonly titulo = 'Bitácora del Sistema';

  registros: RegistroBitacora[] = [];
  filaSeleccionada: RegistroBitacora | null =
    null;

  loading = false;
  totalItems = 0;
  page = 1;
  pageSize = 10;
  puedeExportar = false;

  private filtro: BitacoraFilter = {};

  constructor(
    private bitacoraService: BitacoraService,
    private authService: AuthService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.cargarPermisoExportar();
    this.cargarRegistros();
  }

  onBuscar(filtro: BitacoraFilter): void {
    this.filtro = { ...filtro };
    this.page = 1;
    this.cargarRegistros();
  }

  onLimpiar(): void {
    this.filtro = {};
    this.page = 1;
    this.cargarRegistros();
  }

  onSeleccionarItem(
    item: RegistroBitacora
  ): void {
    this.filaSeleccionada =
      this.filaSeleccionada?.id === item.id
        ? null
        : item;
  }

  mostrarModalDetalle(): void {
    if (!this.filaSeleccionada) {
      return;
    }

    const modalRef = this.modalService.open(
      ModalDetalleAuditoriaComponent,
      {
        backdrop: 'static',
        keyboard: false,
        size: 'lg',
        centered: true,
        scrollable: true
      }
    );

    modalRef.componentInstance.titleModal =
      'DETALLE DE BITÁCORA';

    modalRef.componentInstance.data =
      this.filaSeleccionada;

    modalRef.result.catch(() => { });
  }

  onChangePaginate(
    event: IChangePaginate
  ): void {
    this.page = event.page;
    this.pageSize = event.pageSize;
    this.cargarRegistros();
  }

  exportarCsv(): void {
    if (!this.puedeExportar) {
      return;
    }

    const query: BitacoraQuery = {
      ...this.filtro,
      page: 1,
      pageSize: Number.MAX_SAFE_INTEGER
    };

    this.bitacoraService
      .listar(query)
      .subscribe((resultado) => {
        if (!resultado.items.length) {
          window.alert(
            'No existen registros para exportar.'
          );
          return;
        }

        const encabezados = [
          'ID',
          'FECHA',
          'USUARIO',
          'ACCIÓN',
          'MÓDULO',
          'ENTIDAD',
          'ID REGISTRO',
          'DETALLE',
          'RESULTADO'
        ];

        const filas = resultado.items.map(
          (registro) => [
            registro.id,
            registro.fecha,
            registro.nombreUsuario,
            registro.accion,
            registro.modulo,
            registro.entidad,
            registro.registroId ?? '',
            registro.detalle,
            registro.resultado
          ]
        );

        const contenido = [
          encabezados,
          ...filas
        ]
          .map((fila) =>
            fila
              .map((valor) =>
                this.escaparValorCsv(valor)
              )
              .join(';')
          )
          .join('\r\n');

        this.descargarCsv(contenido);
        this.registrarExportacion(
          resultado.items.length
        );
      });
  }
  private cargarRegistros(): void {
    const query: BitacoraQuery = {
      ...this.filtro,
      page: this.page,
      pageSize: this.pageSize
    };

    this.loading = true;
    this.filaSeleccionada = null;

    this.bitacoraService
      .listar(query)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe((resultado) => {
        this.registros = resultado.items;
        this.totalItems = resultado.totalItems;
      });
  }
  private cargarPermisoExportar(): void {
    this.authService
      .tienePermiso(
        ModuloSistema.BITACORA,
        AccionPermiso.EXPORTAR
      )
      .subscribe((permitido) => {
        this.puedeExportar = permitido;
      });
  }

  private escaparValorCsv(
    valor: string | number
  ): string {
    let texto = String(valor ?? '');

    if (/^[=+\-@]/.test(texto)) {
      texto = `'${texto}`;
    }

    texto = texto.replace(/"/g, '""');

    return `"${texto}"`;
  }

  private descargarCsv(contenido: string): void {
    const blob = new Blob(
      ['\uFEFF', contenido],
      {
        type: 'text/csv;charset=utf-8'
      }
    );

    const url = URL.createObjectURL(blob);
    const enlace = document.createElement('a');

    const fecha = new Date()
      .toISOString()
      .slice(0, 10);

    enlace.href = url;
    enlace.download =
      `bitacora-${fecha}.csv`;

    enlace.click();
    enlace.remove();
    URL.revokeObjectURL(url);
  }

  private registrarExportacion(
    cantidad: number
  ): void {
    const sesion =
      this.authService.obtenerSesionActual();

    if (!sesion) {
      return;
    }

    this.bitacoraService
      .registrar({
        usuarioId: sesion.usuarioId,
        nombreUsuario: sesion.nombreUsuario,
        modulo: ModuloSistema.BITACORA,
        accion: AccionBitacora.EXPORTAR,
        entidad: 'Bitácora',
        registroId: null,
        detalle:
          `Se exportaron ${cantidad} registros ` +
          'de bitácora.',
        resultado: ResultadoBitacora.EXITO
      })
      .subscribe();
  }
}