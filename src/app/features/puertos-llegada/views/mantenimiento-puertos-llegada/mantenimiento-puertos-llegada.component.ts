import { Component } from '@angular/core';
import { MantenimientoMaestroComponent } from '../../../tablas-maestras/shared/components/mantenimiento-maestro/mantenimiento-maestro.component';
import { MantenimientoMaestroConfig } from '../../../tablas-maestras/shared/models/mantenimiento-maestro.model';

@Component({
  selector: 'app-mantenimiento-puertos-llegada',
  standalone: true,
  imports: [MantenimientoMaestroComponent],
  template: `<app-mantenimiento-maestro [config]="config"></app-mantenimiento-maestro>`
})
export class MantenimientoPuertosLlegadaComponent {
  readonly config: MantenimientoMaestroConfig = {
    titulo: 'Mantenimiento de Puertos de Llegada',
    subtitulo: 'Mantenimiento de puertos de llegada',
    listaTitulo: 'Lista de puertos de llegada',
    entidadSingular: 'Puerto de llegada',
    entidadPlural: 'Puertos de llegada',
    fields: [
      {
        key: 'pais',
        label: 'Pais',
        options: [
          { maestroId: 'PERU', descripcion: 'PERU' },
          { maestroId: 'CHILE', descripcion: 'CHILE' },
          { maestroId: 'COLOMBIA', descripcion: 'COLOMBIA' },
          { maestroId: 'ECUADOR', descripcion: 'ECUADOR' },
          { maestroId: 'MEXICO', descripcion: 'MEXICO' }
        ]
      },
      { key: 'puerto', label: 'Puerto' }
    ],
    mockData: [
      { id: 1, pais: 'PERU', puerto: 'CALLAO', activo: true },
      { id: 2, pais: 'CHILE', puerto: 'VALPARAISO', activo: true },
      { id: 3, pais: 'COLOMBIA', puerto: 'BUENAVENTURA', activo: true },
      { id: 4, pais: 'ECUADOR', puerto: 'GUAYAQUIL', activo: false },
      { id: 5, pais: 'MEXICO', puerto: 'MANZANILLO', activo: true }
    ]
  };
}
