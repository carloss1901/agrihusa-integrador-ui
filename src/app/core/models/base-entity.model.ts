export interface BaseEntity {
  id: number;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string | null;
}