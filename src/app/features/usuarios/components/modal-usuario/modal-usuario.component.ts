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
import { Rol } from '../../../roles/models/rol.model';
import {
    Usuario,
    UsuarioActualizarData,
    UsuarioCrearData
} from '../../models/usuario.model';

type NombreControl =
    | 'nombreUsuario'
    | 'nombres'
    | 'apellidos'
    | 'correo'
    | 'telefono'
    | 'rolId'
    | 'password';

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
        AgrihusaButtonComponent
    ],
    templateUrl: './modal-usuario.component.html',
    styleUrls: ['./modal-usuario.component.scss']
})
export class ModalUsuarioComponent implements OnInit {
    @Input() titleModal = '';
    private dataInterna: Usuario | null = null;
    private rolesInternos: Rol[] = [];

    rolesDisponibles: Rol[] = [];

    @Input()
    set data(value: Usuario | null) {
        this.dataInterna = value;
        this.actualizarRolesDisponibles();
    }

    get data(): Usuario | null {
        return this.dataInterna;
    }

    @Input()
    set roles(value: Rol[]) {
        this.rolesInternos = value ?? [];
        this.actualizarRolesDisponibles();
    }

    submitted = false;
    mostrarPassword = false;

    readonly estados = [
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
        nombreUsuario: new FormControl('', {
            nonNullable: true,
            validators: [
                Validators.required,
                Validators.maxLength(30),
                Validators.pattern(/^[A-Za-z0-9._-]+$/)
            ]
        }),
        nombres: new FormControl('', {
            nonNullable: true,
            validators: [
                Validators.required,
                Validators.maxLength(80)
            ]
        }),
        apellidos: new FormControl('', {
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
                Validators.maxLength(20),
                Validators.pattern(/^[0-9+\s()-]*$/)
            ]
        }),
        rolId: new FormControl<number | null>(null, {
            validators: [Validators.required]
        }),
        activo: new FormControl(true, {
            nonNullable: true
        }),
        password: new FormControl('', {
            nonNullable: true,
            validators: [
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(64),
                Validators.pattern(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/
                )
            ]
        })
    });

    constructor(
        public activeModal: NgbActiveModal
    ) { }

    ngOnInit(): void {
        if (!this.data) {
            return;
        }

        this.formulario.patchValue({
            nombreUsuario: this.data.nombreUsuario,
            nombres: this.data.nombres,
            apellidos: this.data.apellidos,
            correo: this.data.correo,
            telefono: this.data.telefono,
            rolId: this.data.rolId,
            activo: this.data.activo
        });

        const passwordControl =
            this.formulario.controls.password;

        passwordControl.clearValidators();
        passwordControl.updateValueAndValidity();

        if (this.data.esSistema) {
            this.formulario.controls.nombreUsuario.disable();
            this.formulario.controls.rolId.disable();
            this.formulario.controls.activo.disable();
        }
    }

    get modoEdicion(): boolean {
        return this.data !== null;
    }

    alternarVisibilidadPassword(): void {
        this.mostrarPassword = !this.mostrarPassword;
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
            apellidos: value.apellidos.trim(),
            correo: value.correo.trim(),
            telefono: value.telefono.trim(),
            rolId: value.rolId as number,
            activo: value.activo
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
            data: {
                ...datosBase,
                password: value.password
            }
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

    private actualizarRolesDisponibles(): void {
        this.rolesDisponibles =
            this.rolesInternos.filter(
                (rol) =>
                    rol.activo ||
                    rol.id === this.dataInterna?.rolId
            );
    }
}