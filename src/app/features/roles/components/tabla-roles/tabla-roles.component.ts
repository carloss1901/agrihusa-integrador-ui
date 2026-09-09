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
import { Rol } from '../../models/rol.model';

@Component({
  selector: 'app-tabla-roles',
  standalone: true,
  imports: [
    CommonModule,
    AgrihusaLoadingComponent,
    AgrihusaNoResultsComponent,
    TableFooterPaginationComponent
  ],
  templateUrl: './tabla-roles.component.html'
})
export class TablaRolesComponent {
  @Input() datasource: Rol[] = [];
  @Input() loading = false;
  @Input() totalItems = 0;
  @Input() page = 1;
  @Input() pageSize = 10;
  @Input() filaSeleccionada: Rol | null = null;

  @Output() seleccionar = new EventEmitter<Rol>();
  @Output() paginar =
    new EventEmitter<IChangePaginate>();

  onSeleccionarFila(rol: Rol): void {
    this.seleccionar.emit(rol);
  }

  onChangePaginate(
    event: IChangePaginate
  ): void {
    if (!this.totalItems) {
      return;
    }

    this.paginar.emit(event);
  }

  trackByRolId(
    _index: number,
    rol: Rol
  ): number {
    return rol.id;
  }

  get itemId(): number {
    return this.filaSeleccionada?.id ?? 0;
  }
}