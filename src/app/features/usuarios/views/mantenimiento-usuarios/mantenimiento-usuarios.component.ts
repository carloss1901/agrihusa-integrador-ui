import { CommonModule } from '@angular/common';
import {
    Component,
    OnInit
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
import {
    IChangePaginate
} from '../../../../shared/components/agrihusa-table-footer/agrihusa-table-footer.component';
import { AgrihusaTopBarComponent } from '../../../../shared/components/agrihusa-topbar/agrihusa-topbar.component';
import { Rol } from '../../../roles/models/rol.model';
import { RolService } from '../../../roles/services/rol.service';
import { FiltroUsuariosComponent } from '../../components/filtro-usuarios/filtro-usuarios.component';
import {
    ModalUsuarioComponent,
    UsuarioModalResult
} from '../../components/modal-usuario/modal-usuario.component';
import { TablaUsuariosComponent } from '../../components/tabla-usuarios/tabla-usuarios.component';
import {
    Usuario,
    UsuarioFilter,
    UsuarioQuery
} from '../../models/usuario.model';
import {
    AccionBitacora,
    RegistroBitacoraCrearData,
    ResultadoBitacora
} from '../../../auditoria/models/bitacora.model';
import { BitacoraService } from '../../../auditoria/services/bitacora.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
    selector: 'app-mantenimiento-usuarios',
    standalone: true,
    imports: [
        CommonModule,
        AgrihusaTopBarComponent,
        AgrihusaButtonComponent,
        FiltroUsuariosComponent,
        TablaUsuariosComponent
    ],
    templateUrl: './mantenimiento-usuarios.component.html'
})
export class MantenimientoUsuariosComponent
    implements OnInit {
    readonly titulo = 'Mantenimiento de Usuarios';

    usuarios: Usuario[] = [];
    roles: Rol[] = [];
    filaSeleccionada: Usuario | null = null;
    loading = false;
    totalItems = 0;
    page = 1;
    pageSize = 10;

    private filtro: UsuarioFilter = {};


    constructor(
        private usuarioService: UsuarioService,
        private rolService: RolService,
        private authService: AuthService,
        private bitacoraService: BitacoraService,
        private modalService: NgbModal
    ) { }

    ngOnInit(): void {
        this.cargarPermisos();
        this.cargarRoles();
        this.cargarUsuarios();
    }

    puedeCrear = false;
    puedeEditar = false;
    puedeCambiarEstado = false;

    onBuscar(filtro: UsuarioFilter): void {
        this.filtro = { ...filtro };
        this.page = 1;
        this.cargarUsuarios();
    }

    onLimpiarFiltro(): void {
        this.filtro = {};
        this.page = 1;
        this.cargarUsuarios();
    }

    onSeleccionarUsuario(usuario: Usuario): void {
        this.filaSeleccionada =
            this.filaSeleccionada?.id === usuario.id
                ? null
                : usuario;
    }

    onChangePaginate(
        event: IChangePaginate
    ): void {
        this.page = event.page;
        this.pageSize = event.pageSize;
        this.cargarUsuarios();
    }

    mostrarModalCrear(): void {
        if (!this.puedeCrear) {
            return;
        }

        this.abrirModal(null);
    }

    mostrarModalEditar(): void {
        if (
            !this.puedeEditar ||
            !this.filaSeleccionada ||
            !this.filaSeleccionada.activo
        ) {
            return;
        }

        this.abrirModal(this.filaSeleccionada);
    }

    cambiarEstado(): void {
        const usuario = this.filaSeleccionada;

        if (
            !this.puedeCambiarEstado ||
            !usuario ||
            usuario.esSistema
        ) {
            return;
        }

        const accion = usuario.activo
            ? 'desactivar'
            : 'activar';

        const confirmado = window.confirm(
            `¿Deseas ${accion} al usuario ` +
            `"${usuario.nombreUsuario}"?`
        );

        if (!confirmado) {
            return;
        }

        this.usuarioService
            .cambiarEstado(usuario.id)
            .subscribe((resultado) => {
                if (!resultado) {
                    return;
                }

                const accionBitacora = resultado.activo
                    ? AccionBitacora.ACTIVAR
                    : AccionBitacora.DESACTIVAR;

                this.registrarEventoUsuario(
                    accionBitacora,
                    resultado,
                    resultado.activo
                        ? `Se activó al usuario ${resultado.nombreUsuario}.`
                        : `Se desactivó al usuario ${resultado.nombreUsuario}.`
                );

                this.cargarUsuarios();
            });
    }

    private cargarUsuarios(): void {
        const query: UsuarioQuery = {
            ...this.filtro,
            page: this.page,
            pageSize: this.pageSize
        };

        this.loading = true;
        this.filaSeleccionada = null;

        this.usuarioService
            .listar(query)
            .pipe(
                finalize(() => {
                    this.loading = false;
                })
            )
            .subscribe((resultado) => {
                this.usuarios = resultado.items;
                this.totalItems = resultado.totalItems;
            });
    }

    private cargarRoles(): void {
        this.rolService
            .listar({
                page: 1,
                pageSize: 1000
            })
            .subscribe((resultado) => {
                this.roles = resultado.items;
            });
    }

    private abrirModal(
        usuario: Usuario | null
    ): void {
        const modalRef = this.modalService.open(
            ModalUsuarioComponent,
            {
                backdrop: 'static',
                keyboard: false,
                size: 'lg',
                centered: true,
                scrollable: true
            }
        );

        modalRef.componentInstance.titleModal = usuario
            ? 'EDITAR USUARIO'
            : 'REGISTRAR USUARIO';

        modalRef.componentInstance.data = usuario;
        modalRef.componentInstance.roles = this.roles;

        modalRef.result
            .then((resultado: UsuarioModalResult) => {
                if (resultado) {
                    this.guardarUsuario(resultado, usuario);
                }
            })
            .catch(() => { });
    }

    private guardarUsuario(
        resultado: UsuarioModalResult,
        usuario: Usuario | null
    ): void {
        forkJoin({
            existeNombre:
                this.usuarioService.existeNombreUsuario(
                    resultado.data.nombreUsuario,
                    usuario?.id
                ),
            existeCorreo:
                this.usuarioService.existeCorreo(
                    resultado.data.correo,
                    usuario?.id
                )
        })
            .pipe(
                switchMap(
                    ({ existeNombre, existeCorreo }) => {
                        if (existeNombre) {
                            window.alert(
                                'Ya existe un usuario con ese nombre.'
                            );

                            return EMPTY;
                        }

                        if (existeCorreo) {
                            window.alert(
                                'Ya existe un usuario con ese correo.'
                            );

                            return EMPTY;
                        }

                        if (resultado.modo === 'crear') {
                            return this.usuarioService.crear(
                                resultado.data
                            );
                        }

                        if (!usuario) {
                            return EMPTY;
                        }

                        return this.usuarioService.actualizar(
                            usuario.id,
                            resultado.data
                        );
                    }
                )
            )
            .subscribe((usuarioGuardado) => {
                if (!usuarioGuardado) {
                    return;
                }

                if (!usuario) {
                    this.registrarEventoUsuario(
                        AccionBitacora.CREAR,
                        usuarioGuardado,
                        `Se creó al usuario ` +
                        `${usuarioGuardado.nombreUsuario}.`
                    );
                } else {
                    this.registrarEventoUsuario(
                        AccionBitacora.EDITAR,
                        usuarioGuardado,
                        `Se actualizó al usuario ` +
                        `${usuarioGuardado.nombreUsuario}.`
                    );

                    if (
                        usuario.activo !==
                        usuarioGuardado.activo
                    ) {
                        const accionEstado =
                            usuarioGuardado.activo
                                ? AccionBitacora.ACTIVAR
                                : AccionBitacora.DESACTIVAR;

                        this.registrarEventoUsuario(
                            accionEstado,
                            usuarioGuardado,
                            usuarioGuardado.activo
                                ? `Se activó al usuario ${usuarioGuardado.nombreUsuario}.`
                                : `Se desactivó al usuario ${usuarioGuardado.nombreUsuario}.`
                        );
                    }
                }

                this.page = 1;
                this.cargarUsuarios();
            });
    }

    private cargarPermisos(): void {
        forkJoin({
            crear: this.authService.tienePermiso(
                ModuloSistema.USUARIOS,
                AccionPermiso.CREAR
            ),
            editar: this.authService.tienePermiso(
                ModuloSistema.USUARIOS,
                AccionPermiso.EDITAR
            ),
            cambiarEstado: this.authService.tienePermiso(
                ModuloSistema.USUARIOS,
                AccionPermiso.ELIMINAR
            )
        }).subscribe((permisos) => {
            this.puedeCrear = permisos.crear;
            this.puedeEditar = permisos.editar;
            this.puedeCambiarEstado =
                permisos.cambiarEstado;
        });
    }

    private registrarEventoUsuario(
        accion: AccionBitacora,
        usuario: Usuario,
        detalle: string
    ): void {
        const sesion =
            this.authService.obtenerSesionActual();

        if (!sesion) {
            return;
        }

        const evento: RegistroBitacoraCrearData = {
            usuarioId: sesion.usuarioId,
            nombreUsuario: sesion.nombreUsuario,
            modulo: ModuloSistema.USUARIOS,
            accion,
            entidad: 'Usuario',
            registroId: usuario.id,
            detalle,
            resultado: ResultadoBitacora.EXITO
        };

        this.bitacoraService
            .registrar(evento)
            .subscribe();
    }
}