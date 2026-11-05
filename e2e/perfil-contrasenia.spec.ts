import {
  expect,
  test
} from '@playwright/test';

import { randomUUID } from 'node:crypto';

import {
  iniciarSesion
} from './helpers/autenticacion';

const apiUrl =
  process.env['E2E_API_URL'] ??
  'http://localhost:8085';

function crearCredencialTemporal(): string {
  return [
    'E2E',
    randomUUID().replaceAll('-', ''),
    'Aa1',
    String.fromCharCode(33)
  ].join('-');
}

interface UsuarioApi {
  usuarioId: number;
  usuario: string;
  nombres: string;
  apellidos?: string;
  correo: string;
  telefono?: string;
}

test.describe('Perfil y contraseña', () => {
  test(
    'actualiza el perfil y controla el cambio de contraseña',
    async ({ page, request }) => {
      test.setTimeout(90000);

      await iniciarSesion(page);

      const tokenAdministrador =
        await page.evaluate(() =>
          localStorage.getItem('token')
        );

      expect(tokenAdministrador).toBeTruthy();

      const headersAdministrador = {
        Authorization: `Bearer ${tokenAdministrador}`
      };

      const dni = String(
        10000000 + (Date.now() % 90000000)
      );
      const correoInicial =
        `perfil.${dni}@example.com`;
      const correoActualizado =
        `perfil.actualizado.${dni}@example.com`;
      const passwordInicial =
        crearCredencialTemporal();
      const passwordNueva =
        crearCredencialTemporal();

      const registro = await request.post(
        `${apiUrl}/api/usuarios`,
        {
          headers: headersAdministrador,
          data: {
            usuarioId: 0,
            dni,
            nombres: 'PERFIL E2E',
            apellidoPaterno: 'PRUEBA',
            apellidoMaterno: 'CALIDAD',
            correo: correoInicial,
            telefono: '900111222',
            rolId: 1,
            contraseniaTemporal: passwordInicial
          }
        }
      );

      expect(registro.status()).toBe(201);

      const consultaCreado = await request.get(
        `${apiUrl}/api/usuarios` +
          `?texto=${dni}` +
          '&activo=true' +
          '&pagina=1&tamPagina=10',
        { headers: headersAdministrador }
      );

      expect(consultaCreado.status()).toBe(200);

      const cuerpoCreado =
        await consultaCreado.json();
      const usuario: UsuarioApi | undefined =
        (cuerpoCreado.datos ?? []).find(
          (item: UsuarioApi) => item.usuario === dni
        );

      if (!usuario) {
        throw new Error(
          'No se encontró el usuario de perfil.'
        );
      }

      await page.evaluate(() => localStorage.clear());

      await iniciarSesion(
        page,
        dni,
        passwordInicial
      );

      await page.goto('/perfil-usuario');

      await expect(
        page.locator('#perfilNombres')
      ).toBeVisible();

      await page.locator('#perfilNombres')
        .fill('PERFIL E2E ACTUALIZADO');
      await page.locator('#perfilApellidos')
        .fill('PRUEBA CALIDAD');
      await page.locator('#perfilCorreo')
        .fill(correoActualizado);
      await page.locator('#perfilTelefono')
        .fill('988776655');

      const actualizacionPerfil =
        page.waitForResponse((response) =>
          new URL(response.url()).pathname ===
            '/api/usuarios' &&
          response.request().method() === 'PUT'
        );

      await page.getByRole('button', {
        name: /Guardar cambios/
      }).click();

      expect(
        (await actualizacionPerfil).status()
      ).toBe(200);

      await expect(
        page.getByText(
          'El perfil se actualizó correctamente.'
        )
      ).toBeVisible();

      const consultaActualizado = await request.get(
        `${apiUrl}/api/usuarios` +
          `?texto=${dni}` +
          '&activo=true' +
          '&pagina=1&tamPagina=10',
        { headers: headersAdministrador }
      );

      const cuerpoActualizado =
        await consultaActualizado.json();
      const actualizado: UsuarioApi | undefined =
        (cuerpoActualizado.datos ?? []).find(
          (item: UsuarioApi) => item.usuario === dni
        );

      expect(actualizado?.nombres)
        .toBe('PERFIL E2E ACTUALIZADO');
      expect(actualizado?.correo)
        .toBe(correoActualizado);
      expect(actualizado?.telefono)
        .toBe('988776655');

      await page.locator('#perfilPasswordActual')
        .fill('PasswordIncorrecta1*');
      await page.locator('#perfilNuevaPassword')
        .fill(passwordNueva);
      await page.locator('#perfilConfirmarPassword')
        .fill(passwordNueva);

      const rechazoPassword =
        page.waitForResponse((response) =>
          new URL(response.url()).pathname ===
            '/api/usuarios/contrasenia' &&
          response.request().method() === 'PUT'
        );

      await page.getByRole('button', {
        name: /Cambiar contraseña/
      }).click();

      expect(
        (await rechazoPassword).status()
      ).toBeGreaterThanOrEqual(400);

      await expect(
        page.locator('.password-card [role="alert"]')
      ).toBeVisible();

      await page.locator('#perfilPasswordActual')
        .fill(passwordInicial);
      await page.locator('#perfilNuevaPassword')
        .fill(passwordNueva);
      await page.locator('#perfilConfirmarPassword')
        .fill(passwordNueva);

      const cambioPassword =
        page.waitForResponse((response) =>
          new URL(response.url()).pathname ===
            '/api/usuarios/contrasenia' &&
          response.request().method() === 'PUT'
        );

      await page.getByRole('button', {
        name: /Cambiar contraseña/
      }).click();

      expect(
        (await cambioPassword).status()
      ).toBe(200);

      await expect(
        page.locator('.password-card [role="status"]')
      ).toBeVisible();

      const loginNueva = await request.post(
        `${apiUrl}/api/login`,
        {
          data: {
            usuario: dni,
            contrasenia: passwordNueva
          }
        }
      );

      expect(loginNueva.status()).toBe(200);

      const tokenUsuario =
        (await loginNueva.json()).data as string;

      const restaurarPassword = await request.put(
        `${apiUrl}/api/usuarios/contrasenia`,
        {
          headers: {
            Authorization: `Bearer ${tokenUsuario}`
          },
          data: {
            contraseniaActual: passwordNueva,
            nuevaContrasenia: passwordInicial,
            confirmarContrasenia: passwordInicial
          }
        }
      );

      expect(restaurarPassword.status()).toBe(200);

      const desactivar = await request.delete(
        `${apiUrl}/api/usuarios` +
          `?usuarioId=${usuario.usuarioId}` +
          '&activo=false',
        { headers: headersAdministrador }
      );

      expect(desactivar.status()).toBe(200);
    }
  );
});
