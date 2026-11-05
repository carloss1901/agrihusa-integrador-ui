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

interface DespachoApi {
  despachoId: number;
  codigo: string;
  numeroContenedor: string;
  cantidad: number;
  observaciones?: string;
  activo: boolean;
}

test.describe('Ciclo de despacho', () => {
  test(
    'edita, verifica y desactiva un despacho',
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

      const headers = {
        Authorization: `Bearer ${token}`
      };

      await abrirModuloDespachos(page);

      const numeroContenedor =
        `E2EC-${Date.now()
          .toString()
          .slice(-10)}`;

      const estadoRegistro =
        await registrarDespachoUi(
          page,
          numeroContenedor,
          'PRUEBA E2E PARA CICLO COMPLETO'
        );

      expect([200, 201]).toContain(
        estadoRegistro
      );

      const consultaInicial = await request.get(
        `${apiUrl}/api/despachos` +
          `?texto=${encodeURIComponent(
            numeroContenedor
          )}` +
          '&activo=true' +
          '&pagina=1&tamPagina=10',
        {
          headers
        }
      );

      expect(
        consultaInicial.status()
      ).toBe(200);

      const cuerpoInicial =
        await consultaInicial.json();

      const despacho: DespachoApi | undefined = (
        cuerpoInicial.datos ?? []
      ).find(
        (item: DespachoApi) =>
          item.numeroContenedor ===
          numeroContenedor
      );

      if (!despacho) {
        throw new Error(
          'No se encontró el despacho creado ' +
          'por la prueba de ciclo.'
        );
      }

      /*
       * Busca el despacho por contenedor.
       */
      const respuestaBusqueda =
        page.waitForResponse((response) => {
          const url = new URL(
            response.url()
          );

          return (
            response.request().method() ===
              'GET' &&
            url.pathname ===
              '/api/despachos' &&
            url.searchParams.get('texto') ===
              despacho.numeroContenedor
          );
        });

      await page
        .locator('#filtroDespachoTexto')
        .fill(despacho.numeroContenedor);

      await page
        .getByRole('button', {
          name: /Buscar/
        })
        .click();

      expect(
        (await respuestaBusqueda).status()
      ).toBe(200);

      const fila = page
        .locator('tbody tr')
        .filter({
          hasText: despacho.codigo
        });

      await expect(fila).toBeVisible();
      await fila.click();

      /*
       * Edita el despacho.
       */
      await page
        .getByTitle('Editar despacho')
        .locator('button')
        .click();

      const modal = page.getByRole('dialog');

      await expect(modal).toBeVisible();

      await expect(
        modal.getByText(
          `EDITAR DESPACHO ${despacho.codigo}`,
          {
            exact: true
          }
        )
      ).toBeVisible();

      const nuevaCantidad = 30;

      const nuevasObservaciones =
        'PRUEBA E2E ACTUALIZADA';

      await modal
        .locator('#cantidadDespacho')
        .fill(String(nuevaCantidad));

      await modal
        .locator('#observacionesDespacho')
        .fill(nuevasObservaciones);

      const respuestaPut =
        page.waitForResponse((response) => {
          const url = new URL(
            response.url()
          );

          return (
            response.request().method() ===
              'PUT' &&
            url.pathname ===
              '/api/despachos'
          );
        });

      await modal
        .locator('.modal-footer')
        .getByRole('button', {
          name: /Guardar/
        })
        .click();

      expect(
        (await respuestaPut).status()
      ).toBe(200);

      await expect(modal).toBeHidden();

      /*
       * Verifica la actualización directamente
       * mediante la API.
       */
      const consultaActualizada =
        await request.get(
          `${apiUrl}/api/despachos` +
            `?texto=${encodeURIComponent(
              despacho.numeroContenedor
            )}` +
            '&pagina=1&tamPagina=10',
          {
            headers
          }
        );

      expect(
        consultaActualizada.status()
      ).toBe(200);

      const cuerpoActualizado =
        await consultaActualizada.json();

      const despachoActualizado: DespachoApi |
        undefined = (
        cuerpoActualizado.datos ?? []
      ).find(
        (item: DespachoApi) =>
          item.despachoId ===
          despacho.despachoId
      );

      expect(
        despachoActualizado
      ).toBeTruthy();

      expect(
        Number(despachoActualizado?.cantidad)
      ).toBe(nuevaCantidad);

      expect(
        despachoActualizado?.observaciones
      ).toBe(nuevasObservaciones);

      /*
       * Actualiza nuevamente la tabla y selecciona
       * el despacho para desactivarlo.
       */
      const nuevaBusqueda =
        page.waitForResponse((response) => {
          const url = new URL(
            response.url()
          );

          return (
            response.request().method() ===
              'GET' &&
            url.pathname ===
              '/api/despachos' &&
            url.searchParams.get('texto') ===
              despacho.numeroContenedor
          );
        });

      await page
        .getByRole('button', {
          name: /Buscar/
        })
        .click();

      expect(
        (await nuevaBusqueda).status()
      ).toBe(200);

      const filaActualizada = page
        .locator('tbody tr')
        .filter({
          hasText: despacho.codigo
        });

      await expect(
        filaActualizada
      ).toBeVisible();

      await filaActualizada.click();

      /*
       * Acepta la confirmación del navegador.
       */
      page.once(
        'dialog',
        async (dialogo) => {
          expect(
            dialogo.type()
          ).toBe('confirm');

          await dialogo.accept();
        }
      );

      const respuestaDelete =
        page.waitForResponse((response) => {
          const url = new URL(
            response.url()
          );

          return (
            response.request().method() ===
              'DELETE' &&
            url.pathname ===
              '/api/despachos' &&
            url.searchParams.get(
              'despachoId'
            ) ===
              String(despacho.despachoId) &&
            url.searchParams.get('activo') ===
              'false'
          );
        });

      await page
        .getByTitle('Desactivar despacho')
        .locator('button')
        .click();

      expect(
        (await respuestaDelete).status()
      ).toBe(200);

      /*
       * Verifica que quedó inactivo.
       */
      const consultaInactiva =
        await request.get(
          `${apiUrl}/api/despachos` +
            `?texto=${encodeURIComponent(
              despacho.numeroContenedor
            )}` +
            '&activo=false' +
            '&pagina=1&tamPagina=10',
          {
            headers
          }
        );

      expect(
        consultaInactiva.status()
      ).toBe(200);

      const cuerpoInactivo =
        await consultaInactiva.json();

      const despachoInactivo: DespachoApi |
        undefined = (
        cuerpoInactivo.datos ?? []
      ).find(
        (item: DespachoApi) =>
          item.despachoId ===
          despacho.despachoId
      );

      expect(
        despachoInactivo
      ).toBeTruthy();

      expect(
        despachoInactivo?.activo
      ).toBe(false);
    }
  );
});
