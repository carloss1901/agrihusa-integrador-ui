import {
  test
} from '@playwright/test';

import {
  iniciarSesion
} from './helpers/autenticacion';

test.describe('Autenticación real', () => {
  test(
    'crea la sesión y muestra el sistema',
    async ({ page }) => {
      await iniciarSesion(page);
    }
  );
});