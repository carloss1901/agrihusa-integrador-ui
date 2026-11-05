import {
  expect,
  test
} from '@playwright/test';

import {
  iniciarSesion
} from './helpers/autenticacion';

test.describe('Permisos del Administrador', () => {
  test(
    'muestra todos los módulos autorizados',
    async ({ page }) => {
      await iniciarSesion(page);

      await expect(
        page.getByText('ADMINISTRADOR', {
          exact: true
        })
      ).toBeVisible();

      const menu = page.locator(
        '#agrihusa-aside-menu'
      );

      const opcionesEsperadas = [
        'Roles',
        'Usuarios',
        'Clientes',
        'Destinos',
        'Vías',
        'Navieras',
        'Puertos de llegada',
        'Operadores logísticos',
        'Productos',
        'Variedades',
        'Registro de despacho',
        'Reporte de despacho',
        'Situaciones',
        'Perfil de usuario',
        'Bitácora'
      ];

      for (const opcion of opcionesEsperadas) {
        await expect(
          menu.getByText(opcion, {
            exact: true
          })
        ).toBeVisible();
      }
    }
  );
});