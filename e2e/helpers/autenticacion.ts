import {
  expect,
  Page
} from '@playwright/test';

export async function iniciarSesion(
  page: Page,
  usuarioIngresado?: string,
  passwordIngresado?: string
): Promise<void> {
  const usuario =
    usuarioIngresado ??
    process.env['E2E_USER'];

  const password =
    passwordIngresado ??
    process.env['E2E_PASSWORD'];

  if (!usuario || !password) {
    throw new Error(
      'Configura las credenciales E2E antes de ejecutar.'
    );
  }

  await page.goto('/login');

  await page
    .getByLabel('Usuario', {
      exact: true
    })
    .fill(usuario);

  await page
    .getByRole('textbox', {
      name: 'Contraseña',
      exact: true
    })
    .fill(password);

  const respuestaLogin = page.waitForResponse(
    (response) =>
      response.url().includes('/api/login') &&
      response.request().method() === 'POST'
  );

  await page
    .getByRole('button', {
      name: 'Iniciar sesión'
    })
    .click();

  const respuesta = await respuestaLogin;

  expect(respuesta.status()).toBe(200);

  await expect(page).toHaveURL(
    /\/inicio$/
  );

  await expect(
    page.locator('#agrihusa-aside-menu')
  ).toBeVisible();

  await expect
    .poll(() =>
      page.evaluate(() =>
        Boolean(localStorage.getItem('token'))
      )
    )
    .toBe(true);
}