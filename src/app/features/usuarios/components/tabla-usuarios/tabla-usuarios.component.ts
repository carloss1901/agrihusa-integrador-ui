import { CommonModule } from '@angular/common';
import {
    Component,
    EventEmitter,
    Input,
    Output
} from '@angular/core';

import {
    IChangePaginate,
    TableFooterPaginationComponent
} from '../../../../shared/components/agrihusa-table-footer/agrihusa-table-footer.component';
import { AgrihusaLoadingComponent } from '../../../../shared/components/agrihusa-loading/agrihusa-loading.component';
import { AgrihusaNoResultsComponent } from '../../../../shared/components/agrihusa-no-results/agrihusa-no-results.component';
import { Rol } from '../../../roles/models/rol.model';
import { Usuario } from '../../models/usuario.model';

@Component({
    selector: 'app-tabla-usuarios',
    standalone: true,
    imports: [
        CommonModule,
        AgrihusaLoadingComponent,
        AgrihusaNoResultsComponent,
        TableFooterPaginationComponent
    ],
    templateUrl: './tabla-usuarios.component.html'
})
export class TablaUsuariosComponent {
    @Input() datasource: Usuario[] = [];
    @Input() roles: Rol[] = [];
    @Input() loading = false;
    @Input() totalItems = 0;
    @Input() page = 1;
    @Input() pageSize = 10;
    @Input() filaSeleccionada: Usuario | null = null;

    @Output() seleccionar = new EventEmitter<Usuario>();
    @Output() paginar =
        new EventEmitter<IChangePaginate>();

    onSeleccionarFila(usuario: Usuario): void {
        this.seleccionar.emit(usuario);
    }

    onChangePaginate(event: IChangePaginate): void {
        if (!this.totalItems) {
            return;
        }

        this.paginar.emit(event);
    }

    trackByUsuarioId(
        _index: number,
        usuario: Usuario
    ): number {
        return usuario.id;
    }

    obtenerNombreRol(rolId: number): string {
        return (
            this.roles.find((rol) => rol.id === rolId)?.nombre ??
            'ROL NO DISPONIBLE'
        );
    }

    formatearUltimoAcceso(
        ultimoAcceso: string | null
    ): string {
        if (!ultimoAcceso) {
            return 'SIN ACCESO';
        }

        const fecha = new Date(ultimoAcceso);

        if (Number.isNaN(fecha.getTime())) {
            return 'FECHA NO DISPONIBLE';
        }

        return new Intl.DateTimeFormat('es-PE', {
            dateStyle: 'short',
            timeStyle: 'short'
        }).format(fecha);
    }

    get itemId(): number {
        return this.filaSeleccionada?.id ?? 0;
    }
}