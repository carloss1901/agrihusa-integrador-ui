import {
  expect,
  test
} from '@playwright/test';

import {
  iniciarSesion
} from './helpers/autenticacion';

const apiUrl =
  process.env['E2E_API_URL'] ??
  'http://localhost:8085';

interface ClienteApi {
  clienteId: number;
  tipoDocumento: string;
  numeroDocumento: string;
  razonSocial: string;
  nombreComercial?: string;
  correo?: string;
  telefono?: string;
  pais: string;
  activo: boolean;
}

test.describe('Ciclo de cliente', () => {
  test(
    'registra, evita duplicados, edita y desactiva',
    async ({ page, request }) => {
      test.setTimeout(60000);

      await iniciarSesion(page);

      const token = await page.evaluate(() =>
        localStorage.getItem('token')
      );

      expect(token).toBeTruthy();

      const headers = {
        Authorization: `Bearer ${token}`
      };

      const documento = String(
        10000000 + (Date.now() % 90000000)
      );
      const razonSocial =
        `CLIENTE E2E ${documento}`;
      const correo =
        `cliente.${documento}@example.com`;

      await page.goto('/clientes');

      await page
        .getByTitle('Registrar cliente')
        .locator('button')
        .click();

      const modal = page.getByRole('dialog');
      await expect(modal).toBeVisible();

      await modal.locator(
        'ng-select[formcontrolname="tipoDocumento"]'
      ).click();

      await page.locator(
        '.ng-dropdown-panel:visible .ng-option'
      ).filter({
        hasText: /^DNI$/
      }).click();

      await modal.locator('#numeroDocumentoCliente')
        .fill(documento);
      await modal.locator('#paisCliente')
        .fill('PERÚ');
      await modal.locator('#razonSocialCliente')
        .fill(razonSocial);
      await modal.locator('#nombreComercialCliente')
        .fill('CLIENTE PRUEBA');
      await modal.locator('#contactoCliente')
        .fill('CONTACTO E2E');
      await modal.locator('#correoCliente')
        .fill(correo);
      await modal.locator('#telefonoCliente')
        .fill('987654321');
      await modal.locator('#direccionCliente')
        .fill('DIRECCIÓN DE PRUEBA');

      const registroResponse =
        page.waitForResponse((response) =>
          new URL(response.url()).pathname ===
            '/api/clientes' &&
          response.request().method() === 'POST'
        );

      await modal.getByRole('button', {
        name: /Guardar/
      }).click();

      expect(
        (await registroResponse).status()
      ).toBe(201);

      const consultaCreado = await request.get(
        `${apiUrl}/api/clientes` +
          `?texto=${documento}` +
          '&activo=true' +
          '&pagina=1&tamPagina=10',
        { headers }
      );

      expect(consultaCreado.status()).toBe(200);

      const cuerpoCreado =
        await consultaCreado.json();
      const cliente: ClienteApi | undefined =
        (cuerpoCreado.datos ?? []).find(
          (item: ClienteApi) =>
            item.numeroDocumento === documento
        );

      if (!cliente) {
        throw new Error(
          'No se encontró el cliente creado.'
        );
      }

      const duplicado = await request.post(
        `${apiUrl}/api/clientes`,
        {
          headers,
          data: {
            clienteId: 0,
            tipoDocumento: 'DNI',
            numeroDocumento: documento,
            razonSocial,
            nombreComercial: 'CLIENTE PRUEBA',
            contacto: 'CONTACTO E2E',
            correo,
            telefono: '987654321',
            direccion: 'DIRECCIÓN DE PRUEBA',
            pais: 'PERÚ'
          }
        }
      );

      expect(duplicado.status()).toBe(409);

      await page.locator('#filtroClienteTexto')
        .fill(documento);

      const busquedaResponse =
        page.waitForResponse((response) => {
          const url = new URL(response.url());

          return (
            url.pathname === '/api/clientes' &&
            url.searchParams.get('texto') ===
              documento &&
            response.request().method() === 'GET'
          );
        });

      await page.getByRole('button', {
        name: /Buscar/
      }).click();

      expect(
        (await busquedaResponse).status()
      ).toBe(200);

      let fila = page.locator('tbody tr').filter({
        hasText: documento
      });
      await expect(fila).toHaveCount(1);
      await fila.click();

      await page
        .getByTitle('Editar cliente')
        .locator('button')
        .click();

      const modalEdicion = page.getByRole('dialog');
      await expect(modalEdicion).toBeVisible();

      await modalEdicion
        .locator('#razonSocialCliente')
        .fill(`${razonSocial} ACTUALIZADO`);
      await modalEdicion
        .locator('#telefonoCliente')
        .fill('999888777');

      const actualizacionResponse =
        page.waitForResponse((response) =>
          new URL(response.url()).pathname ===
            '/api/clientes' &&
          response.request().method() === 'PUT'
        );

      await modalEdicion.getByRole('button', {
        name: /Guardar/
      }).click();

      expect(
        (await actualizacionResponse).status()
      ).toBe(200);

      const consultaActualizado =
        await request.get(
          `${apiUrl}/api/clientes` +
            `?texto=${documento}` +
            '&activo=true' +
            '&pagina=1&tamPagina=10',
          { headers }
        );

      expect(consultaActualizado.status())
        .toBe(200);

      const cuerpoActualizado =
        await consultaActualizado.json();
      const actualizado: ClienteApi | undefined =
        (cuerpoActualizado.datos ?? []).find(
          (item: ClienteApi) =>
            item.numeroDocumento === documento
        );

      expect(actualizado?.razonSocial)
        .toBe(`${razonSocial} ACTUALIZADO`);
      expect(actualizado?.telefono)
        .toBe('999888777');

      fila = page.locator('tbody tr').filter({
        hasText: documento
      });
      await expect(fila).toHaveCount(1);
      await fila.click();

      await page
        .getByTitle('Desactivar cliente')
        .locator('button')
        .click();

      const confirmacion = page.getByRole('dialog');
      await expect(confirmacion).toBeVisible();

      const desactivacionResponse =
        page.waitForResponse((response) => {
          const url = new URL(response.url());

          return (
            url.pathname === '/api/clientes' &&
            url.searchParams.get('clienteId') ===
              String(cliente.clienteId) &&
            url.searchParams.get('activo') ===
              'false' &&
            response.request().method() === 'DELETE'
          );
        });

      await confirmacion.getByRole('button', {
        name: /Confirmar/
      }).click();

      expect(
        (await desactivacionResponse).status()
      ).toBe(200);

      const consultaInactivo = await request.get(
        `${apiUrl}/api/clientes` +
          `?texto=${documento}` +
          '&activo=false' +
          '&pagina=1&tamPagina=10',
        { headers }
      );

      expect(consultaInactivo.status()).toBe(200);

      const cuerpoInactivo =
        await consultaInactivo.json();
      const inactivo: ClienteApi | undefined =
        (cuerpoInactivo.datos ?? []).find(
          (item: ClienteApi) =>
            item.numeroDocumento === documento
        );

      expect(inactivo?.activo).toBe(false);
    }
  );
});
