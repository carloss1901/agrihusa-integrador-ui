import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Output
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

import { MODULOS_SISTEMA_CONFIG } from '../../../../core/constants/modulos-sistema.constant';
import { AgrihusaButtonComponent } from '../../../../shared/components/agrihusa-button/agrihusa-button.component';
import {
  AccionBitacora,
  BitacoraFilter,
  MODULO_AUTENTICACION,
  ModuloBitacora,
  ResultadoBitacora
} from '../../models/bitacora.model';

interface SelectOption<T> {
  valor: T;
  descripcion: string;
}

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
export class FiltroAuditoriaComponent {
  @Output() buscar =
    new EventEmitter<BitacoraFilter>();

  @Output() limpiar =
    new EventEmitter<void>();

  readonly acciones:
    SelectOption<AccionBitacora>[] = [
      {
        valor: AccionBitacora.INICIO_SESION,
        descripcion: 'INICIO DE SESIÓN'
      },
      {
        valor:
          AccionBitacora.INICIO_SESION_FALLIDO,
        descripcion: 'INICIO DE SESIÓN FALLIDO'
      },
      {
        valor: AccionBitacora.CIERRE_SESION,
        descripcion: 'CIERRE DE SESIÓN'
      },
      {
        valor: AccionBitacora.CREAR,
        descripcion: 'CREAR'
      },
      {
        valor: AccionBitacora.EDITAR,
        descripcion: 'EDITAR'
      },
      {
        valor: AccionBitacora.ACTIVAR,
        descripcion: 'ACTIVAR'
      },
      {
        valor: AccionBitacora.DESACTIVAR,
        descripcion: 'DESACTIVAR'
      },
      {
        valor: AccionBitacora.CONSULTAR,
        descripcion: 'CONSULTAR'
      },
      {
        valor: AccionBitacora.EXPORTAR,
        descripcion: 'EXPORTAR'
      }
    ];

  readonly modulos:
    SelectOption<ModuloBitacora>[] = [
      {
        valor: MODULO_AUTENTICACION,
        descripcion: 'AUTENTICACIÓN'
      },
      ...MODULOS_SISTEMA_CONFIG.map(
        (modulo) => ({
          valor: modulo.codigo,
          descripcion: modulo.nombre.toUpperCase()
        })
      )
    ];

  readonly resultados:
    SelectOption<ResultadoBitacora>[] = [
      {
        valor: ResultadoBitacora.EXITO,
        descripcion: 'ÉXITO'
      },
      {
        valor: ResultadoBitacora.ERROR,
        descripcion: 'ERROR'
      }
    ];

  readonly formulario = new FormGroup({
    usuario: new FormControl('', {
      nonNullable: true
    }),
    accion:
      new FormControl<AccionBitacora | null>(
        null
      ),
    modulo:
      new FormControl<ModuloBitacora | null>(
        null
      ),
    resultado:
      new FormControl<ResultadoBitacora | null>(
        null
      ),
    fechaDesde: new FormControl('', {
      nonNullable: true
    }),
    fechaHasta: new FormControl('', {
      nonNullable: true
    })
  });

  errorRangoFecha = false;

  onBuscar(): void {
    const value = this.formulario.getRawValue();

    this.errorRangoFecha =
      !!value.fechaDesde &&
      !!value.fechaHasta &&
      value.fechaDesde > value.fechaHasta;

    if (this.errorRangoFecha) {
      return;
    }

    const filtro: BitacoraFilter = {};

    if (value.usuario.trim()) {
      filtro.usuario = value.usuario.trim();
    }

    if (value.accion !== null) {
      filtro.accion = value.accion;
    }

    if (value.modulo !== null) {
      filtro.modulo = value.modulo;
    }

    if (value.resultado !== null) {
      filtro.resultado = value.resultado;
    }

    if (value.fechaDesde) {
      filtro.fechaDesde = value.fechaDesde;
    }

    if (value.fechaHasta) {
      filtro.fechaHasta = value.fechaHasta;
    }

    this.buscar.emit(filtro);
  }

  onLimpiar(): void {
    this.formulario.reset({
      usuario: '',
      accion: null,
      modulo: null,
      resultado: null,
      fechaDesde: '',
      fechaHasta: ''
    });

    this.errorRangoFecha = false;
    this.limpiar.emit();
  }
}