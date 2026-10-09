import { Injectable } from '@angular/core';
import type { Borders, Cell, Column } from 'exceljs';
import { Observable, of, map } from 'rxjs';
import { DespachoControllerService } from '../../api/api/services/despacho-controller.service';
import { UnidadMedidaDespacho } from '../models/despacho.model';

import {
  ReporteDespachoFilter,
  ReporteDespachoItem,
  ResumenReporteDespacho
} from '../models/reporte-despacho.model';

@Injectable({
  providedIn: 'root'
})
export class ReporteDespachoService {
  constructor(private readonly api: DespachoControllerService) {}

  consultar(
    filtro: ReporteDespachoFilter
  ): Observable<ReporteDespachoItem[]> {
    return this.api.listarReporte({
      fechaDesde: filtro.fechaDesde,
      fechaHasta: filtro.fechaHasta,
      clienteId: filtro.clienteId,
      productoId: filtro.productoId,
      variedadId: filtro.variedadId,
      viaId: filtro.viaId,
      situacionId: filtro.situacionId,
      activo: filtro.estado
    }).pipe(
      map((items) => items.map((item) => ({
        id: item.despachoId ?? 0,
        codigo: item.codigo ?? '',
        fechaDespacho: item.fechaDespacho ?? '',
        fechaEstimadaLlegada: item.fechaEstimadaLlegada ?? '',
        cliente: item.cliente ?? 'NO DISPONIBLE',
        naviera: item.naviera ?? 'NO DISPONIBLE',
        destino: item.destino ?? 'NO DISPONIBLE',
        operadorLogistico: item.operadorLogistico ?? 'NO DISPONIBLE',
        puertoLlegada: item.puertoLlegada ?? 'NO DISPONIBLE',
        producto: item.producto ?? 'NO DISPONIBLE',
        variedad: item.variedad ?? 'NO DISPONIBLE',
        via: item.via ?? 'NO DISPONIBLE',
        situacion: item.situacion ?? 'NO DISPONIBLE',
        cantidad: item.cantidad ?? 0,
        unidadMedida: item.unidadMedida as UnidadMedidaDespacho,
        numeroContenedor: item.numeroContenedor ?? '',
        observaciones: item.observaciones ?? '',
        activo: item.activo ?? true
      })))
    );
  }

  obtenerResumen(
    items: ReporteDespachoItem[]
  ): ResumenReporteDespacho {
    return {
      totalRegistros: items.length,

      totalActivos: items.filter(
        (item) => item.activo
      ).length,

      totalEntregados: items.filter(
        (item) =>
          this.normalizarTexto(
            item.situacion
          ) === 'ENTREGADO'
      ).length,

      totalEnTransito: items.filter(
        (item) =>
          this.normalizarTexto(
            item.situacion
          ) === 'EN TRANSITO'
      ).length
    };
  }

  async exportarExcel(
    items: ReporteDespachoItem[]
  ): Promise<void> {
    const excelModule = await import('exceljs');
    const ExcelJS =
      (excelModule as any).default ??
      excelModule;

    const workbook =
      new ExcelJS.Workbook();

    workbook.creator = 'Sistema Agrihusa';
    workbook.lastModifiedBy =
      'Sistema Agrihusa';
    workbook.created = new Date();
    workbook.modified = new Date();

    const worksheet =
      workbook.addWorksheet(
        'Reporte de despachos',
        {
          views: [
            {
              state: 'frozen',
              ySplit: 5
            }
          ]
        }
      );

    worksheet.mergeCells('A1:Q1');

    const titulo =
      worksheet.getCell('A1');

    titulo.value =
      'REPORTE DE DESPACHOS';

    titulo.font = {
      name: 'Calibri',
      size: 18,
      bold: true,
      color: {
        argb: 'FFFFFFFF'
      }
    };

    titulo.alignment = {
      horizontal: 'center',
      vertical: 'middle'
    };

    titulo.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {
        argb: 'FF006837'
      }
    };

    worksheet.getRow(1).height = 34;

    worksheet.mergeCells('A2:Q2');

    const fechaGeneracion =
      worksheet.getCell('A2');

    fechaGeneracion.value =
      `Generado el ${new Date().toLocaleString(
        'es-PE'
      )}`;

    fechaGeneracion.font = {
      italic: true,
      color: {
        argb: 'FF5F6B66'
      }
    };

    fechaGeneracion.alignment = {
      horizontal: 'right',
      vertical: 'middle'
    };

    const resumen =
      this.obtenerResumen(items);

    const indicadores = [
      {
        rango: 'A3:C3',
        celda: 'A3',
        texto:
          `TOTAL DE DESPACHOS: ${
            resumen.totalRegistros
          }`,
        color: 'FF0D6EFD'
      },
      {
        rango: 'E3:G3',
        celda: 'E3',
        texto:
          `REGISTROS ACTIVOS: ${
            resumen.totalActivos
          }`,
        color: 'FF198754'
      },
      {
        rango: 'I3:K3',
        celda: 'I3',
        texto:
          `EN TRÃNSITO: ${
            resumen.totalEnTransito
          }`,
        color: 'FFF59E0B'
      },
      {
        rango: 'M3:O3',
        celda: 'M3',
        texto:
          `ENTREGADOS: ${
            resumen.totalEntregados
          }`,
        color: 'FF6F42C1'
      }
    ];

    indicadores.forEach(
      (indicador) => {
        worksheet.mergeCells(
          indicador.rango
        );

        const celda =
          worksheet.getCell(
            indicador.celda
          );

        celda.value = indicador.texto;

        celda.font = {
          bold: true,
          color: {
            argb: 'FFFFFFFF'
          }
        };

        celda.alignment = {
          horizontal: 'center',
          vertical: 'middle'
        };

        celda.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: {
            argb: indicador.color
          }
        };

        celda.border =
          this.obtenerBordeCelda();
      }
    );

    worksheet.getRow(3).height = 27;

    const filas = items.map(
      (item) => [
        this.protegerFormulaExcel(
          item.codigo
        ),
        item.fechaDespacho,
        item.fechaEstimadaLlegada,
        this.protegerFormulaExcel(
          item.cliente
        ),
        this.protegerFormulaExcel(
          item.naviera
        ),
        this.protegerFormulaExcel(
          item.destino
        ),
        this.protegerFormulaExcel(
          item.operadorLogistico
        ),
        this.protegerFormulaExcel(
          item.puertoLlegada
        ),
        this.protegerFormulaExcel(
          item.producto
        ),
        this.protegerFormulaExcel(
          item.variedad
        ),
        this.protegerFormulaExcel(
          item.via
        ),
        this.protegerFormulaExcel(
          item.situacion
        ),
        item.cantidad,
        this.protegerFormulaExcel(
          item.unidadMedida
        ),
        this.protegerFormulaExcel(
          item.numeroContenedor
        ),
        this.protegerFormulaExcel(
          item.observaciones
        ),
        item.activo
          ? 'ACTIVO'
          : 'INACTIVO'
      ]
    );

    worksheet.addTable({
      name: 'TablaReporteDespachos',
      ref: 'A5',
      headerRow: true,
      totalsRow: false,
      style: {
        theme: 'TableStyleMedium4',
        showFirstColumn: false,
        showLastColumn: false,
        showRowStripes: true,
        showColumnStripes: false
      },
      columns: [
        {
          name: 'CÃ³digo',
          filterButton: true
        },
        {
          name: 'Fecha despacho',
          filterButton: true
        },
        {
          name: 'Llegada estimada',
          filterButton: true
        },
        {
          name: 'Cliente',
          filterButton: true
        },
        {
          name: 'Naviera',
          filterButton: true
        },
        {
          name: 'Destino',
          filterButton: true
        },
        {
          name: 'Operador logÃ­stico',
          filterButton: true
        },
        {
          name: 'Puerto de llegada',
          filterButton: true
        },
        {
          name: 'Producto',
          filterButton: true
        },
        {
          name: 'Variedad',
          filterButton: true
        },
        {
          name: 'VÃ­a',
          filterButton: true
        },
        {
          name: 'SituaciÃ³n',
          filterButton: true
        },
        {
          name: 'Cantidad',
          filterButton: true
        },
        {
          name: 'Unidad',
          filterButton: true
        },
        {
          name: 'Contenedor',
          filterButton: true
        },
        {
          name: 'Observaciones',
          filterButton: true
        },
        {
          name: 'Estado',
          filterButton: true
        }
      ],
      rows: filas
    });

    const filaEncabezado =
      worksheet.getRow(5);

    filaEncabezado.height = 30;

    filaEncabezado.eachCell(
      (cell: Cell) => {
        cell.font = {
          bold: true,
          color: {
            argb: 'FFFFFFFF'
          }
        };

        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: {
            argb: 'FF006837'
          }
        };

        cell.alignment = {
          horizontal: 'center',
          vertical: 'middle',
          wrapText: true
        };

        cell.border =
          this.obtenerBordeCelda();
      }
    );

    for (
      let numeroFila = 6;
      numeroFila <= items.length + 5;
      numeroFila++
    ) {
      const fila =
        worksheet.getRow(numeroFila);

      fila.height = 23;

      fila.eachCell((cell: Cell) => {
        cell.alignment = {
          vertical: 'middle',
          wrapText: false
        };

        cell.border =
          this.obtenerBordeCelda();
      });

      fila.getCell(13).numFmt =
        '#,##0.00';

      const situacion = String(
        fila.getCell(12).value ?? ''
      );

      const coloresSituacion =
        this.obtenerColoresSituacion(
          situacion
        );

      const celdaSituacion =
        fila.getCell(12);

      celdaSituacion.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb:
            coloresSituacion.fondo
        }
      };

      celdaSituacion.font = {
        bold: true,
        color: {
          argb:
            coloresSituacion.texto
        }
      };

      celdaSituacion.alignment = {
        horizontal: 'center',
        vertical: 'middle'
      };

      const celdaEstado =
        fila.getCell(17);

      const estaActivo =
        celdaEstado.value === 'ACTIVO';

      celdaEstado.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: estaActivo
            ? 'FFD1E7DD'
            : 'FFF8D7DA'
        }
      };

      celdaEstado.font = {
        bold: true,
        color: {
          argb: estaActivo
            ? 'FF0F5132'
            : 'FF842029'
        }
      };

      celdaEstado.alignment = {
        horizontal: 'center',
        vertical: 'middle'
      };
    }

    const anchos = [
      18,
      17,
      18,
      28,
      24,
      24,
      28,
      25,
      20,
      20,
      16,
      20,
      14,
      15,
      20,
      38,
      14
    ];

    worksheet.columns.forEach(
      (columna: Column, indice: number) => {
        columna.width =
          anchos[indice];
      }
    );

    worksheet.getColumn(2).alignment = {
      horizontal: 'center'
    };

    worksheet.getColumn(3).alignment = {
      horizontal: 'center'
    };

    worksheet.getColumn(13).alignment = {
      horizontal: 'right'
    };

    worksheet.getColumn(14).alignment = {
      horizontal: 'center'
    };

    worksheet.getColumn(17).alignment = {
      horizontal: 'center'
    };

    worksheet.pageSetup = {
      orientation: 'landscape',
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
      paperSize: 9,
      margins: {
        left: 0.25,
        right: 0.25,
        top: 0.5,
        bottom: 0.5,
        header: 0.2,
        footer: 0.2
      }
    };

    const buffer =
      await workbook.xlsx.writeBuffer();

    const bytes =
      new Uint8Array(buffer);

    const contenido =
      bytes.buffer.slice(
        bytes.byteOffset,
        bytes.byteOffset +
          bytes.byteLength
      ) as ArrayBuffer;

    const archivo = new Blob(
      [contenido],
      {
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    );

    const url =
      URL.createObjectURL(archivo);

    const enlace =
      document.createElement('a');

    const fecha = new Date()
      .toISOString()
      .slice(0, 10);

    enlace.href = url;
    enlace.download =
      `reporte-despachos-${fecha}.xlsx`;

    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);

    URL.revokeObjectURL(url);
  }

  private crearMapa<
    T extends { id: number }
  >(
    items: T[]
  ): Map<number, T> {
    return new Map(
      items.map(
        (item) => [item.id, item]
      )
    );
  }

  private obtenerColoresSituacion(
    situacion: string
  ): {
    fondo: string;
    texto: string;
  } {
    const nombre =
      this.normalizarTexto(situacion);

    switch (nombre) {
      case 'PROGRAMADO':
        return {
          fondo: 'FFD6E4FF',
          texto: 'FF084298'
        };

      case 'EN PREPARACION':
        return {
          fondo: 'FFFFE5B4',
          texto: 'FF7A3E00'
        };

      case 'DESPACHADO':
        return {
          fondo: 'FFE2D9F3',
          texto: 'FF432874'
        };

      case 'EN TRANSITO':
        return {
          fondo: 'FFFFF3CD',
          texto: 'FF664D03'
        };

      case 'ENTREGADO':
        return {
          fondo: 'FFD1E7DD',
          texto: 'FF0F5132'
        };

      case 'CANCELADO':
        return {
          fondo: 'FFF8D7DA',
          texto: 'FF842029'
        };

      case 'OBSERVADO':
        return {
          fondo: 'FFFFE5D0',
          texto: 'FF984C0C'
        };

      default:
        return {
          fondo: 'FFE9ECEF',
          texto: 'FF343A40'
        };
    }
  }

  private protegerFormulaExcel(
    valor: string | null | undefined
  ): string {
    const texto =
      String(valor ?? '');

    if (/^[=+\-@]/.test(texto)) {
      return `'${texto}`;
    }

    return texto;
  }

  private obtenerBordeCelda():
    Partial<Borders> {
    return {
      top: {
        style: 'thin',
        color: {
          argb: 'FFD9E2DD'
        }
      },
      left: {
        style: 'thin',
        color: {
          argb: 'FFD9E2DD'
        }
      },
      bottom: {
        style: 'thin',
        color: {
          argb: 'FFD9E2DD'
        }
      },
      right: {
        style: 'thin',
        color: {
          argb: 'FFD9E2DD'
        }
      }
    };
  }

  private normalizarTexto(
    valor: string
  ): string {
    return valor
      .normalize('NFD')
      .replace(
        /[\u0300-\u036f]/g,
        ''
      )
      .toUpperCase();
  }
}


