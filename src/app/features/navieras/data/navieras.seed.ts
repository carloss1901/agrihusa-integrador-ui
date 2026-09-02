import { Naviera } from '../models/naviera.model';

export function crearNavierasIniciales(): Naviera[] {
    const fechaCreacion = new Date().toISOString();

    return [
        {
            id: 1,
            codigo: 'MSK',
            nombre: 'MAERSK',
            pais: 'DINAMARCA',
            contacto: 'Área comercial',
            correo: 'comercial@maersk.example',
            telefono: '+45 7000 1000',
            sitioWeb: 'https://maersk.example',
            activo: true,
            fechaCreacion,
            fechaActualizacion: null
        },
        {
            id: 2,
            codigo: 'MSC',
            nombre: 'MSC',
            pais: 'SUIZA',
            contacto: 'Área comercial',
            correo: 'comercial@msc.example',
            telefono: '+41 7000 2000',
            sitioWeb: 'https://msc.example',
            activo: true,
            fechaCreacion,
            fechaActualizacion: null
        },
        {
            id: 3,
            codigo: 'HLC',
            nombre: 'HAPAG-LLOYD',
            pais: 'ALEMANIA',
            contacto: 'Área comercial',
            correo: 'comercial@hapag.example',
            telefono: '+49 7000 3000',
            sitioWeb: 'https://hapag.example',
            activo: true,
            fechaCreacion,
            fechaActualizacion: null
        },
        {
            id: 4,
            codigo: 'CMA',
            nombre: 'CMA CGM',
            pais: 'FRANCIA',
            contacto: 'Área comercial',
            correo: 'comercial@cma.example',
            telefono: '+33 7000 4000',
            sitioWeb: 'https://cma.example',
            activo: false,
            fechaCreacion,
            fechaActualizacion: null
        },
        {
            id: 5,
            codigo: 'EMC',
            nombre: 'EVERGREEN',
            pais: 'TAIWÁN',
            contacto: 'Área comercial',
            correo: 'comercial@evergreen.example',
            telefono: '+886 7000 5000',
            sitioWeb: 'https://evergreen.example',
            activo: true,
            fechaCreacion,
            fechaActualizacion: null
        }
    ];
}