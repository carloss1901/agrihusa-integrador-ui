import { Injectable } from '@angular/core';
import type { Borders } from 'exceljs';
import {
  forkJoin,
  map,
  Observable
} from 'rxjs';
import {
  ReporteDespachoFilter,
  ReporteDespachoItem,
  ResumenReporteDespacho
} from '../models/reporte-despacho.model';
import { ClienteService } from '../../clientes/services/cliente.service';
import { DestinoService } from '../../destinos/services/destino.service';
import { NavieraService } from '../../navieras/services/naviera.service';
import { OperadorLogisticoService } from '../../operadores-logisticos/services/operador-logistico.service';
import { ProductoService } from '../../productos/services/producto.service';
import { PuertoLlegadaService } from '../../puertos-llegada/services/puerto-llegada.service';
import { DespachoService } from '../../registro-despacho/services/despacho.service';
import { SituacionService } from '../../situaciones/services/situacion.service';
import { VariedadService } from '../../variedades/services/variedad.service';
import { ViaService } from '../../vias/services/via.service';

@Injectable({
  providedIn: 'root'
})
export class ReporteDespachoService {
  constructor(
    private despachoService: DespachoService,
    private clienteService: ClienteService,
    private navieraService: NavieraService,
    private destinoService: DestinoService,
    private operadorService: OperadorLogisticoService,
    private puertoService: PuertoLlegadaService,
    private productoService: ProductoService,
    private variedadService: VariedadService,
    private viaService: ViaService,
    private situacionService: SituacionService
  ) {}

  consultar(
    filtro: ReporteDespachoFilter
  ): Observable<ReporteDespachoItem[]> {
    const consultaCatalogo = {
      page: 1,
      pageSize: 1000
    };

    return forkJoin({
      despachos: this.despachoService.listar({
        page: 1,
        pageSize: 1000,
        fechaDesde: filtro.fechaDesde,
        fechaHasta: filtro.fechaHasta,
        clienteId: filtro.clienteId,
        productoId: filtro.productoId,
        situacionId: filtro.situacionId,
        estado: filtro.estado
      }),
      clientes:
        this.clienteService.listar(consultaCatalogo),
      navieras:
        this.navieraService.listar(consultaCatalogo),
      destinos:
        this.destinoService.listar(consultaCatalogo),
      operadores:
        this.operadorService.listar(consultaCatalogo),
      puertos:
        this.puertoService.listar(consultaCatalogo),
      productos:
        this.productoService.listar(consultaCatalogo),
      variedades:
        this.variedadService.listar(consultaCatalogo),
      vias:
        this.viaService.listar(consultaCatalogo),
      situaciones:
        this.situacionService.listar(consultaCatalogo)
    }).pipe(
      map((respuesta) => {
        const clientes = this.crearMapa(
          respuesta.clientes.items
        );
        const navieras = this.crearMapa(
          respuesta.navieras.items
        );
        const destinos = this.crearMapa(
          respuesta.destinos.items
        );
        const operadores = this.crearMapa(
          respuesta.operadores.items
        );
        const puertos = this.crearMapa(
          respuesta.puertos.items
        );
        const productos = this.crearMapa(
          respuesta.productos.items
        );
        const variedades = this.crearMapa(
          respuesta.variedades.items
        );
        const vias = this.crearMapa(
          respuesta.vias.items
        );
        const situaciones = this.crearMapa(
          respuesta.situaciones.items
        );

        return respuesta.despachos.items
          .filter((despacho) => {
            if (
              filtro.variedadId !== undefined &&
              despacho.variedadId !==
                filtro.variedadId
            ) {
              return false;
            }

            if (
              filtro.viaId !== undefined &&
              despacho.viaId !== filtro.viaId
            ) {
              return false;
            }

            return true;
          })
          .sort((a, b) =>
            b.fechaDespacho.localeCompare(
              a.fechaDespacho
            )
          )
          .map(
            (
              despacho
            ): ReporteDespachoItem => {
              const cliente = clientes.get(
                despacho.clienteId
              );
              const naviera = navieras.get(
                despacho.navieraId
              );
              const destino = destinos.get(
                despacho.destinoId
              );
              const operador = operadores.get(
                despacho.operadorLogisticoId
              );
              const puerto = puertos.get(
                despacho.puertoLlegadaId
              );
              const producto = productos.get(
                despacho.productoId
              );
              const variedad = variedades.get(
                despacho.variedadId
              );
              const via = vias.get(
                despacho.viaId
              );
              const situacion = situaciones.get(
                despacho.situacionId
              );

              return {
                id: despacho.id,
                codigo: despacho.codigo,
                fechaDespacho:
                  despacho.fechaDespacho,
                fechaEstimadaLlegada:
                  despacho.fechaEstimadaLlegada,
                cliente:
                  cliente?.nombreComercial ||
                  cliente?.razonSocial ||
                  'NO DISPONIBLE',
                naviera:
                  naviera?.nombre ??
                  'NO DISPONIBLE',
                destino: destino
                  ? `${destino.ciudad}, ${destino.pais}`
                  : 'NO DISPONIBLE',
                operadorLogistico:
                  operador?.nombreComercial ||
                  operador?.razonSocial ||
                  'NO DISPONIBLE',
                puertoLlegada: puerto
                  ? `${puerto.puerto}, ${puerto.pais}`
                  : 'NO DISPONIBLE',
                producto:
                  producto?.nombre ??
                  'NO DISPONIBLE',
                variedad:
                  variedad?.nombre ??
                  'NO DISPONIBLE',
                via:
                  via?.descripcion ??
                  'NO DISPONIBLE',
                situacion:
                  situacion?.descripcion ??
                  'NO DISPONIBLE',
                cantidad: despacho.cantidad,
                unidadMedida:
                  despacho.unidadMedida,
                numeroContenedor:
                  despacho.numeroContenedor,
                observaciones:
                  despacho.observaciones,
                activo: despacho.activo
              };
            }
          );
      })
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
    const ExcelJS = await import('exceljs');

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
          `EN TRÁNSITO: ${
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
          name: 'Código',
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
          name: 'Operador logístico',
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
          name: 'Vía',
          filterButton: true
        },
        {
          name: 'Situación',
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
      (cell) => {
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

      fila.eachCell((cell) => {
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
      (columna, indice) => {
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