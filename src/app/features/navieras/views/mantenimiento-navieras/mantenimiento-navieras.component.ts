import { Component } from '@angular/core';
import { MantenimientoMaestroComponent } from '../../../tablas-maestras/shared/components/mantenimiento-maestro/mantenimiento-maestro.component';
import { MantenimientoMaestroConfig } from '../../../tablas-maestras/shared/models/mantenimiento-maestro.model';

@Component({
  selector: 'app-mantenimiento-navieras',
  standalone: true,
  imports: [MantenimientoMaestroComponent],
  template: `<app-mantenimiento-maestro [config]="config"></app-mantenimiento-maestro>`
})
export class MantenimientoNavierasComponent {
  readonly config: MantenimientoMaestroConfig = {
    titulo: 'Mantenimiento de Navieras',
    subtitulo: 'Mantenimiento de navieras',
    listaTitulo: 'Lista de navieras',
    entidadSingular: 'Naviera',
    entidadPlural: 'Navieras',
    fields: [
      { key: 'descripcion', label: 'Naviera' }
    ],
    mockData: [
      { id: 1, descripcion: 'MAERSK', activo: true },
      { id: 2, descripcion: 'MSC', activo: true },
      { id: 3, descripcion: 'HAPAG-LLOYD', activo: true },
      { id: 4, descripcion: 'CMA CGM', activo: false },
      { id: 5, descripcion: 'EVERGREEN', activo: true }
    ]
  };
}
