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

interface BitacoraApi {
  bitacoraId: number;
  nombreUsuario?: string;
  modulo?: string;
  accion?: string;
  entidad?: string;
  detalle?: string;
  resultado?: string;
}

test.describe('Reporte y bitácora', () => {
  test(
    'filtra, exporta y registra la trazabilidad',
    async ({ page, request }) => {
      test.setTimeout(90000);

      await iniciarSesion(page);

      const usuario = process.env['E2E_USER'];
      const token = await page.evaluate(() =>
        localStorage.getItem('token')
      );

      expect(usuario).toBeTruthy();
      expect(token).toBeTruthy();

      const cargaReporte =
        page.waitForResponse((response) =>
          new URL(response.url()).pathname ===
            '/api/despachos/reporte' &&
          response.request().method() === 'GET'
        );

      await page.goto('/reporte-despacho');

      expect((await cargaReporte).status()).toBe(200);

      await expect(
        page.locator('app-tabla-reporte-despacho tbody tr')
          .first()
      ).toBeVisible();

      await page.locator(
        'ng-select[formcontrolname="estado"]'
      ).click();

      await page.locator(
        '.ng-dropdown-panel:visible .ng-option'
      ).filter({
        hasText: /^ACTIVO$/
      }).click();

      const reporteFiltrado =
        page.waitForResponse((response) => {
          const url = new URL(response.url());

          return (
            url.pathname === '/api/despachos/reporte' &&
            url.searchParams.get('activo') === 'true' &&
            response.request().method() === 'GET'
          );
        });

      await page.getByRole('button', {
        name: /Generar reporte/
      }).click();

      expect(
        (await reporteFiltrado).status()
      ).toBe(200);

      const filasReporte = page.locator(
        'app-tabla-reporte-despacho tbody tr'
      );
      await expect(filasReporte.first()).toBeVisible();

      const estados = await filasReporte
        .locator('td:last-child')
        .allTextContents();

      expect(
        estados.every((estado) =>
          estado.trim() === 'ACTIVO'
        )
      ).toBe(true);

      const descargaExcel =
        page.waitForEvent('download');
      const registroExportacion =
        page.waitForResponse((response) =>
          new URL(response.url()).pathname ===
            '/api/bitacoras' &&
          response.request().method() === 'POST'
        );

      await page.getByRole('button', {
        name: /Exportar Excel/
      }).click();

      const excel = await descargaExcel;
      expect(excel.suggestedFilename())
        .toMatch(/^reporte-despachos-.*\.xlsx$/);
      expect(await excel.path()).toBeTruthy();
      expect(
        (await registroExportacion).status()
      ).toBe(201);

      const consultaBitacora = await request.get(
        `${apiUrl}/api/bitacoras` +
          `?usuario=${encodeURIComponent(usuario!)}` +
          '&modulo=reporte-despacho' +
          '&accion=exportar' +
          '&pagina=1&tamPagina=20',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      expect(consultaBitacora.status()).toBe(200);

      const cuerpoBitacora =
        await consultaBitacora.json();
      const evento: BitacoraApi | undefined =
        (cuerpoBitacora.datos ?? []).find(
          (item: BitacoraApi) =>
            item.nombreUsuario === usuario &&
            item.modulo === 'reporte-despacho' &&
            item.accion === 'exportar' &&
            item.resultado === 'exito'
        );

      if (!evento) {
        throw new Error(
          'No se encontró la exportación en la bitácora.'
        );
      }

      const cargaBitacora =
        page.waitForResponse((response) =>
          new URL(response.url()).pathname ===
            '/api/bitacoras' &&
          response.request().method() === 'GET'
        );

      await page.goto('/auditoria');

      expect((await cargaBitacora).status()).toBe(200);

      await page.locator('#bitacoraUsuario')
        .fill(usuario!);

      const bitacoraFiltrada =
        page.waitForResponse((response) => {
          const url = new URL(response.url());

          return (
            url.pathname === '/api/bitacoras' &&
            url.searchParams.get('usuario') === usuario &&
            response.request().method() === 'GET'
          );
        });

      await page.getByRole('button', {
        name: /Buscar/
      }).click();

      expect(
        (await bitacoraFiltrada).status()
      ).toBe(200);

      const filaEvento = page.locator(
        'app-tabla-auditoria tbody tr'
      ).filter({
        hasText: usuario!
      }).filter({
        hasText: /EXPORTAR/i
      });

      await expect(filaEvento.first()).toBeVisible();

      const descargaCsv =
        page.waitForEvent('download');

      await page
        .getByTitle('Exportar resultados a CSV')
        .locator('button')
        .click();

      const csv = await descargaCsv;
      expect(csv.suggestedFilename())
        .toMatch(/^bitacora-.*\.csv$/);
      expect(await csv.path()).toBeTruthy();
    }
  );
});
