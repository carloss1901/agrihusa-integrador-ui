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

interface UsuarioApi {
  usuarioId: number;
  usuario: string;
  nombres: string;
  correo: string;
  telefono?: string;
  rolId: number;
  activo: boolean;
}

test.describe('Ciclo de usuario', () => {
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

      const dni = String(
        10000000 +
          (Date.now() % 90000000)
      );
      const correo =
        `e2e.usuario.${dni}@example.com`;
      const contraseniaTemporal =
        `Temp${dni}*`;

      const rolesResponse =
        page.waitForResponse((response) =>
          response.url().includes(
            '/api/comun/roles-activos'
          ) &&
          response.request().method() === 'GET'
        );

      await page.goto('/usuarios');

      expect(
        (await rolesResponse).status()
      ).toBe(200);

      await page
        .getByTitle('Registrar usuario')
        .locator('button')
        .click();

      const modal = page.getByRole('dialog');
      await expect(modal).toBeVisible();

      await modal.locator('#nombreUsuario')
        .fill(dni);
      await modal.locator('#nombresUsuario')
        .fill('USUARIO E2E');
      await modal.locator(
        '#apellidoPaternoUsuario'
      ).fill('PRUEBA');
      await modal.locator(
        '#apellidoMaternoUsuario'
      ).fill('CALIDAD');
      await modal.locator('#correoUsuario')
        .fill(correo);
      await modal.locator('#telefonoUsuario')
        .fill('999888777');
      await modal.locator(
        '#contraseniaTemporalUsuario'
      ).fill(contraseniaTemporal);

      await modal.locator(
        'ng-select[formcontrolname="rolId"]'
      ).click();
      await page.locator(
        '.ng-dropdown-panel:visible ' +
        '.ng-option:not(.ng-option-disabled)'
      ).first().click();

      const registroResponse =
        page.waitForResponse((response) =>
          new URL(response.url()).pathname ===
            '/api/usuarios' &&
          response.request().method() === 'POST'
        );

      await modal.getByRole('button', {
        name: /Guardar/
      }).click();

      expect(
        (await registroResponse).status()
      ).toBe(201);

      const consultaCreado = await request.get(
        `${apiUrl}/api/usuarios` +
          `?texto=${dni}` +
          '&activo=true' +
          '&pagina=1&tamPagina=10',
        { headers }
      );

      expect(consultaCreado.status()).toBe(200);

      const cuerpoCreado =
        await consultaCreado.json();
      const usuario: UsuarioApi | undefined =
        (cuerpoCreado.datos ?? []).find(
          (item: UsuarioApi) =>
            item.usuario === dni
        );

      if (!usuario) {
        throw new Error(
          'No se encontró el usuario creado.'
        );
      }

      expect(usuario.telefono).toBe('999888777');

      const loginTemporal = await request.post(
        `${apiUrl}/api/login`,
        {
          data: {
            usuario: dni,
            contrasenia: contraseniaTemporal
          }
        }
      );

      expect(loginTemporal.status()).toBe(200);

      const duplicado = await request.post(
        `${apiUrl}/api/usuarios`,
        {
          headers,
          data: {
            usuarioId: 0,
            dni,
            nombres: 'USUARIO E2E',
            apellidoPaterno: 'PRUEBA',
            apellidoMaterno: 'CALIDAD',
            correo,
            telefono: '999888777',
            rolId: usuario.rolId,
            contraseniaTemporal
          }
        }
      );

      expect(duplicado.status()).toBe(409);

      await page.locator('#filtroUsuarioTexto')
        .fill(dni);

      const busquedaResponse =
        page.waitForResponse((response) => {
          const url = new URL(response.url());

          return (
            url.pathname === '/api/usuarios' &&
            url.searchParams.get('texto') === dni &&
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
        hasText: dni
      });
      await expect(fila).toHaveCount(1);
      await fila.click();

      await page
        .getByTitle('Editar usuario')
        .locator('button')
        .click();

      const modalEdicion = page.getByRole('dialog');
      await expect(modalEdicion).toBeVisible();
      await expect(
        modalEdicion.locator(
          '#contraseniaTemporalUsuario'
        )
      ).toHaveCount(0);

      await modalEdicion.locator('#nombresUsuario')
        .fill('USUARIO E2E ACTUALIZADO');
      await modalEdicion.locator('#telefonoUsuario')
        .fill('988777666');

      const actualizacionResponse =
        page.waitForResponse((response) =>
          new URL(response.url()).pathname ===
            '/api/usuarios' &&
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
          `${apiUrl}/api/usuarios` +
            `?texto=${dni}` +
            '&activo=true' +
            '&pagina=1&tamPagina=10',
          { headers }
        );

      const cuerpoActualizado =
        await consultaActualizado.json();
      const usuarioActualizado: UsuarioApi =
        cuerpoActualizado.datos[0];

      expect(usuarioActualizado.nombres)
        .toBe('USUARIO E2E ACTUALIZADO');
      expect(usuarioActualizado.telefono)
        .toBe('988777666');

      fila = page.locator('tbody tr').filter({
        hasText: dni
      });
      await expect(fila).toHaveCount(1);
      await fila.click();

      page.once('dialog', (dialog) =>
        dialog.accept()
      );

      const desactivacionResponse =
        page.waitForResponse((response) => {
          const url = new URL(response.url());

          return (
            url.pathname === '/api/usuarios' &&
            url.searchParams.get('usuarioId') ===
              String(usuario.usuarioId) &&
            url.searchParams.get('activo') ===
              'false' &&
            response.request().method() === 'DELETE'
          );
        });

      await page
        .getByTitle('Desactivar usuario')
        .locator('button')
        .click();

      expect(
        (await desactivacionResponse).status()
      ).toBe(200);

      const consultaInactivo = await request.get(
        `${apiUrl}/api/usuarios` +
          `?texto=${dni}` +
          '&activo=false' +
          '&pagina=1&tamPagina=10',
        { headers }
      );

      expect(consultaInactivo.status()).toBe(200);

      const cuerpoInactivo =
        await consultaInactivo.json();
      const inactivo: UsuarioApi | undefined =
        (cuerpoInactivo.datos ?? []).find(
          (item: UsuarioApi) =>
            item.usuario === dni
        );

      expect(inactivo?.activo).toBe(false);
    }
  );
});
