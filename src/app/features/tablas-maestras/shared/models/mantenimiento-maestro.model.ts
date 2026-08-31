export interface MaestroOption {
  maestroId: string | number;
  descripcion: string;
}

export interface MaestroFieldConfig {
  key: string;
  label: string;
  options?: MaestroOption[];
}

export interface MaestroItem {
  id: number;
  activo: boolean;
  [key: string]: string | number | boolean;
}

export interface MaestroQuery {
  estado?: number;
  page?: number;
  size?: number;
  [key: string]: string | number | undefined;
}

export interface MantenimientoMaestroConfig {
  titulo: string;
  subtitulo: string;
  listaTitulo: string;
  entidadSingular: string;
  entidadPlural: string;
  fields: MaestroFieldConfig[];
  mockData: MaestroItem[];
}
