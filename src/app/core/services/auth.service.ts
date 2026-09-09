import { Injectable } from '@angular/core';
import {
    BehaviorSubject,
    Observable,
    firstValueFrom,
    from,
    map,
    of,
    switchMap
} from 'rxjs';

import {
    LoginCredentials,
    LoginResult,
    SesionUsuario
} from '../models/auth.model';
import {
    AccionBitacora,
    MODULO_AUTENTICACION,
    ResultadoBitacora
} from '../../features/auditoria/models/bitacora.model';
import { BitacoraService } from '../../features/auditoria/services/bitacora.service';
import {
    AccionPermiso,
    ModuloSistema
} from '../models/permiso.model';
import { STORAGE_KEYS } from '../constants/storage-keys.constant';
import { RolService } from '../../features/roles/services/rol.service';
import { UsuarioService } from '../../features/usuarios/services/usuario.service';
import { LocalStorageService } from './local-storage.service';
import { PasswordHashService } from './password-hash.service';
import { Usuario } from '../../features/usuarios/models/usuario.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly duracionSesionHoras = 8;

    private readonly sesionSubject =
        new BehaviorSubject<SesionUsuario | null>(null);

    readonly sesion$ =
        this.sesionSubject.asObservable();

    constructor(
        private usuarioService: UsuarioService,
        private rolService: RolService,
        private localStorageService: LocalStorageService,
        private passwordHashService: PasswordHashService,
        private bitacoraService: BitacoraService
    ) {
        this.restaurarSesion();
    }

    login(
        credentials: LoginCredentials
    ): Observable<LoginResult> {
        return from(this.loginAsync(credentials));
    }

    logout(): void {
        const sesion = this.sesionSubject.value;

        if (sesion) {
            this.bitacoraService
                .registrar({
                    usuarioId: sesion.usuarioId,
                    nombreUsuario: sesion.nombreUsuario,
                    modulo: MODULO_AUTENTICACION,
                    accion: AccionBitacora.CIERRE_SESION,
                    entidad: 'Sesión',
                    registroId: sesion.usuarioId,
                    detalle: 'Cierre de sesión local.',
                    resultado: ResultadoBitacora.EXITO
                })
                .subscribe();
        }

        this.localStorageService.eliminar(
            STORAGE_KEYS.SESION
        );

        this.sesionSubject.next(null);
    }

    obtenerSesionActual(): SesionUsuario | null {
        const sesion = this.sesionSubject.value;

        if (!sesion) {
            return null;
        }

        if (this.sesionExpirada(sesion)) {
            this.logout();
            return null;
        }

        return sesion;
    }

    estaAutenticado(): boolean {
        return this.obtenerSesionActual() !== null;
    }

    validarToken(token: string): boolean {
        const sesion = this.obtenerSesionActual();

        return !!sesion && sesion.token === token;
    }

    tienePermiso(
        modulo: ModuloSistema,
        accion: AccionPermiso
    ): Observable<boolean> {
        const sesion = this.obtenerSesionActual();

        if (!sesion) {
            return of(false);
        }

        return this.usuarioService
            .obtenerPorId(sesion.usuarioId)
            .pipe(
                switchMap((usuario) => {
                    if (!usuario?.activo) {
                        return of(false);
                    }

                    return this.rolService
                        .obtenerPorId(usuario.rolId)
                        .pipe(
                            map((rol) => {
                                if (!rol?.activo) {
                                    return false;
                                }

                                return rol.permisos.some(
                                    (permiso) =>
                                        permiso.modulo === modulo &&
                                        permiso.acciones.includes(accion)
                                );
                            })
                        );
                })
            );
    }

    actualizarSesionDesdeUsuario(
        usuario: Usuario
    ): void {
        const sesion = this.sesionSubject.value;

        if (
            !sesion ||
            sesion.usuarioId !== usuario.id
        ) {
            return;
        }

        const sesionActualizada: SesionUsuario = {
            ...sesion,
            nombreUsuario: usuario.nombreUsuario,
            nombreCompleto:
                `${usuario.nombres} ${usuario.apellidos}`.trim(),
            rolId: usuario.rolId,
            debeCambiarPassword:
                usuario.debeCambiarPassword
        };

        this.localStorageService.guardar(
            STORAGE_KEYS.SESION,
            sesionActualizada
        );

        this.sesionSubject.next(sesionActualizada);
    }

    private async loginAsync(
        credentials: LoginCredentials
    ): Promise<LoginResult> {
        const usuario = await firstValueFrom(
            this.usuarioService.obtenerPorNombreUsuario(
                credentials.nombreUsuario
            )
        );

        if (!usuario?.activo) {
            await this.registrarInicioFallido(
                credentials.nombreUsuario,
                usuario?.id ?? null
            );

            return this.resultadoFallido();
        }

        const rol = await firstValueFrom(
            this.rolService.obtenerPorId(usuario.rolId)
        );

        if (!rol?.activo) {
            await this.registrarInicioFallido(
                credentials.nombreUsuario,
                usuario.id
            );

            return this.resultadoFallido();
        }

        const passwordValido =
            await this.passwordHashService.verificar(
                credentials.password,
                usuario.passwordHash
            );

        if (!passwordValido) {
            await this.registrarInicioFallido(
                credentials.nombreUsuario,
                usuario.id
            );

            return this.resultadoFallido();
        }

        const sesion = this.crearSesion(
            usuario.id,
            usuario.nombreUsuario,
            `${usuario.nombres} ${usuario.apellidos}`.trim(),
            usuario.rolId,
            usuario.debeCambiarPassword
        );

        this.localStorageService.guardar(
            STORAGE_KEYS.SESION,
            sesion
        );

        this.sesionSubject.next(sesion);

        await firstValueFrom(
            this.usuarioService.registrarUltimoAcceso(
                usuario.id
            )
        );

        await firstValueFrom(
            this.bitacoraService.registrar({
                usuarioId: usuario.id,
                nombreUsuario: usuario.nombreUsuario,
                modulo: MODULO_AUTENTICACION,
                accion: AccionBitacora.INICIO_SESION,
                entidad: 'Sesión',
                registroId: usuario.id,
                detalle: 'Inicio de sesión local exitoso.',
                resultado: ResultadoBitacora.EXITO
            })
        );

        return {
            success: true,
            message: 'Inicio de sesión correcto.',
            sesion
        };
    }
    private async registrarInicioFallido(
        nombreUsuario: string,
        usuarioId: number | null
    ): Promise<void> {
        await firstValueFrom(
            this.bitacoraService.registrar({
                usuarioId,
                nombreUsuario:
                    nombreUsuario.trim().toUpperCase() ||
                    'DESCONOCIDO',
                modulo: MODULO_AUTENTICACION,
                accion:
                    AccionBitacora.INICIO_SESION_FALLIDO,
                entidad: 'Sesión',
                registroId: usuarioId,
                detalle:
                    'Intento de inicio de sesión local rechazado.',
                resultado: ResultadoBitacora.ERROR
            })
        );
    }

    private crearSesion(
        usuarioId: number,
        nombreUsuario: string,
        nombreCompleto: string,
        rolId: number,
        debeCambiarPassword: boolean
    ): SesionUsuario {
        const fechaInicio = new Date();
        const fechaExpiracion = new Date(
            fechaInicio.getTime() +
            this.duracionSesionHoras * 60 * 60 * 1000
        );

        return {
            token: crypto.randomUUID(),
            usuarioId,
            nombreUsuario,
            nombreCompleto,
            rolId,
            fechaInicio: fechaInicio.toISOString(),
            fechaExpiracion: fechaExpiracion.toISOString(),
            debeCambiarPassword
        };
    }

    private restaurarSesion(): void {
        const sesion =
            this.localStorageService.obtener<SesionUsuario>(
                STORAGE_KEYS.SESION
            );

        if (!sesion || this.sesionExpirada(sesion)) {
            this.localStorageService.eliminar(
                STORAGE_KEYS.SESION
            );

            return;
        }

        this.sesionSubject.next(sesion);
    }

    private sesionExpirada(
        sesion: SesionUsuario
    ): boolean {
        const expiracion =
            new Date(sesion.fechaExpiracion).getTime();

        return (
            !Number.isFinite(expiracion) ||
            expiracion <= Date.now()
        );
    }

    private resultadoFallido(): LoginResult {
        return {
            success: false,
            message: 'Usuario o contraseña incorrectos.',
            sesion: null
        };
    }
}