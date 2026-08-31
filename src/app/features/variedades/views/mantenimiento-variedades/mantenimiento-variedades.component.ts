import { Component } from '@angular/core';
import { MantenimientoMaestroComponent } from '../../../tablas-maestras/shared/components/mantenimiento-maestro/mantenimiento-maestro.component';
import { MantenimientoMaestroConfig } from '../../../tablas-maestras/shared/models/mantenimiento-maestro.model';

@Component({
  selector: 'app-mantenimiento-variedades',
  standalone: true,
  imports: [MantenimientoMaestroComponent],
  template: `<app-mantenimiento-maestro [config]="config"></app-mantenimiento-maestro>`
})
export class MantenimientoVariedadesComponent {
  readonly config: MantenimientoMaestroConfig = {
    titulo: 'Mantenimiento de Variedades',
    subtitulo: 'Mantenimiento de variedades',
    listaTitulo: 'Lista de variedades',
    entidadSingular: 'Variedad',
    entidadPlural: 'Variedades',
    fields: [
      { key: 'descripcion', label: 'Variedad' }
    ],
    mockData: [
      { id: 1, descripcion: 'HASS', activo: true },
      { id: 2, descripcion: 'FUERTE', activo: true },
      { id: 3, descripcion: 'ZUTANO', activo: false },
      { id: 4, descripcion: 'BACON', activo: true },
      { id: 5, descripcion: 'PINKERTON', activo: true }
    ]
  };
}
