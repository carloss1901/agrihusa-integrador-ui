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

test.describe('Interoperabilidad meteorológica', () => {
  test.beforeEach(async ({ page }) => {
    await iniciarSesion(page);
  });

  test(
    'consulta y mapea el clima de un destino válido',
    async ({ page, request }) => {
      const token = await page.evaluate(() =>
        localStorage.getItem('token')
      );

      const response = await request.get(
        `${apiUrl}/api/meteorologia` +
          '?destino=Huaral',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      expect(response.status()).toBe(200);

      const clima = await response.json();

      expect(clima.destino).toBeTruthy();
      expect(clima.pais).toBeTruthy();
      expect(typeof clima.latitud).toBe('number');
      expect(typeof clima.longitud).toBe('number');
      expect(typeof clima.temperaturaCelsius)
        .toBe('number');
      expect(typeof clima.precipitacionMm)
        .toBe('number');
      expect(typeof clima.velocidadVientoKmh)
        .toBe('number');
      expect(typeof clima.codigoTiempo)
        .toBe('number');
      expect(clima.descripcion).toBeTruthy();
    }
  );

  test(
    'utiliza caché en una consulta repetida',
    async ({ page, request }) => {
      const token = await page.evaluate(() =>
        localStorage.getItem('token')
      );
      const options = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const url =
        `${apiUrl}/api/meteorologia` +
        '?destino=Huaral';

      expect((await request.get(url, options)).status())
        .toBe(200);

      const segunda = await request.get(
        url,
        options
      );

      expect(segunda.status()).toBe(200);
      expect((await segunda.json()).desdeCache)
        .toBe(true);
    }
  );

  test(
    'responde 404 cuando el destino no existe',
    async ({ page, request }) => {
      const token = await page.evaluate(() =>
        localStorage.getItem('token')
      );

      const response = await request.get(
        `${apiUrl}/api/meteorologia` +
          '?destino=ZZZ_DESTINO_E2E_999999_NO_EXISTE',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      expect(response.status()).toBe(404);
    }
  );

  test(
    'rechaza un destino vacío',
    async ({ page, request }) => {
      const token = await page.evaluate(() =>
        localStorage.getItem('token')
      );

      const response = await request.get(
        `${apiUrl}/api/meteorologia?destino=`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      expect(response.status()).toBe(400);
    }
  );
});
