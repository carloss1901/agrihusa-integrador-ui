import {
  expect,
  Page
} from '@playwright/test';

function fechaIso(
  diasAdicionales: number
): string {
  const fecha = new Date();

  fecha.setDate(
    fecha.getDate() + diasAdicionales
  );

  return fecha.toISOString().slice(0, 10);
}

async function seleccionarPrimeraOpcion(
  page: Page,
  controlName: string
): Promise<void> {
  const selector = page
    .getByRole('dialog')
    .locator(
      `ng-select[formcontrolname="${controlName}"]`
    );

  await expect(selector).toBeVisible();
  await selector.click();

  const opcion = page.locator(
    '.ng-dropdown-panel:visible ' +
    '.ng-option:not(.ng-option-disabled)'
  ).first();

  await expect(opcion).toBeVisible({
    timeout: 10000
  });

  await opcion.click();
}

async function seleccionarOpcionPorTexto(
  page: Page,
  controlName: string,
  texto: string
): Promise<void> {
  const selector = page
    .getByRole('dialog')
    .locator(
      `ng-select[formcontrolname="${controlName}"]`
    );

  await expect(selector).toBeVisible();
  await selector.click();

  const opcion = page
    .locator(
      '.ng-dropdown-panel:visible ' +
      '.ng-option:not(.ng-option-disabled)'
    )
    .getByText(texto, {
      exact: true
    });

  await expect(opcion).toBeVisible({
    timeout: 10000
  });

  await opcion.click();
}

export async function abrirModuloDespachos(
  page: Page
): Promise<void> {
  const rutasCatalogos = [
    '/api/comun/clientes-activos',
    '/api/comun/destinos-activos',
    '/api/comun/productos-activos',
    '/api/comun/situaciones-activas',
    '/api/comun/navieras-activas',
    '/api/comun/operadores-logisticos-activos',
    '/api/comun/puertos-llegada-activos',
    '/api/comun/vias-activos',
    '/api/comun/variedades-activas'
  ];

  const respuestasCatalogos = rutasCatalogos.map(
    (ruta) =>
      page.waitForResponse((response) => {
        const url = new URL(
          response.url()
        );

        return (
          response.request().method() ===
            'GET' &&
          url.pathname === ruta
        );
      })
  );

  const menu = page.locator(
    '#agrihusa-aside-menu'
  );

  await menu
    .getByText('Registro de despacho', {
      exact: true
    })
    .click();

  const respuestas = await Promise.all(
    respuestasCatalogos
  );

  for (const respuesta of respuestas) {
    expect(respuesta.status()).toBe(200);
  }

  await expect(
    page.getByRole('button', {
      name: 'Registrar despacho',
      exact: true
    })
  ).toBeVisible();
}

export async function registrarDespachoUi(
  page: Page,
  numeroContenedor: string,
  observaciones = 'PRUEBA AUTOMATIZADA E2E'
): Promise<number> {
  await page
    .getByTitle('Registrar despacho')
    .locator('button')
    .click();

  const modal = page.getByRole('dialog');

  await expect(
    modal.getByText('REGISTRAR DESPACHO', {
      exact: true
    })
  ).toBeVisible();

  await modal
    .locator('#fechaDespacho')
    .fill(fechaIso(0));

  await modal
    .locator('#fechaEstimadaLlegada')
    .fill(fechaIso(7));

  await seleccionarPrimeraOpcion(
    page,
    'clienteId'
  );

  await seleccionarPrimeraOpcion(
    page,
    'operadorLogisticoId'
  );

  await seleccionarPrimeraOpcion(
    page,
    'viaId'
  );

  await seleccionarPrimeraOpcion(
    page,
    'navieraId'
  );

  await seleccionarPrimeraOpcion(
    page,
    'destinoId'
  );

  await seleccionarPrimeraOpcion(
    page,
    'puertoLlegadaId'
  );

  await seleccionarOpcionPorTexto(
    page,
    'productoId',
    'UVA'
  );

  const selectorVariedad = modal.locator(
    'ng-select[formcontrolname="variedadId"]'
  );

  await expect(
    selectorVariedad
  ).not.toHaveClass(
    /ng-select-readonly/,
    {
      timeout: 10000
    }
  );

  await seleccionarPrimeraOpcion(
    page,
    'variedadId'
  );

  await modal
    .locator('#cantidadDespacho')
    .fill('25');

  await seleccionarPrimeraOpcion(
    page,
    'unidadMedida'
  );

  const campoContenedor = modal.locator(
    '#contenedorDespacho'
  );

  await campoContenedor.fill(
    numeroContenedor
  );

  await expect(
    campoContenedor
  ).toHaveValue(numeroContenedor);

  await seleccionarPrimeraOpcion(
    page,
    'situacionId'
  );

  await modal
    .locator('#observacionesDespacho')
    .fill(observaciones);

  const respuestaPost =
    page.waitForResponse((response) => {
      const url = new URL(
        response.url()
      );

      return (
        response.request().method() ===
          'POST' &&
        url.pathname === '/api/despachos'
      );
    });

  await modal
    .locator('.modal-footer')
    .getByRole('button', {
      name: /Guardar/
    })
    .click();

  const respuesta = await respuestaPost;

  await expect(modal).toBeHidden();

  return respuesta.status();
}
