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

import { AgrihusaButtonComponent } from '../../../../shared/components/agrihusa-button/agrihusa-button.component';
import {
    ClienteFilter,
    TipoDocumentoCliente
} from '../../models/cliente.model';

interface TipoDocumentoOption {
    valor: TipoDocumentoCliente;
    descripcion: string;
}

interface EstadoOption {
    valor: boolean;
    descripcion: string;
}

@Component({
    selector: 'app-filtro-clientes',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgbAccordionModule,
        NgSelectModule,
        AgrihusaButtonComponent
    ],
    templateUrl: './filtro-clientes.component.html'
})
export class FiltroClientesComponent {
    @Output()
    buscar = new EventEmitter<ClienteFilter>();

    @Output()
    limpiar = new EventEmitter<void>();

    readonly tiposDocumento: TipoDocumentoOption[] = [
        {
            valor: TipoDocumentoCliente.RUC,
            descripcion: 'RUC'
        },
        {
            valor: TipoDocumentoCliente.DNI,
            descripcion: 'DNI'
        },
        {
            valor: TipoDocumentoCliente.CARNET_EXTRANJERIA,
            descripcion: 'CARNET DE EXTRANJERÍA'
        },
        {
            valor: TipoDocumentoCliente.PASAPORTE,
            descripcion: 'PASAPORTE'
        },
        {
            valor: TipoDocumentoCliente.OTRO,
            descripcion: 'OTRO'
        }
    ];

    readonly estados: EstadoOption[] = [
        {
            valor: true,
            descripcion: 'ACTIVO'
        },
        {
            valor: false,
            descripcion: 'INACTIVO'
        }
    ];

    readonly formulario = new FormGroup({
        texto: new FormControl('', {
            nonNullable: true
        }),
        tipoDocumento:
            new FormControl<TipoDocumentoCliente | null>(
                null
            ),
        estado: new FormControl<boolean | null>(null)
    });

    onBuscar(): void {
        const value = this.formulario.getRawValue();
        const filtro: ClienteFilter = {};

        if (value.texto.trim()) {
            filtro.texto = value.texto.trim();
        }

        if (value.tipoDocumento !== null) {
            filtro.tipoDocumento = value.tipoDocumento;
        }

        if (value.estado !== null) {
            filtro.estado = value.estado;
        }

        this.buscar.emit(filtro);
    }

    onLimpiar(): void {
        this.formulario.reset({
            texto: '',
            tipoDocumento: null,
            estado: null
        });

        this.limpiar.emit();
    }
}