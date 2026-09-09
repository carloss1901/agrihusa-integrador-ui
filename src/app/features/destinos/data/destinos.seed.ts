import { Destino } from '../models/destino.model';

export function crearDestinosIniciales(): Destino[] {
    const fechaCreacion = new Date().toISOString();

    return [
        {
            id: 1,
            pais: 'PERÚ',
            ciudad: 'LIMA',
            activo: true,
            fechaCreacion,
            fechaActualizacion: null
        },
        {
            id: 2,
            pais: 'ECUADOR',
            ciudad: 'QUITO',
            activo: true,
            fechaCreacion,
            fechaActualizacion: null
        },
        {
            id: 3,
            pais: 'COLOMBIA',
            ciudad: 'BOGOTÁ',
            activo: true,
            fechaCreacion,
            fechaActualizacion: null
        },
        {
            id: 4,
            pais: 'CHILE',
            ciudad: 'SANTIAGO',
            activo: true,
            fechaCreacion,
            fechaActualizacion: null
        },
        {
            id: 5,
            pais: 'BOLIVIA',
            ciudad: 'LA PAZ',
            activo: false,
            fechaCreacion,
            fechaActualizacion: null
        },
        {
            id: 6,
            pais: 'MÉXICO',
            ciudad: 'CIUDAD DE MÉXICO',
            activo: true,
            fechaCreacion,
            fechaActualizacion: null
        },
        {
            id: 7,
            pais: 'ARGENTINA',
            ciudad: 'BUENOS AIRES',
            activo: true,
            fechaCreacion,
            fechaActualizacion: null
        },
        {
            id: 8,
            pais: 'ESTADOS UNIDOS',
            ciudad: 'MIAMI',
            activo: true,
            fechaCreacion,
            fechaActualizacion: null
        }
    ];
}