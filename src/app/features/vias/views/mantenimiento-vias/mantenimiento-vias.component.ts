import { Component } from '@angular/core';
import { MantenimientoMaestroComponent } from '../../../tablas-maestras/shared/components/mantenimiento-maestro/mantenimiento-maestro.component';
import { MantenimientoMaestroConfig } from '../../../tablas-maestras/shared/models/mantenimiento-maestro.model';

@Component({
  selector: 'app-mantenimiento-vias',
  standalone: true,
  imports: [MantenimientoMaestroComponent],
  template: `<app-mantenimiento-maestro [config]="config"></app-mantenimiento-maestro>`
})
export class MantenimientoViasComponent {
  readonly config: MantenimientoMaestroConfig = {
    titulo: 'Mantenimiento de Vias',
    subtitulo: 'Mantenimiento de vias',
    listaTitulo: 'Lista de vias',
    entidadSingular: 'Via',
    entidadPlural: 'Vias',
    fields: [
      { key: 'descripcion', label: 'Via' }
    ],
    mockData: [
      { id: 1, descripcion: 'MARITIMA', activo: true },
      { id: 2, descripcion: 'AEREA', activo: true },
      { id: 3, descripcion: 'TERRESTRE', activo: true },
      { id: 4, descripcion: 'FERROVIARIA', activo: false },
      { id: 5, descripcion: 'FLUVIAL', activo: true }
    ]
  };
}
