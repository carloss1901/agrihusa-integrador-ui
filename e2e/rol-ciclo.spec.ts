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

interface RolApi {
  rolId: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

interface PermisoApi {
  modulo?: string;
  acciones?: string[];
}

interface RolDetalleApi {
  nombre?: string;
  descripcion?: string;
  permisos?: PermisoApi[];
}

test.describe('Ciclo de rol y permisos', () => {
  test(
    'registra, evita duplicados, edita permisos y desactiva',
    async ({ page, request }) => {
      test.setTimeout(60000);

      await iniciarSesion(page);

      const token = await page.evaluate(() =>
        localStorage.getItem('token')
      );

      expect(token).toBeTruthy();

      const headers = {
        Authorization: `Bearer ${token}`
      };

      const sufijo = String(Date.now()).slice(-8);
      const nombre = `ROL E2E ${sufijo}`;
      const descripcion =
        'ROL GENERADO POR PRUEBA DE CALIDAD';

      await page.goto('/roles');

      await page
        .getByTitle('Registrar rol')
        .locator('button')
        .click();

      const modal = page.getByRole('dialog');
      await expect(modal).toBeVisible();

      await modal.locator('#nombreRol')
        .fill(nombre);
      await modal.locator('#descripcionRol')
        .fill(descripcion);

      await modal.getByRole('checkbox', {
        name: /Permiso consultar para Roles/i
      }).check();

      const registroResponse =
        page.waitForResponse((response) =>
          new URL(response.url()).pathname ===
            '/api/roles' &&
          response.request().method() === 'POST'
        );

      await modal.getByRole('button', {
        name: /Guardar/
      }).click();

      expect(
        (await registroResponse).status()
      ).toBe(201);

      const consultaCreado = await request.get(
        `${apiUrl}/api/roles` +
          `?nombre=${encodeURIComponent(nombre)}` +
          '&activo=true' +
          '&pagina=1&tamPagina=10',
        { headers }
      );

      expect(consultaCreado.status()).toBe(200);

      const cuerpoCreado =
        await consultaCreado.json();
      const rol: RolApi | undefined =
        (cuerpoCreado.datos ?? []).find(
          (item: RolApi) =>
            item.nombre === nombre
        );

      if (!rol) {
        throw new Error(
          'No se encontró el rol creado.'
        );
      }

      const detalleCreado = await request.get(
        `${apiUrl}/api/roles/${rol.rolId}`,
        { headers }
      );

      expect(detalleCreado.status()).toBe(200);

      const cuerpoDetalleCreado:
        RolDetalleApi = await detalleCreado.json();
      const permisoRolesCreado =
        cuerpoDetalleCreado.permisos?.find(
          (permiso) => permiso.modulo === 'roles'
        );

      expect(permisoRolesCreado?.acciones)
        .toContain('consultar');

      const duplicado = await request.post(
        `${apiUrl}/api/roles`,
        {
          headers,
          data: {
            rolId: 0,
            nombre,
            descripcion,
            permisos: [
              {
                modulo: 'roles',
                acciones: ['consultar']
              }
            ]
          }
        }
      );

      expect(duplicado.status()).toBe(409);

      await page.getByPlaceholder(
        'Ingrese el nombre del rol'
      ).fill(nombre);

      const busquedaResponse =
        page.waitForResponse((response) => {
          const url = new URL(response.url());

          return (
            url.pathname === '/api/roles' &&
            url.searchParams.get('nombre') === nombre &&
            response.request().method() === 'GET'
          );
        });

      await page.getByRole('button', {
        name: /Buscar/
      }).click();

      expect(
        (await busquedaResponse).status()
      ).toBe(200);

      let fila = page.locator('tbody tr').filter({
        hasText: nombre
      });
      await expect(fila).toHaveCount(1);
      await fila.click();

      const detalleEdicionResponse =
        page.waitForResponse((response) =>
          new URL(response.url()).pathname ===
            `/api/roles/${rol.rolId}` &&
          response.request().method() === 'GET'
        );

      await page
        .getByTitle('Editar rol')
        .locator('button')
        .click();

      expect(
        (await detalleEdicionResponse).status()
      ).toBe(200);

      const modalEdicion = page.getByRole('dialog');
      await expect(modalEdicion).toBeVisible();

      await modalEdicion.locator('#descripcionRol')
        .fill(`${descripcion} ACTUALIZADO`);
      await modalEdicion.getByRole('checkbox', {
        name: /Permiso crear para Roles/i
      }).check();

      const actualizacionResponse =
        page.waitForResponse((response) =>
          new URL(response.url()).pathname ===
            '/api/roles' &&
          response.request().method() === 'PUT'
        );

      await modalEdicion.getByRole('button', {
        name: /Guardar/
      }).click();

      expect(
        (await actualizacionResponse).status()
      ).toBe(200);

      const detalleActualizado = await request.get(
        `${apiUrl}/api/roles/${rol.rolId}`,
        { headers }
      );

      expect(detalleActualizado.status()).toBe(200);

      const cuerpoActualizado:
        RolDetalleApi = await detalleActualizado.json();
      const permisoRolesActualizado =
        cuerpoActualizado.permisos?.find(
          (permiso) => permiso.modulo === 'roles'
        );

      expect(cuerpoActualizado.descripcion)
        .toBe(`${descripcion} ACTUALIZADO`);
      expect(permisoRolesActualizado?.acciones)
        .toEqual(
          expect.arrayContaining([
            'consultar',
            'crear'
          ])
        );

      fila = page.locator('tbody tr').filter({
        hasText: nombre
      });
      await expect(fila).toHaveCount(1);
      await fila.click();

      page.once('dialog', (dialog) =>
        dialog.accept()
      );

      const desactivacionResponse =
        page.waitForResponse((response) => {
          const url = new URL(response.url());

          return (
            url.pathname === '/api/roles' &&
            url.searchParams.get('rolId') ===
              String(rol.rolId) &&
            url.searchParams.get('activo') ===
              'false' &&
            response.request().method() === 'DELETE'
          );
        });

      await page
        .getByTitle('Desactivar rol')
        .locator('button')
        .click();

      expect(
        (await desactivacionResponse).status()
      ).toBe(200);

      const consultaInactivo = await request.get(
        `${apiUrl}/api/roles` +
          `?nombre=${encodeURIComponent(nombre)}` +
          '&activo=false' +
          '&pagina=1&tamPagina=10',
        { headers }
      );

      expect(consultaInactivo.status()).toBe(200);

      const cuerpoInactivo =
        await consultaInactivo.json();
      const inactivo: RolApi | undefined =
        (cuerpoInactivo.datos ?? []).find(
          (item: RolApi) =>
            item.rolId === rol.rolId
        );

      expect(inactivo?.activo).toBe(false);
    }
  );
});
