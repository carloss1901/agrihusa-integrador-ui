import {
    Cliente,
    TipoDocumentoCliente
} from '../models/cliente.model';

export function crearClientesIniciales(): Cliente[] {
    const fechaCreacion = new Date().toISOString();

    return [
        {
            id: 1,
            tipoDocumento: TipoDocumentoCliente.RUC,
            numeroDocumento: '20555555551',
            razonSocial: 'IMPORTADORA ANDINA S.A.C.',
            nombreComercial: 'IMPORTADORA ANDINA',
            contacto: 'María Torres',
            correo: 'contacto@andina.example',
            telefono: '987654321',
            direccion: 'Av. Los Andes 450',
            pais: 'PERÚ',
            activo: true,
            fechaCreacion,
            fechaActualizacion: null
        },
        {
            id: 2,
            tipoDocumento: TipoDocumentoCliente.RUC,
            numeroDocumento: '20666666662',
            razonSocial: 'DISTRIBUIDORA PACÍFICO S.A.C.',
            nombreComercial: 'DISTRIBUIDORA PACÍFICO',
            contacto: 'Carlos Mendoza',
            correo: 'ventas@pacifico.example',
            telefono: '986543210',
            direccion: 'Av. El Pacífico 820',
            pais: 'PERÚ',
            activo: true,
            fechaCreacion,
            fechaActualizacion: null
        },
        {
            id: 3,
            tipoDocumento: TipoDocumentoCliente.RUC,
            numeroDocumento: '20777777773',
            razonSocial: 'COMERCIAL LOS VALLES E.I.R.L.',
            nombreComercial: 'COMERCIAL LOS VALLES',
            contacto: 'Ana Ramírez',
            correo: 'compras@losvalles.example',
            telefono: '985432109',
            direccion: 'Jr. Los Cultivos 125',
            pais: 'PERÚ',
            activo: false,
            fechaCreacion,
            fechaActualizacion: null
        }
    ];
}