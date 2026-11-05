import {
  APIRequestContext,
  expect,
  test
} from '@playwright/test';

import {
  iniciarSesion
} from './helpers/autenticacion';

const apiUrl =
  process.env['E2E_API_URL'] ??
  'http://localhost:8085';

type Registro = Record<string, unknown>;

interface CicloCatalogo {
  nombre: string;
  endpoint: string;
  idCampo: string;
  crear: Registro;
  actualizar: (id: number) => Registro;
  consultaInicial: Record<string, string>;
  consultaActualizada: Record<string, string>;
  coincideInicial: (item: Registro) => boolean;
  coincideActualizado: (item: Registro) => boolean;
}

async function listar(
  request: APIRequestContext,
  endpoint: string,
  headers: Record<string, string>,
  filtros: Record<string, string>,
  activo: boolean
): Promise<Registro[]> {
  const parametros = new URLSearchParams({
    ...filtros,
    activo: String(activo),
    pagina: '1',
    tamPagina: '20'
  });

  const respuesta = await request.get(
    `${apiUrl}${endpoint}?${parametros}`,
    { headers }
  );

  expect(
    respuesta.status(),
    `Consulta de ${endpoint}`
  ).toBe(200);

  const cuerpo = await respuesta.json();
  return cuerpo.datos ?? [];
}

async function ejecutarCiclo(
  request: APIRequestContext,
  headers: Record<string, string>,
  config: CicloCatalogo
): Promise<number> {
  const registro = await request.post(
    `${apiUrl}${config.endpoint}`,
    {
      headers,
      data: config.crear
    }
  );

  expect(
    registro.status(),
    `Registro de ${config.nombre}`
  ).toBe(201);

  const creados = await listar(
    request,
    config.endpoint,
    headers,
    config.consultaInicial,
    true
  );

  const creado = creados.find(
    config.coincideInicial
  );

  if (!creado) {
    throw new Error(
      `No se encontró ${config.nombre} después de registrarlo.`
    );
  }

  const id = Number(creado[config.idCampo]);
  expect(Number.isInteger(id) && id > 0).toBe(true);

  const actualizacion = await request.put(
    `${apiUrl}${config.endpoint}`,
    {
      headers,
      data: config.actualizar(id)
    }
  );

  expect(
    actualizacion.status(),
    `Actualización de ${config.nombre}`
  ).toBe(200);

  const actualizados = await listar(
    request,
    config.endpoint,
    headers,
    config.consultaActualizada,
    true
  );

  expect(
    actualizados.some(config.coincideActualizado),
    `Persistencia de la actualización de ${config.nombre}`
  ).toBe(true);

  const parametros = new URLSearchParams({
    [config.idCampo]: String(id),
    activo: 'false'
  });

  const desactivacion = await request.delete(
    `${apiUrl}${config.endpoint}?${parametros}`,
    { headers }
  );

  expect(
    desactivacion.status(),
    `Desactivación de ${config.nombre}`
  ).toBe(200);

  const inactivos = await listar(
    request,
    config.endpoint,
    headers,
    config.consultaActualizada,
    false
  );

  expect(
    inactivos.some(
      (item) =>
        Number(item[config.idCampo]) === id &&
        item['activo'] === false
    ),
    `Persistencia de la desactivación de ${config.nombre}`
  ).toBe(true);

  return id;
}

test.describe('Datos maestros', () => {
  test(
    'registra, consulta, actualiza y desactiva los catálogos',
    async ({ page, request }) => {
      test.setTimeout(120000);

      await iniciarSesion(page);

      const token = await page.evaluate(() =>
        localStorage.getItem('token')
      );

      expect(token).toBeTruthy();

      const headers = {
        Authorization: `Bearer ${token}`
      };

      const marca = String(Date.now()).slice(-8);
      const codigo = `E${marca}`;
      const ruc = `20${String(Date.now()).slice(-9)}`;

      await test.step('Destino', async () => {
        await ejecutarCiclo(request, headers, {
          nombre: 'destino',
          endpoint: '/api/destinos',
          idCampo: 'destinoId',
          crear: {
            destinoId: 0,
            pais: 'PERÚ',
            ciudad: `DESTINO E2E ${marca}`
          },
          actualizar: (id) => ({
            destinoId: id,
            pais: 'CHILE',
            ciudad: `DESTINO E2E ${marca}`
          }),
          consultaInicial: {
            ciudad: `DESTINO E2E ${marca}`
          },
          consultaActualizada: {
            ciudad: `DESTINO E2E ${marca}`
          },
          coincideInicial: (item) =>
            item['ciudad'] === `DESTINO E2E ${marca}` &&
            item['pais'] === 'PERÚ',
          coincideActualizado: (item) =>
            item['ciudad'] === `DESTINO E2E ${marca}` &&
            item['pais'] === 'CHILE'
        });
      });

      await test.step('Vía', async () => {
        await ejecutarCiclo(request, headers, {
          nombre: 'vía',
          endpoint: '/api/vias',
          idCampo: 'viaId',
          crear: {
            viaId: 0,
            descripcion: `VIA E2E ${marca}`
          },
          actualizar: (id) => ({
            viaId: id,
            descripcion: `VIA E2E ${marca} ACT`
          }),
          consultaInicial: {
            descripcion: `VIA E2E ${marca}`
          },
          consultaActualizada: {
            descripcion: `VIA E2E ${marca} ACT`
          },
          coincideInicial: (item) =>
            item['descripcion'] === `VIA E2E ${marca}`,
          coincideActualizado: (item) =>
            item['descripcion'] === `VIA E2E ${marca} ACT`
        });
      });

      await test.step('Naviera', async () => {
        await ejecutarCiclo(request, headers, {
          nombre: 'naviera',
          endpoint: '/api/navieras',
          idCampo: 'navieraId',
          crear: {
            navieraId: 0,
            codigo,
            nombre: `NAVIERA E2E ${marca}`,
            pais: 'PERÚ',
            contacto: 'CONTACTO E2E',
            correo: `naviera.${marca}@example.com`,
            telefono: '987654321',
            sitioWeb: 'https://example.com'
          },
          actualizar: (id) => ({
            navieraId: id,
            codigo,
            nombre: `NAVIERA E2E ${marca} ACT`,
            pais: 'PERÚ',
            contacto: 'CONTACTO ACTUALIZADO',
            correo: `naviera.${marca}@example.com`,
            telefono: '999888777',
            sitioWeb: 'https://example.com'
          }),
          consultaInicial: { texto: codigo },
          consultaActualizada: { texto: codigo },
          coincideInicial: (item) =>
            item['codigo'] === codigo &&
            item['nombre'] === `NAVIERA E2E ${marca}`,
          coincideActualizado: (item) =>
            item['codigo'] === codigo &&
            item['nombre'] === `NAVIERA E2E ${marca} ACT`
        });
      });

      await test.step('Puerto de llegada', async () => {
        await ejecutarCiclo(request, headers, {
          nombre: 'puerto de llegada',
          endpoint: '/api/puertos-llegada',
          idCampo: 'puertoLlegadaId',
          crear: {
            puertoLlegadaId: 0,
            codigo: `P${marca}`,
            puerto: `PUERTO E2E ${marca}`,
            pais: 'PERÚ'
          },
          actualizar: (id) => ({
            puertoLlegadaId: id,
            codigo: `P${marca}`,
            puerto: `PUERTO E2E ${marca} ACT`,
            pais: 'CHILE'
          }),
          consultaInicial: { texto: `P${marca}` },
          consultaActualizada: { texto: `P${marca}` },
          coincideInicial: (item) =>
            item['codigo'] === `P${marca}` &&
            item['pais'] === 'PERÚ',
          coincideActualizado: (item) =>
            item['codigo'] === `P${marca}` &&
            item['pais'] === 'CHILE'
        });
      });

      await test.step('Operador logístico', async () => {
        await ejecutarCiclo(request, headers, {
          nombre: 'operador logístico',
          endpoint: '/api/operadores-logisticos',
          idCampo: 'operadorLogisticoId',
          crear: {
            operadorLogisticoId: 0,
            ruc,
            razonSocial: `OPERADOR E2E ${marca}`,
            nombreComercial: 'OPERADOR PRUEBA',
            contacto: 'CONTACTO E2E',
            correo: `operador.${marca}@example.com`,
            telefono: '987654321',
            direccion: 'DIRECCIÓN DE PRUEBA'
          },
          actualizar: (id) => ({
            operadorLogisticoId: id,
            ruc,
            razonSocial: `OPERADOR E2E ${marca} ACT`,
            nombreComercial: 'OPERADOR ACTUALIZADO',
            contacto: 'CONTACTO E2E',
            correo: `operador.${marca}@example.com`,
            telefono: '999888777',
            direccion: 'DIRECCIÓN ACTUALIZADA'
          }),
          consultaInicial: { texto: ruc },
          consultaActualizada: { texto: ruc },
          coincideInicial: (item) =>
            item['ruc'] === ruc &&
            item['razonSocial'] === `OPERADOR E2E ${marca}`,
          coincideActualizado: (item) =>
            item['ruc'] === ruc &&
            item['razonSocial'] === `OPERADOR E2E ${marca} ACT`
        });
      });

      await test.step('Situación', async () => {
        await ejecutarCiclo(request, headers, {
          nombre: 'situación',
          endpoint: '/api/situaciones',
          idCampo: 'situacionId',
          crear: {
            situacionId: 0,
            descripcion: `SITUACION E2E ${marca}`
          },
          actualizar: (id) => ({
            situacionId: id,
            descripcion: `SITUACION E2E ${marca} ACT`
          }),
          consultaInicial: {
            descripcion: `SITUACION E2E ${marca}`
          },
          consultaActualizada: {
            descripcion: `SITUACION E2E ${marca} ACT`
          },
          coincideInicial: (item) =>
            item['descripcion'] === `SITUACION E2E ${marca}`,
          coincideActualizado: (item) =>
            item['descripcion'] === `SITUACION E2E ${marca} ACT`
        });
      });

      let productoId = 0;

      await test.step('Producto', async () => {
        productoId = await ejecutarCiclo(
          request,
          headers,
          {
            nombre: 'producto',
            endpoint: '/api/productos',
            idCampo: 'productoId',
            crear: {
              productoId: 0,
              codigo: `PR${marca}`,
              nombre: `PRODUCTO E2E ${marca}`,
              descripcion: 'PRODUCTO PARA PRUEBA E2E'
            },
            actualizar: (id) => ({
              productoId: id,
              codigo: `PR${marca}`,
              nombre: `PRODUCTO E2E ${marca} ACT`,
              descripcion: 'PRODUCTO ACTUALIZADO'
            }),
            consultaInicial: { texto: `PR${marca}` },
            consultaActualizada: { texto: `PR${marca}` },
            coincideInicial: (item) =>
              item['codigo'] === `PR${marca}` &&
              item['nombre'] === `PRODUCTO E2E ${marca}`,
            coincideActualizado: (item) =>
              item['codigo'] === `PR${marca}` &&
              item['nombre'] === `PRODUCTO E2E ${marca} ACT`
          }
        );
      });

      await test.step('Variedad', async () => {
        const productos = await request.get(
          `${apiUrl}/api/productos` +
            `?texto=PR${marca}` +
            '&activo=false&pagina=1&tamPagina=10',
          { headers }
        );

        expect(productos.status()).toBe(200);
        const cuerpo = await productos.json();
        productoId = Number(
          (cuerpo.datos ?? []).find(
            (item: Registro) =>
              item['codigo'] === `PR${marca}`
          )?.productoId ?? productoId
        );

        expect(productoId).toBeGreaterThan(0);

        const reactivacion = await request.delete(
          `${apiUrl}/api/productos` +
            `?productoId=${productoId}&activo=true`,
          { headers }
        );
        expect(reactivacion.status()).toBe(200);

        await ejecutarCiclo(request, headers, {
          nombre: 'variedad',
          endpoint: '/api/variedades',
          idCampo: 'variedadId',
          crear: {
            variedadId: 0,
            productoId,
            nombre: `VARIEDAD E2E ${marca}`
          },
          actualizar: (id) => ({
            variedadId: id,
            productoId,
            nombre: `VARIEDAD E2E ${marca} ACT`
          }),
          consultaInicial: {
            texto: `VARIEDAD E2E ${marca}`,
            productoId: String(productoId)
          },
          consultaActualizada: {
            texto: `VARIEDAD E2E ${marca} ACT`,
            productoId: String(productoId)
          },
          coincideInicial: (item) =>
            item['nombre'] === `VARIEDAD E2E ${marca}` &&
            Number(item['productoId']) === productoId,
          coincideActualizado: (item) =>
            item['nombre'] === `VARIEDAD E2E ${marca} ACT` &&
            Number(item['productoId']) === productoId
        });

        const desactivarProducto = await request.delete(
          `${apiUrl}/api/productos` +
            `?productoId=${productoId}&activo=false`,
          { headers }
        );
        expect(desactivarProducto.status()).toBe(200);
      });
    }
  );
});
