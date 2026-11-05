import {
  expect,
  test
} from '@playwright/test';

import {
  iniciarSesion
} from './helpers/autenticacion';
import {
  abrirModuloDespachos,
  registrarDespachoUi
} from './helpers/despacho';

const apiUrl =
  process.env['E2E_API_URL'] ??
  'http://localhost:8085';

test.describe('Registro de despacho', () => {
  test(
    'registra y persiste un despacho válido',
    async ({ page, request }) => {
      test.setTimeout(60000);

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

      const token = await page.evaluate(() =>
        localStorage.getItem('token')
      );

      expect(token).toBeTruthy();

      await abrirModuloDespachos(page);

      const numeroContenedor =
        `E2E-${Date.now()}`;

      const estadoRegistro =
        await registrarDespachoUi(
          page,
          numeroContenedor
        );

      expect([200, 201]).toContain(
        estadoRegistro
      );

      const consulta = await request.get(
        `${apiUrl}/api/despachos` +
          `?texto=${encodeURIComponent(
            numeroContenedor
          )}` +
          '&pagina=1&tamPagina=10',
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      expect(
        consulta.status()
      ).toBe(200);

      const cuerpo =
        await consulta.json();

      const despachoCreado = (
        cuerpo.datos ?? []
      ).find(
        (item: {
          numeroContenedor?: string;
        }) =>
          item.numeroContenedor ===
          numeroContenedor
      );

      expect(
        despachoCreado
      ).toBeTruthy();

      expect(
        despachoCreado.activo
      ).toBe(true);
    }
  );
});
