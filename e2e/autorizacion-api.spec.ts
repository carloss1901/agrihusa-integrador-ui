import {
  APIRequestContext,
  expect,
  Page,
  test
} from '@playwright/test';

import {
  iniciarSesion
} from './helpers/autenticacion';

const apiUrl =
  process.env['E2E_API_URL'] ??
  'http://localhost:8085';

async function obtenerToken(
  page: Page,
  usuario: string | undefined,
  password: string | undefined
): Promise<string> {
  if (!usuario || !password) {
    throw new Error(
      'Faltan credenciales para ejecutar la prueba.'
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

  return token as string;
}

async function validarAccesos(
  request: APIRequestContext,
  token: string
): Promise<void> {
  const headers = {
    Authorization: `Bearer ${token}`
  };

  const respuestaPermitida = await request.get(
    `${apiUrl}/api/despachos?pagina=1&tamPagina=10`,
    {
      headers
    }
  );

  expect(respuestaPermitida.status()).toBe(200);

  const respuestaRestringida = await request.get(
    `${apiUrl}/api/usuarios?pagina=1&tamPagina=10`,
    {
      headers
    }
  );

  expect(respuestaRestringida.status()).toBe(403);
}

test.describe('Autorización de la API', () => {
  test(
    'el Operador consulta despachos pero no usuarios',
    async ({ page, request }) => {
      const token = await obtenerToken(
        page,
        process.env['E2E_OPERATOR_USER'],
        process.env['E2E_OPERATOR_PASSWORD']
      );

      await validarAccesos(
        request,
        token
      );
    }
  );

  test(
    'Consulta accede a despachos pero no usuarios',
    async ({ page, request }) => {
      const token = await obtenerToken(
        page,
        process.env['E2E_CONSULTA_USER'],
        process.env['E2E_CONSULTA_PASSWORD']
      );

      await validarAccesos(
        request,
        token
      );
    }
  );
});