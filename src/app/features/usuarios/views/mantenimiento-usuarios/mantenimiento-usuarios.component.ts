import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';

import { AlertService } from '../../../../core/services/alert.service';
import { AccionPermiso, ModuloSistema } from '../../../../core/models/permiso.model';
import { TokenService } from '../../../../core/services/token.service';
import { ComunControllerService } from '../../../../api/api/services/comun-controller.service';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { AgrihusaButtonComponent } from '../../../../shared/components/agrihusa-button/agrihusa-button.component';
import { IChangePaginate } from '../../../../shared/components/agrihusa-table-footer/agrihusa-table-footer.component';
import { AgrihusaTopBarComponent } from '../../../../shared/components/agrihusa-topbar/agrihusa-topbar.component';
import { FiltroUsuariosComponent } from '../../components/filtro-usuarios/filtro-usuarios.component';
import { ModalUsuarioComponent } from '../../components/modal-usuario/modal-usuario.component';
import { TablaUsuariosComponent } from '../../components/tabla-usuarios/tabla-usuarios.component';
import { Usuario, UsuarioFilter, UsuarioQuery } from '../../../../core/models/usuario.model';
import { UsuarioModalResult } from '../../components/modal-usuario/modal-usuario.component';
import { Rol } from '../../../../core/models/rol.model';

@Component({
    selector: 'app-mantenimiento-usuarios',
    standalone: true,
    imports: [CommonModule, AgrihusaTopBarComponent, AgrihusaButtonComponent, FiltroUsuariosComponent, TablaUsuariosComponent],
    templateUrl: './mantenimiento-usuarios.component.html'
})
export class MantenimientoUsuariosComponent implements OnInit {
    private readonly tokenService = inject(TokenService);
    readonly titulo = 'Mantenimiento de Usuarios';
    usuarios: Usuario[] = [];
    roles: Rol[] = [];
    filaSeleccionada: Usuario | null = null;
    loading = false;
    totalItems = 0;
    page = 1;
    pageSize = 10;
    readonly puedeCrear = this.tokenService.tienePermiso(ModuloSistema.USUARIOS, AccionPermiso.CREAR);
    readonly puedeEditar = this.tokenService.tienePermiso(ModuloSistema.USUARIOS, AccionPermiso.EDITAR);
    readonly puedeCambiarEstado = this.tokenService.tienePermiso(ModuloSistema.USUARIOS, AccionPermiso.ELIMINAR);
    private filtro: UsuarioFilter = {};

    constructor(
        private readonly usuarioService: UsuarioService,
        private readonly comunService: ComunControllerService,
        private readonly modalService: NgbModal,
        private readonly alertService: AlertService
    ) { }

    ngOnInit(): void {
        this.cargarRoles();
        this.cargarUsuarios();
    }

    onBuscar(filtro: UsuarioFilter): void { this.filtro = { ...filtro }; this.page = 1; this.cargarUsuarios(); }
    onLimpiarFiltro(): void { this.filtro = {}; this.page = 1; this.cargarUsuarios(); }
    onSeleccionarUsuario(usuario: Usuario): void { this.filaSeleccionada = this.filaSeleccionada?.id === usuario.id ? null : usuario; }
    onChangePaginate(event: IChangePaginate): void { this.page = event.page; this.pageSize = event.pageSize; this.cargarUsuarios(); }
    mostrarModalCrear(): void { this.abrirModal(null); }
    mostrarModalEditar(): void {
        const usuario = this.filaSeleccionada;

        if (!usuario) {
            return;
        }

        if (usuario.esSistema) {
            this.alertService.warning(
                'El usuario Administrador pertenece al sistema. Puedes actualizar su información personal, pero no cambiar su identificador, rol o estado.'
            );
            return;
        }

        if (usuario.activo) {
            this.abrirModal(usuario);
        }
    }

    cambiarEstado(): void {
        const usuario = this.filaSeleccionada;
        if (!usuario || usuario.esSistema) return;
        if (!window.confirm(`¿Deseas ${usuario.activo ? 'desactivar' : 'activar'} el usuario "${usuario.nombreUsuario}"?`)) return;
        this.usuarioService.cambiarEstado(usuario.id, !usuario.activo).subscribe({
            next: (response) => { this.alertService.success(response.message!); this.cargarUsuarios(); },
            error: (error: HttpErrorResponse) => this.mostrarError(error)
        });
    }

    private cargarUsuarios(): void {
        const query: UsuarioQuery = { ...this.filtro, page: this.page, pageSize: this.pageSize };
        this.loading = true;
        this.filaSeleccionada = null;
        this.usuarioService.listar(query).pipe(finalize(() => this.loading = false)).subscribe({
            next: (resultado) => { this.usuarios = resultado.items; this.totalItems = resultado.totalItems; },
            error: (error: HttpErrorResponse) => this.mostrarError(error)
        });
    }

    private cargarRoles(): void {
        this.comunService.listarRolesActivos().subscribe({
            next: (roles) => {
                this.roles = roles
                    .map((rol) => ({
                        id: rol.id ?? 0,
                        nombre: rol.descripcion ?? '',
                        descripcion: rol.descripcion ?? '',
                        esSistema: false,
                        permisos: [],
                        activo: true,
                        fechaCreacion: '',
                        fechaActualizacion: null
                    }));
            }
        });
    }

    private abrirModal(usuario: Usuario | null): void {
        const modalRef = this.modalService.open(ModalUsuarioComponent, { backdrop: 'static', keyboard: false, size: 'lg', centered: true });
        modalRef.componentInstance.titleModal = usuario ? 'EDITAR USUARIO' : 'REGISTRAR USUARIO';
        modalRef.componentInstance.data = usuario;
        modalRef.componentInstance.roles = this.roles;
        modalRef.result.then((resultado: UsuarioModalResult) => {
            if (!resultado) return;
            const request = resultado.modo === 'editar'
                ? this.usuarioService.actualizar(usuario?.id ?? 0, resultado.data)
                : this.usuarioService.crear(resultado.data);
            request.subscribe({
                next: (response) => { this.alertService.success(response.message!); this.page = 1; this.cargarUsuarios(); },
                error: (error: HttpErrorResponse) => this.mostrarError(error)
            });
        }).catch(() => { });
    }

    private mostrarError(error: HttpErrorResponse): void { this.alertService.error((error.error as { message?: string }).message!); }
}
