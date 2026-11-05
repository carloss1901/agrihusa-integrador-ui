import AxeBuilder from '@axe-core/playwright';
import {
  expect,
  Page,
  test
} from '@playwright/test';

import {
  iniciarSesion
} from './helpers/autenticacion';

interface MedicionTarea {
  tarea: string;
  clics: number;
  duracionMs: number;
  completada: boolean;
}

async function abrirDesdeMenu(
  page: Page,
  opcion: string,
  ruta: RegExp,
  titulo: string
): Promise<MedicionTarea> {
  const inicio = Date.now();

  await page.locator('#agrihusa-aside-menu')
    .getByText(opcion, {
      exact: true
    })
    .click();

  await expect(page).toHaveURL(ruta);
  await expect(
    page.getByText(titulo, {
      exact: true
    }).first()
  ).toBeVisible();

  return {
    tarea: opcion,
    clics: 1,
    duracionMs: Date.now() - inicio,
    completada: true
  };
}

test.describe('Capacidad de interacción', () => {
  test(
    'permite acceder a las tareas críticas en máximo tres clics',
    async ({ page }, testInfo) => {
      await iniciarSesion(page);

      const mediciones: MedicionTarea[] = [];

      mediciones.push(
        await abrirDesdeMenu(
          page,
          'Registro de despacho',
          /\/registro-despacho$/,
          'Registro de Despacho'
        )
      );

      mediciones.push(
        await abrirDesdeMenu(
          page,
          'Reporte de despacho',
          /\/reporte-despacho$/,
          'Reporte de Despacho'
        )
      );

      mediciones.push(
        await abrirDesdeMenu(
          page,
          'Perfil de usuario',
          /\/perfil-usuario$/,
          'Perfil de Usuario'
        )
      );

      expect(
        mediciones.every(
          (medicion) =>
            medicion.completada &&
            medicion.clics <= 3
        )
      ).toBe(true);

      await testInfo.attach(
        'mediciones-navegacion',
        {
          body: JSON.stringify(
            mediciones,
            null,
            2
          ),
          contentType: 'application/json'
        }
      );
    }
  );

  test(
    'protege ante errores y comunica cómo corregirlos',
    async ({ page }) => {
      await iniciarSesion(page);

      await page.locator('#agrihusa-aside-menu')
        .getByText('Registro de despacho', {
          exact: true
        })
        .click();

      await page
        .getByTitle('Registrar despacho')
        .locator('button')
        .click();

      const dialogo = page.getByRole('dialog');
      await expect(dialogo).toBeVisible();

      let solicitudesPost = 0;
      page.on('request', (request) => {
        if (
          request.method() === 'POST' &&
          new URL(request.url()).pathname ===
            '/api/despachos'
        ) {
          solicitudesPost++;
        }
      });

      await dialogo.getByRole('button', {
        name: /Guardar/
      }).click();

      const mensajes = [
        'Selecciona la fecha de despacho.',
        'Selecciona la fecha estimada.',
        'Selecciona un cliente.',
        'Selecciona un operador logístico.',
        'Selecciona una vía.',
        'Selecciona una naviera.',
        'Selecciona un destino.',
        'Selecciona un puerto de llegada.',
        'Selecciona un producto.',
        'Selecciona una variedad del producto.',
        'Ingresa una cantidad mayor que cero.',
        'Selecciona una unidad de medida.',
        'Selecciona la situación del despacho.',
        'Ingresa entre 4 y 20 letras, números o guiones.'
      ];

      for (const mensaje of mensajes) {
        await expect(
          dialogo.getByText(mensaje, {
            exact: true
          })
        ).toBeVisible();
      }

      expect(solicitudesPost).toBe(0);

      await dialogo.getByRole('button', {
        name: /Cancelar/
      }).click();
    }
  );

  test(
    'pantalla de despacho sin problemas críticos o serios de accesibilidad',
    async ({ page }, testInfo) => {
      await iniciarSesion(page);
      await page.goto('/registro-despacho');

      await expect(
        page.getByText('Registro de Despacho', {
          exact: true
        }).first()
      ).toBeVisible();

      const resultado = await new AxeBuilder({
        page
      })
        .withTags([
          'wcag2a',
          'wcag2aa',
          'wcag21a',
          'wcag21aa'
        ])
        .analyze();

      await testInfo.attach(
        'resultado-axe-registro-despacho',
        {
          body: JSON.stringify(
            resultado,
            null,
            2
          ),
          contentType: 'application/json'
        }
      );

      const problemasGraves =
        resultado.violations.filter(
          (problema) =>
            problema.impact === 'critical' ||
            problema.impact === 'serious'
        );

      expect(
        problemasGraves,
        JSON.stringify(
          problemasGraves,
          null,
          2
        )
      ).toEqual([]);
    }
  );
});
