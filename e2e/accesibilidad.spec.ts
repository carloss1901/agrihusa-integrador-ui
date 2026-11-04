import AxeBuilder from '@axe-core/playwright';
import {
  expect,
  test
} from '@playwright/test';

test.describe('Accesibilidad', () => {
  test(
    'login sin problemas críticos o serios',
    async ({ page }, testInfo) => {
      await page.goto('/login');

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
        'resultado-axe-login',
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