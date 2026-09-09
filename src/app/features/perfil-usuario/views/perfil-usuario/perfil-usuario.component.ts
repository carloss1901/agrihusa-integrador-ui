import { CommonModule } from '@angular/common';
import {
    Component,
    OnInit
} from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';
import {
    EMPTY,
    finalize,
    forkJoin,
    switchMap
} from 'rxjs';

import {
    AccionPermiso,
    ModuloSistema
} from '../../../../core/models/permiso.model';
import { AuthService } from '../../../../core/services/auth.service';
import { AgrihusaButtonComponent } from '../../../../shared/components/agrihusa-button/agrihusa-button.component';
import { AgrihusaTopBarComponent } from '../../../../shared/components/agrihusa-topbar/agrihusa-topbar.component';
import {
    AccionBitacora,
    ResultadoBitacora
} from '../../../auditoria/models/bitacora.model';
import { BitacoraService } from '../../../auditoria/services/bitacora.service';
import { RolService } from '../../../roles/services/rol.service';
import { Usuario } from '../../../usuarios/models/usuario.model';
import { UsuarioService } from '../../../usuarios/services/usuario.service';
import {
    CambioPasswordData,
    PerfilUsuarioActualizarData
} from '../../models/perfil-usuario.model';

type ControlPerfil =
    | 'nombres'
    | 'apellidos'
    | 'correo'
    | 'telefono';

type ControlPassword =
    | 'passwordActual'
    | 'nuevaPassword'
    | 'confirmarPassword';

@Component({
    selector: 'app-perfil-usuario',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AgrihusaTopBarComponent,
        AgrihusaButtonComponent
    ],
    templateUrl: './perfil-usuario.component.html',
    styleUrls: ['./perfil-usuario.component.scss']
})
export class PerfilUsuarioComponent
    implements OnInit {
    readonly titulo = 'Perfil de Usuario';

    usuarioActual: Usuario | null = null;
    nombreRol = '';
    puedeEditar = false;
    cargando = true;
    guardando = false;
    submitted = false;
    mensajeExito = '';
    mensajeError = '';
    cambiandoPassword = false;
    submittedPassword = false;
    mostrarPasswordActual = false;
    mostrarNuevaPassword = false;
    mostrarConfirmacionPassword = false;
    mensajePasswordExito = '';
    mensajePasswordError = '';

    readonly formulario = new FormGroup({
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
        })
    });

    readonly formularioPassword = new FormGroup({
        passwordActual: new FormControl('', {
            nonNullable: true,
            validators: [
                Validators.required,
                Validators.maxLength(64)
            ]
        }),
        nuevaPassword: new FormControl('', {
            nonNullable: true,
            validators: [
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(64),
                Validators.pattern(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/
                )
            ]
        }),
        confirmarPassword: new FormControl('', {
            nonNullable: true,
            validators: [
                Validators.required,
                Validators.maxLength(64)
            ]
        })
    });

    constructor(
        private authService: AuthService,
        private usuarioService: UsuarioService,
        private rolService: RolService,
        private bitacoraService: BitacoraService
    ) { }

    ngOnInit(): void {
        this.cargarPerfil();
    }

    guardarPerfil(): void {
        if (
            !this.puedeEditar ||
            !this.usuarioActual
        ) {
            return;
        }

        this.submitted = true;
        this.mensajeExito = '';
        this.mensajeError = '';
        this.formulario.markAllAsTouched();

        if (this.formulario.invalid) {
            return;
        }

        const value = this.formulario.getRawValue();

        const data: PerfilUsuarioActualizarData = {
            nombres: value.nombres.trim(),
            apellidos: value.apellidos.trim(),
            correo: value.correo.trim(),
            telefono: value.telefono.trim()
        };

        this.guardando = true;

        this.usuarioService
            .existeCorreo(
                data.correo,
                this.usuarioActual.id
            )
            .pipe(
                switchMap((existeCorreo) => {
                    if (existeCorreo) {
                        this.mensajeError =
                            'El correo ya pertenece a otro usuario.';
                        return EMPTY;
                    }

                    return this.usuarioService
                        .actualizarPerfil(
                            this.usuarioActual!.id,
                            data
                        );
                }),
                finalize(() => {
                    this.guardando = false;
                })
            )
            .subscribe((usuarioActualizado) => {
                if (!usuarioActualizado) {
                    this.mensajeError =
                        'No fue posible actualizar el perfil.';
                    return;
                }

                this.usuarioActual = usuarioActualizado;
                this.authService
                    .actualizarSesionDesdeUsuario(
                        usuarioActualizado
                    );

                this.registrarActualizacionPerfil(
                    usuarioActualizado
                );

                this.submitted = false;
                this.mensajeExito =
                    'El perfil se actualizó correctamente.';
            });
    }

    controlInvalido(
        nombreControl: ControlPerfil
    ): boolean {
        const control =
            this.formulario.controls[nombreControl];

        return (
            control.invalid &&
            (control.touched || this.submitted)
        );
    }

    formatearUltimoAcceso(
        fechaIso: string | null
    ): string {
        if (!fechaIso) {
            return 'Sin acceso registrado';
        }

        const fecha = new Date(fechaIso);

        if (Number.isNaN(fecha.getTime())) {
            return 'Fecha no disponible';
        }

        return new Intl.DateTimeFormat('es-PE', {
            dateStyle: 'long',
            timeStyle: 'short'
        }).format(fecha);
    }

    cambiarPassword(): void {
        if (!this.usuarioActual) {
            return;
        }

        this.submittedPassword = true;
        this.mensajePasswordExito = '';
        this.mensajePasswordError = '';
        this.formularioPassword.markAllAsTouched();

        if (this.formularioPassword.invalid) {
            return;
        }

        const value =
            this.formularioPassword.getRawValue();

        const data: CambioPasswordData = {
            passwordActual: value.passwordActual,
            nuevaPassword: value.nuevaPassword,
            confirmarPassword:
                value.confirmarPassword
        };

        if (
            data.nuevaPassword !==
            data.confirmarPassword
        ) {
            this.mensajePasswordError =
                'La confirmación no coincide con la nueva contraseña.';
            return;
        }

        this.cambiandoPassword = true;

        this.usuarioService
            .cambiarPassword(
                this.usuarioActual.id,
                {
                    passwordActual: data.passwordActual,
                    nuevaPassword: data.nuevaPassword
                }
            )
            .pipe(
                switchMap((resultado) => {
                    if (!resultado.success) {
                        this.mensajePasswordError =
                            resultado.message;

                        this.registrarCambioPassword(
                            ResultadoBitacora.ERROR
                        );

                        return EMPTY;
                    }

                    this.mensajePasswordExito =
                        resultado.message;

                    return this.usuarioService.obtenerPorId(
                        this.usuarioActual!.id
                    );
                }),
                finalize(() => {
                    this.cambiandoPassword = false;
                })
            )
            .subscribe((usuarioActualizado) => {
                if (!usuarioActualizado) {
                    return;
                }

                this.usuarioActual = usuarioActualizado;

                this.authService
                    .actualizarSesionDesdeUsuario(
                        usuarioActualizado
                    );

                this.registrarCambioPassword(
                    ResultadoBitacora.EXITO
                );

                this.formularioPassword.reset({
                    passwordActual: '',
                    nuevaPassword: '',
                    confirmarPassword: ''
                });

                this.submittedPassword = false;
                this.mostrarPasswordActual = false;
                this.mostrarNuevaPassword = false;
                this.mostrarConfirmacionPassword = false;
            });
    }

    alternarPassword(
        campo: 'actual' | 'nueva' | 'confirmacion'
    ): void {
        if (campo === 'actual') {
            this.mostrarPasswordActual =
                !this.mostrarPasswordActual;
            return;
        }

        if (campo === 'nueva') {
            this.mostrarNuevaPassword =
                !this.mostrarNuevaPassword;
            return;
        }

        this.mostrarConfirmacionPassword =
            !this.mostrarConfirmacionPassword;
    }

    controlPasswordInvalido(
        nombreControl: ControlPassword
    ): boolean {
        const control =
            this.formularioPassword.controls[
            nombreControl
            ];

        return (
            control.invalid &&
            (
                control.touched ||
                this.submittedPassword
            )
        );
    }

    private cargarPerfil(): void {
        const sesion =
            this.authService.obtenerSesionActual();

        if (!sesion) {
            this.mensajeError =
                'No existe una sesión activa.';
            this.cargando = false;
            return;
        }

        forkJoin({
            usuario:
                this.usuarioService.obtenerPorId(
                    sesion.usuarioId
                ),
            rol:
                this.rolService.obtenerPorId(
                    sesion.rolId
                ),
            puedeEditar:
                this.authService.tienePermiso(
                    ModuloSistema.PERFIL_USUARIO,
                    AccionPermiso.EDITAR
                )
        })
            .pipe(
                finalize(() => {
                    this.cargando = false;
                })
            )
            .subscribe((resultado) => {
                if (!resultado.usuario) {
                    this.mensajeError =
                        'No fue posible cargar el perfil.';
                    return;
                }

                this.usuarioActual = resultado.usuario;
                this.nombreRol =
                    resultado.rol?.nombre ??
                    'Sin rol asignado';
                this.puedeEditar =
                    resultado.puedeEditar;

                this.formulario.patchValue({
                    nombres: resultado.usuario.nombres,
                    apellidos:
                        resultado.usuario.apellidos,
                    correo: resultado.usuario.correo,
                    telefono: resultado.usuario.telefono
                });

                if (!this.puedeEditar) {
                    this.formulario.disable();
                }
            });
    }

    private registrarActualizacionPerfil(
        usuario: Usuario
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
                modulo:
                    ModuloSistema.PERFIL_USUARIO,
                accion: AccionBitacora.EDITAR,
                entidad: 'Perfil de usuario',
                registroId: usuario.id,
                detalle:
                    'El usuario actualizó sus datos personales.',
                resultado: ResultadoBitacora.EXITO
            })
            .subscribe();
    }

    private registrarCambioPassword(
        resultado: ResultadoBitacora
    ): void {
        const sesion =
            this.authService.obtenerSesionActual();

        if (!sesion || !this.usuarioActual) {
            return;
        }

        this.bitacoraService
            .registrar({
                usuarioId: sesion.usuarioId,
                nombreUsuario: sesion.nombreUsuario,
                modulo:
                    ModuloSistema.PERFIL_USUARIO,
                accion: AccionBitacora.EDITAR,
                entidad: 'Credenciales',
                registroId: this.usuarioActual.id,
                detalle:
                    resultado === ResultadoBitacora.EXITO
                        ? 'El usuario cambió su contraseña.'
                        : 'Se rechazó un intento de cambio de contraseña.',
                resultado
            })
            .subscribe();
    }
}