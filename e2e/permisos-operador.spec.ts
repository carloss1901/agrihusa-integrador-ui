import {
  expect,
  test
} from '@playwright/test';

import {
  iniciarSesion
} from './helpers/autenticacion';

test.describe('Permisos del Operador', () => {
  test(
    'muestra únicamente los módulos autorizados',
    async ({ page }) => {
      const usuario =
        process.env['E2E_OPERATOR_USER'];

      const password =
        process.env['E2E_OPERATOR_PASSWORD'];

      if (!usuario || !password) {
        throw new Error(
          'Configura E2E_OPERATOR_USER y E2E_OPERATOR_PASSWORD.'
        );
      }

      await iniciarSesion(
        page,
        usuario,
        password
      );

      await expect(
        page.getByText('OPERADOR', {
          exact: true
        })
      ).toBeVisible();

      const menu = page.locator(
        '#agrihusa-aside-menu'
      );

      const opcionesPermitidas = [
        'Registro de despacho',
        'Reporte de despacho',
        'Perfil de usuario',
        'Bitácora'
      ];

      for (const opcion of opcionesPermitidas) {
        await expect(
          menu.getByText(opcion, {
            exact: true
          })
        ).toBeVisible();
      }

      const opcionesRestringidas = [
        'Roles',
        'Usuarios'
      ];

      for (const opcion of opcionesRestringidas) {
        await expect(
          menu.getByText(opcion, {
            exact: true
          })
        ).toHaveCount(0);
      }
    }
  );
});