import { CommonModule } from '@angular/common';
import {
    Component,
    EventEmitter,
    Input,
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
import { Rol } from '../../../roles/models/rol.model';
import { UsuarioFilter } from '../../models/usuario.model';

interface EstadoOption {
    valor: boolean;
    descripcion: string;
}

@Component({
    selector: 'app-filtro-usuarios',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgbAccordionModule,
        NgSelectModule,
        AgrihusaButtonComponent
    ],
    templateUrl: './filtro-usuarios.component.html'
})
export class FiltroUsuariosComponent {
    @Input() roles: Rol[] = [];

    @Output() buscar = new EventEmitter<UsuarioFilter>();
    @Output() limpiar = new EventEmitter<void>();

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
        rolId: new FormControl<number | null>(null),
        estado: new FormControl<boolean | null>(null)
    });

    onBuscar(): void {
        const value = this.formulario.getRawValue();
        const filtro: UsuarioFilter = {};

        if (value.texto.trim()) {
            filtro.texto = value.texto.trim();
        }

        if (value.rolId !== null) {
            filtro.rolId = value.rolId;
        }

        if (value.estado !== null) {
            filtro.estado = value.estado;
        }

        this.buscar.emit(filtro);
    }

    onLimpiar(): void {
        this.formulario.reset({
            texto: '',
            rolId: null,
            estado: null
        });

        this.limpiar.emit();
    }
}