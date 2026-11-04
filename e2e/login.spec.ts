import {
  expect,
  test
} from '@playwright/test';

test.describe('Inicio de sesión', () => {
  test('muestra el formulario de acceso', async ({
    page
  }) => {
    await page.goto('/login');

    await expect(
      page.getByRole('heading', {
        name: 'Inicia sesión'
      })
    ).toBeVisible();

    await expect(
      page.getByLabel('Usuario')
    ).toBeVisible();

    await expect(
        page.getByRole('textbox', {
            name: 'Contraseña',
            exact: true
        })
        ).toBeVisible();

    await expect(
      page.getByRole('button', {
        name: 'Iniciar sesión'
      })
    ).toBeVisible();
  });

  test('valida los campos obligatorios', async ({
    page
  }) => {
    await page.goto('/login');

    await page
      .getByRole('button', {
        name: 'Iniciar sesión'
      })
      .click();

    await expect(
      page.getByText(
        'El usuario es obligatorio.'
      )
    ).toBeVisible();

    await expect(
      page.getByText(
        'La contraseña es obligatoria.'
      )
    ).toBeVisible();
  });
});