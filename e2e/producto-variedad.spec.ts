import {
  expect,
  test
} from '@playwright/test';

import {
  iniciarSesion
} from './helpers/autenticacion';
import {
  abrirModuloDespachos
} from './helpers/despacho';

test.describe('Relación producto y variedad', () => {
  test(
    'PALTA muestra HASS y FUERTE únicamente',
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

      await abrirModuloDespachos(page);

      await page
        .getByTitle('Registrar despacho')
        .locator('button')
        .click();

      const modal = page.getByRole('dialog');

      await expect(
        modal.getByText('REGISTRAR DESPACHO', {
          exact: true
        })
      ).toBeVisible();

      const producto = modal.locator(
        'ng-select[formcontrolname="productoId"]'
      );

      await producto.click();

      const opcionPalta = page
        .locator(
          '.ng-dropdown-panel:visible ' +
          '.ng-option:not(.ng-option-disabled)'
        )
        .getByText('PALTA', {
          exact: true
        });

      await expect(opcionPalta).toBeVisible();
      await opcionPalta.click();

      const variedad = modal.locator(
        'ng-select[formcontrolname="variedadId"]'
      );

      await expect(variedad).not.toHaveClass(
        /ng-select-readonly/
      );

      await variedad.click();

      const opciones = page.locator(
        '.ng-dropdown-panel:visible ' +
        '.ng-option:not(.ng-option-disabled)'
      );

      const opcionHass = opciones.getByText(
        'HASS',
        {
          exact: true
        }
      );

      const opcionFuerte = opciones.getByText(
        'FUERTE',
        {
          exact: true
        }
      );

      await expect(opcionHass).toBeVisible();
      await expect(opcionFuerte).toBeVisible();

      await expect(
        opciones.getByText('ITALIANAS', {
          exact: true
        })
      ).toHaveCount(0);

      await opcionHass.click();

      await expect(
        variedad.locator('.ng-value-label')
      ).toHaveText('HASS');

      await modal
        .getByRole('button', {
          name: /Cancelar/
        })
        .click();

      await expect(modal).toBeHidden();
    }
  );
});
