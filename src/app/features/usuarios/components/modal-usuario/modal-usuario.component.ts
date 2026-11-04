import { CommonModule } from '@angular/common';
import {
    Component,
    Input,
    OnInit
} from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

import { AgrihusaButtonComponent } from '../../../../shared/components/agrihusa-button/agrihusa-button.component';
import { SoloNumerosDirective } from '../../../../shared/directives/dni.directive';
import { Rol } from '../../../../core/models/rol.model';
import {
    Usuario,
    UsuarioActualizarData,
    UsuarioCrearData
} from '../../../../core/models/usuario.model';

type NombreControl =
    | 'nombreUsuario'
    | 'nombres'
    | 'apellidoPaterno'
    | 'apellidoMaterno'
    | 'correo'
    | 'telefono'
    | 'rolId';

export type UsuarioModalResult =
    | {
        modo: 'crear';
        data: UsuarioCrearData;
    }
    | {
        modo: 'editar';
        data: UsuarioActualizarData;
    };

@Component({
    selector: 'app-modal-usuario',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgSelectModule,
        AgrihusaButtonComponent,
        SoloNumerosDirective
    ],
    templateUrl: './modal-usuario-form.html',
    styleUrls: ['./modal-usuario.component.scss']
})
export class ModalUsuarioComponent implements OnInit {
    @Input() titleModal = '';
    @Input() roles: Rol[] = [];
    private dataInterna: Usuario | null = null;

    rolesDisponibles: Rol[] = [];

    @Input()
    set data(value: Usuario | null) {
        this.dataInterna = value;
    }

    get data(): Usuario | null {
        return this.dataInterna;
    }

    submitted = false;
    readonly formulario = new FormGroup({
        nombreUsuario: new FormControl('', {
            nonNullable: true,
            validators: [
                Validators.required,
                Validators.maxLength(8),
                Validators.pattern(/^\d+$/)
            ]
        }),
        nombres: new FormControl('', {
            nonNullable: true,
            validators: [
                Validators.required,
                Validators.maxLength(80)
            ]
        }),
        apellidoPaterno: new FormControl('', {
            nonNullable: true,
            validators: [
                Validators.required,
                Validators.maxLength(80)
            ]
        }),
        apellidoMaterno: new FormControl('', {
            nonNullable: true,
            validators: [
                Validators.required,
                Validators.maxLength(80)
            ]
        }),
        correo: new FormControl('', {
            nonNullable: true,
            validators: [
                Validators.required,
                Validators.email,
                Validators.maxLength(120)
            ]
        }),
        telefono: new FormControl('', {
            nonNullable: true,
            validators: [
                Validators.maxLength(9),
                Validators.pattern(/^\d*$/)
            ]
        }),
        rolId: new FormControl<number | null>(null, {
            validators: [Validators.required]
        })
    });

    constructor(
        public activeModal: NgbActiveModal
    ) { }

    ngOnInit(): void {
        this.rolesDisponibles = this.roles.filter((rol) => rol.id !== 1);

        if (!this.data) {
            return;
        }

        this.formulario.patchValue({
            nombreUsuario: this.data.nombreUsuario,
            nombres: this.data.nombres,
            apellidoPaterno: this.data.apellidos.trim().split(/\s+/).shift() ?? '',
            apellidoMaterno: this.data.apellidos.trim().split(/\s+/).slice(1).join(' '),
            correo: this.data.correo,
            telefono: this.data.telefono,
            rolId: this.data.rolId
        });

        if (this.data.esSistema) {
            this.formulario.controls.nombreUsuario.disable();
            this.formulario.controls.rolId.disable();
        }
    }

    get modoEdicion(): boolean {
        return this.data !== null;
    }

    onGuardar(): void {
        this.submitted = true;
        this.formulario.markAllAsTouched();

        if (this.formulario.invalid) {
            return;
        }

        const value = this.formulario.getRawValue();

        const datosBase: UsuarioActualizarData = {
            nombreUsuario: value.nombreUsuario.trim(),
            nombres: value.nombres.trim(),
            apellidoPaterno: value.apellidoPaterno.trim(),
            apellidoMaterno: value.apellidoMaterno.trim(),
            correo: value.correo.trim(),
            telefono: value.telefono.trim(),
            rolId: value.rolId as number
        };

        if (this.modoEdicion) {
            const resultado: UsuarioModalResult = {
                modo: 'editar',
                data: datosBase
            };

            this.activeModal.close(resultado);
            return;
        }

        const resultado: UsuarioModalResult = {
            modo: 'crear',
            data: datosBase
        };

        this.activeModal.close(resultado);
    }

    onCerrarModal(): void {
        this.activeModal.dismiss();
    }

    controlInvalido(
        nombreControl: NombreControl
    ): boolean {
        const control =
            this.formulario.controls[nombreControl];

        return (
            control.invalid &&
            (control.touched || this.submitted)
        );
    }

}
