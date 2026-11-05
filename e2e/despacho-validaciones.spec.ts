import {
  expect,
  test
} from '@playwright/test';

import {
  iniciarSesion
} from './helpers/autenticacion';

test.describe('Validaciones del despacho', () => {
  test(
    'no permite guardar campos obligatorios vacíos',
    async ({ page }) => {
      const usuario =
        process.env['E2E_OPERATOR_USER'];

      const password =
        process.env['E2E_OPERATOR_PASSWORD'];

      if (!usuario || !password) {
        throw new Error(
          'Configura las credenciales del Operador.'
        );
      }

      await iniciarSesion(
        page,
        usuario,
        password
      );

      const menu = page.locator(
        '#agrihusa-aside-menu'
      );

      await menu
        .getByText('Registro de despacho', {
          exact: true
        })
        .click();

      const registrar = page
        .getByTitle('Registrar despacho')
        .locator('button');

      await expect(registrar).toBeEnabled();

      await registrar.click();

      await expect(
        page.getByText('REGISTRAR DESPACHO', {
          exact: true
        })
      ).toBeVisible();

      let solicitudesPost = 0;

      page.on('request', (request) => {
        if (
          request.method() === 'POST' &&
          request.url().includes('/api/despachos')
        ) {
          solicitudesPost++;
        }
      });

      await page
        .locator('.modal-footer')
        .getByRole('button', {
          name: /Guardar/
        })
        .click();

      const mensajesEsperados = [
        'Selecciona la fecha de despacho.',
        'Selecciona la fecha estimada.',
        'Selecciona un cliente.',
        'Selecciona un destino.',
        'Selecciona un producto.',
        'Selecciona una variedad del producto.',
        'Ingresa una cantidad mayor que cero.',
        'Ingresa entre 4 y 20 letras, números o guiones.'
      ];

      for (const mensaje of mensajesEsperados) {
        await expect(
          page.getByText(mensaje, {
            exact: true
          })
        ).toBeVisible();
      }

      expect(solicitudesPost).toBe(0);

      await page
        .locator('.modal-footer')
        .getByRole('button', {
          name: /Cancelar/
        })
        .click();
    }
  );
});