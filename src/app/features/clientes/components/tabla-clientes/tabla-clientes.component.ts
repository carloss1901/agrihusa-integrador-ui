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
import {
    Cliente,
    TipoDocumentoCliente
} from '../../models/cliente.model';

@Component({
    selector: 'app-tabla-clientes',
    standalone: true,
    imports: [
        CommonModule,
        AgrihusaLoadingComponent,
        AgrihusaNoResultsComponent,
        TableFooterPaginationComponent
    ],
    templateUrl: './tabla-clientes.component.html'
})
export class TablaClientesComponent {
    @Input() datasource: Cliente[] = [];
    @Input() loading = false;
    @Input() totalItems = 0;
    @Input() page = 1;
    @Input() pageSize = 10;
    @Input() filaSeleccionada: Cliente | null = null;

    @Output()
    seleccionar = new EventEmitter<Cliente>();

    @Output()
    paginar = new EventEmitter<IChangePaginate>();

    private readonly nombresTipoDocumento: Record<
        TipoDocumentoCliente,
        string
    > = {
            [TipoDocumentoCliente.RUC]: 'RUC',
            [TipoDocumentoCliente.DNI]: 'DNI',
            [TipoDocumentoCliente.CARNET_EXTRANJERIA]:
                'CARNET DE EXTRANJERÍA',
            [TipoDocumentoCliente.PASAPORTE]: 'PASAPORTE',
            [TipoDocumentoCliente.OTRO]: 'OTRO'
        };

    onSeleccionarFila(cliente: Cliente): void {
        this.seleccionar.emit(cliente);
    }

    onChangePaginate(
        event: IChangePaginate
    ): void {
        if (!this.totalItems) {
            return;
        }

        this.paginar.emit(event);
    }

    trackByClienteId(
        _index: number,
        cliente: Cliente
    ): number {
        return cliente.id;
    }

    obtenerNombreTipoDocumento(
        tipoDocumento: TipoDocumentoCliente
    ): string {
        return this.nombresTipoDocumento[tipoDocumento];
    }

    get itemId(): number {
        return this.filaSeleccionada?.id ?? 0;
    }
}