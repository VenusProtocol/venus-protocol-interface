import path from 'node:path';
import { type Page, chromium } from '@playwright/test';

// Shared utility - see .claude/scripts/utils/image.ts
import { downscaleIfNeeded } from './utils/image.js';

/**
 * Run interactive Playwright tests and capture screenshots at each step.
 *
 * Usage:
 *   yarn tsx .claude/scripts/ui-interaction-test.ts \
 *     --url /help-center \
 *     --output .ui-develop \
 *     --steps '[{"action":"click","selector":"[role=tab]:nth-child(2)","name":"tab2-click"},{"action":"screenshot","name":"tab2-active"}]' \
 *     [--width=1440] [--height=900] [--max-width=1400]
 *
 * Step types:
 *   screenshot     - save interact-{name}.png
 *   click          - click selector, save NOTFOUND screenshot if missing
 *   hover          - hover selector, save NOTFOUND screenshot if missing
 *   viewport       - resize viewport and take screenshot
 *   scroll-to      - scroll element into view, save NOTFOUND screenshot if missing
 *   wait           - wait ms, no screenshot
 *   fill           - type value into input, save NOTFOUND screenshot if missing
 *   select-option  - click to open XDS Select, click matching option
 *   assert-text    - check textContent contains expected string -> PASS/-FAIL
 *   assert-visible - check element exists and is visible -> PASS/-FAIL
 *   assert-value   - check inputValue contains expected string -> PASS/-FAIL
 *   check-console  - report captured console errors/pageerrors -> PASS/-FAIL
 *   wait-for       - wait for element to be visible with timeout -> -TIMEOUT
 *
 * Prerequisites:
 *   - Dev server running on localhost:5173 (yarn dev)
 *   - Playwright installed (already in devDependencies)
 */

const DEV_SERVER_URL = process.env['DEV_SERVER_URL'] ?? 'http://localhost:5173';

type InteractionStep =
  | { action: 'screenshot'; name: string }
  | { action: 'click'; selector: string; name: string }
  | { action: 'hover'; selector: string; name: string }
  | { action: 'viewport'; width: number; height: number; name: string }
  | { action: 'scroll-to'; selector: string; name: string }
  | { action: 'wait'; ms: number; name: string }
  | { action: 'fill'; selector: string; value: string; name: string }
  | { action: 'select-option'; selector: string; value: string; name: string }
  | { action: 'assert-text'; selector: string; expected: string; name: string }
  | { action: 'assert-visible'; selector: string; name: string }
  | { action: 'assert-value'; selector: string; expected: string; name: string }
  | { action: 'check-console'; name: string }
  | { action: 'wait-for'; selector: string; timeout?: number; name: string };

function parseArgs(args: string[]) {
  let url = '';
  let output = '';
  let stepsJson = '';
  let width = 1440;
  let height = 900;
  let maxWidth = 1400;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--url') {
      url = args[++i] ?? '';
    } else if (arg === '--output') {
      output = args[++i] ?? '';
    } else if (arg === '--steps') {
      stepsJson = args[++i] ?? '';
    } else if (arg.startsWith('--width=')) {
      width = Number.parseInt(arg.split('=')[1] ?? '1440', 10);
    } else if (arg.startsWith('--height=')) {
      height = Number.parseInt(arg.split('=')[1] ?? '900', 10);
    } else if (arg.startsWith('--max-width=')) {
      maxWidth = Number.parseInt(arg.split('=')[1] ?? '1400', 10);
    }
  }

  if (!url || !output || !stepsJson) {
    console.error(
      'Usage: yarn tsx .claude/scripts/ui-interaction-test.ts --url <path> --output <dir> --steps <json> [--width=1440] [--height=900] [--max-width=1400]',
    );
    process.exit(1);
  }

  const steps: InteractionStep[] = JSON.parse(stepsJson);
  return { url, output, steps, width, height, maxWidth };
}

/** Wait for page to stabilize after an action (replaces fixed delays). */
async function waitForStable(page: Page): Promise<void> {
  await Promise.race([
    page.waitForLoadState('networkidle').catch(() => {}),
    page.waitForTimeout(1500),
  ]);
  await page.waitForTimeout(100);
}

async function main() {
  const { url, output, steps, width, height, maxWidth } = parseArgs(process.argv.slice(2));

  const targetUrl = `${DEV_SERVER_URL}${url.startsWith('/') ? url : `/${url}`}`;

  // Check dev server
  try {
    await fetch(DEV_SERVER_URL, { signal: AbortSignal.timeout(3000) });
  } catch {
    console.error(`Dev server not responding at ${DEV_SERVER_URL}`);
    console.error('Start it with: yarn dev');
    process.exit(1);
  }

  console.log(`Interaction test: ${targetUrl} (${width}x${height})`);
  console.log(`Steps: ${steps.length}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width, height },
    colorScheme: 'dark',
  });
  const page = await context.newPage();

  // Console error capture - collected across all steps, checked by check-console action
  const consoleErrors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', err => {
    consoleErrors.push(`[uncaught] ${err.message}`);
  });

  // MSW warm-up: navigate to root first so the service worker registers
  await page.goto(DEV_SERVER_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Navigate to target page
  await page.goto(targetUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Clear startup console errors - only capture errors from test actions
  consoleErrors.length = 0;

  /** Take a screenshot and auto-downscale if wider than --max-width. */
  const takeScreenshot = async (filePath: string) => {
    await page.screenshot({ path: filePath });
    downscaleIfNeeded(filePath, maxWidth);
  };

  for (const step of steps) {
    const screenshotPath = (suffix: string) =>
      path.join(output, `interact-${step.name}${suffix}.png`);

    switch (step.action) {
      case 'screenshot': {
        await takeScreenshot(screenshotPath(''));
        console.log(`  screenshot: ${screenshotPath('')}`);
        break;
      }

      case 'click': {
        const locator = page.locator(step.selector).first();
        if ((await locator.count()) === 0) {
          await takeScreenshot(screenshotPath('-NOTFOUND'));
          console.log(
            `  click: selector not found "${step.selector}" -> ${screenshotPath('-NOTFOUND')}`,
          );
        } else {
          await locator.click();
          await waitForStable(page);
          await takeScreenshot(screenshotPath(''));
          console.log(`  click: ${step.selector} -> ${screenshotPath('')}`);
        }
        break;
      }

      case 'hover': {
        const locator = page.locator(step.selector).first();
        if ((await locator.count()) === 0) {
          await takeScreenshot(screenshotPath('-NOTFOUND'));
          console.log(
            `  hover: selector not found "${step.selector}" -> ${screenshotPath('-NOTFOUND')}`,
          );
        } else {
          await locator.hover();
          await waitForStable(page);
          await takeScreenshot(screenshotPath(''));
          console.log(`  hover: ${step.selector} -> ${screenshotPath('')}`);
        }
        break;
      }

      case 'viewport': {
        await page.setViewportSize({
          width: step.width,
          height: step.height,
        });
        await waitForStable(page);
        await takeScreenshot(screenshotPath(''));
        console.log(`  viewport: ${step.width}x${step.height} -> ${screenshotPath('')}`);
        break;
      }

      case 'scroll-to': {
        const locator = page.locator(step.selector).first();
        if ((await locator.count()) === 0) {
          await takeScreenshot(screenshotPath('-NOTFOUND'));
          console.log(
            `  scroll-to: selector not found "${step.selector}" -> ${screenshotPath('-NOTFOUND')}`,
          );
        } else {
          await locator.scrollIntoViewIfNeeded();
          await waitForStable(page);
          await takeScreenshot(screenshotPath(''));
          console.log(`  scroll-to: ${step.selector} -> ${screenshotPath('')}`);
        }
        break;
      }

      case 'wait': {
        await page.waitForTimeout(step.ms);
        console.log(`  wait: ${step.ms}ms`);
        break;
      }

      case 'fill': {
        const locator = page.locator(step.selector).first();
        if ((await locator.count()) === 0) {
          await takeScreenshot(screenshotPath('-NOTFOUND'));
          console.log(
            `  fill: selector not found "${step.selector}" -> ${screenshotPath('-NOTFOUND')}`,
          );
        } else {
          await locator.fill(step.value);
          await waitForStable(page);
          await takeScreenshot(screenshotPath(''));
          console.log(`  fill: "${step.value}" into ${step.selector} -> ${screenshotPath('')}`);
        }
        break;
      }

      case 'select-option': {
        const trigger = page.locator(step.selector).first();
        if ((await trigger.count()) === 0) {
          await takeScreenshot(screenshotPath('-NOTFOUND'));
          console.log(
            `  select-option: trigger not found "${step.selector}" -> ${screenshotPath(
              '-NOTFOUND',
            )}`,
          );
        } else {
          await trigger.click();
          await waitForStable(page);
          const option = page.locator('[role="option"]').filter({ hasText: step.value }).first();

          if ((await option.count()) === 0) {
            await takeScreenshot(screenshotPath('-NOTFOUND'));
            console.log(
              `  select-option: option "${step.value}" not found -> ${screenshotPath('-NOTFOUND')}`,
            );
          } else {
            await option.click();
            await waitForStable(page);
            await takeScreenshot(screenshotPath(''));
            console.log(
              `  select-option: "${step.value}" in ${step.selector} -> ${screenshotPath('')}`,
            );
          }
        }
        break;
      }

      case 'assert-text': {
        const locator = page.locator(step.selector).first();
        if ((await locator.count()) === 0) {
          await takeScreenshot(screenshotPath('-FAIL'));
          console.log(`  assert-text: FAIL - selector not found "${step.selector}"`);
          process.exitCode = 1;
        } else {
          const text = (await locator.textContent()) ?? '';
          if (text.includes(step.expected)) {
            await takeScreenshot(screenshotPath('-PASS'));
            console.log(`  assert-text: PASS - "${step.expected}" found in ${step.selector}`);
          } else {
            await takeScreenshot(screenshotPath('-FAIL'));
            console.log(
              `  assert-text: FAIL - expected "${step.expected}" in ${
                step.selector
              }, got "${text.slice(0, 100)}"`,
            );
            process.exitCode = 1;
          }
        }
        break;
      }

      case 'assert-visible': {
        const locator = page.locator(step.selector).first();
        if ((await locator.count()) === 0) {
          await takeScreenshot(screenshotPath('-FAIL'));
          console.log(`  assert-visible: FAIL - selector not found "${step.selector}"`);
          process.exitCode = 1;
        } else {
          const visible = await locator.isVisible();
          if (visible) {
            await takeScreenshot(screenshotPath('-PASS'));
            console.log(`  assert-visible: PASS - ${step.selector} is visible`);
          } else {
            await takeScreenshot(screenshotPath('-FAIL'));
            console.log(`  assert-visible: FAIL - ${step.selector} exists but not visible`);
            process.exitCode = 1;
          }
        }
        break;
      }

      case 'assert-value': {
        const locator = page.locator(step.selector).first();
        if ((await locator.count()) === 0) {
          await takeScreenshot(screenshotPath('-FAIL'));
          console.log(`  assert-value: FAIL - selector not found "${step.selector}"`);
          process.exitCode = 1;
        } else {
          const value = await locator.inputValue();
          if (value.includes(step.expected)) {
            await takeScreenshot(screenshotPath('-PASS'));
            console.log(
              `  assert-value: PASS - "${step.expected}" found in ${step.selector} value`,
            );
          } else {
            await takeScreenshot(screenshotPath('-FAIL'));
            console.log(
              `  assert-value: FAIL - expected "${step.expected}" in ${step.selector} value, got "${value}"`,
            );
            process.exitCode = 1;
          }
        }
        break;
      }

      case 'check-console': {
        if (consoleErrors.length === 0) {
          await takeScreenshot(screenshotPath('-PASS'));
          console.log('  check-console: PASS - no console errors');
        } else {
          await takeScreenshot(screenshotPath('-FAIL'));
          console.log(`  check-console: FAIL - ${consoleErrors.length} error(s):`);
          for (const err of consoleErrors) {
            console.log(`    ${err.slice(0, 200)}`);
          }
          process.exitCode = 1;
        }
        break;
      }

      case 'wait-for': {
        const timeout = step.timeout ?? 5000;
        try {
          await page.locator(step.selector).first().waitFor({
            state: 'visible',
            timeout,
          });
          await takeScreenshot(screenshotPath('-PASS'));
          console.log(`  wait-for: PASS - ${step.selector} visible within ${timeout}ms`);
        } catch {
          await takeScreenshot(screenshotPath('-TIMEOUT'));
          console.log(`  wait-for: TIMEOUT - ${step.selector} not visible after ${timeout}ms`);
          process.exitCode = 1;
        }
        break;
      }
    }
  }

  await browser.close();
  console.log(`Interaction test complete.${process.exitCode ? ' (FAILURES DETECTED)' : ''}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
