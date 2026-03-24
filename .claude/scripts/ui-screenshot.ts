/**
 * Take a screenshot of a local dev route for visual comparison with Figma.
 *
 * Usage:
 *   yarn tsx .claude/scripts/ui-screenshot.ts <route-path> <output-path> [--width=1440] [--height=900] [--full-page] [--max-width=1400]
 *
 * Examples:
 *   yarn tsx .claude/scripts/ui-screenshot.ts /convert .ui-develop/screenshot.png
 *   yarn tsx .claude/scripts/ui-screenshot.ts /convert .ui-develop/screenshot.png --width=375 --height=812
 *   yarn tsx .claude/scripts/ui-screenshot.ts /help-center .ui-develop/screenshot.png --full-page
 *   yarn tsx .claude/scripts/ui-screenshot.ts /help-center .ui-develop/screenshot.png --full-page --max-width=1400
 *
 * Options:
 *   --max-width=W  Downscale the screenshot if its width exceeds N pixels (default: 1400).
 *                  Keeps the image under Claude's 2000px processing limit.
 *                  Set to 0 to disable downscaling.
 *
 * Prerequisites:
 *   - Dev server running on localhost:5173 (yarn dev)
 *   - Playwright installed (already in devDependencies)
 */

import { chromium } from '@playwright/test';

// Shared utility - see .claude/scripts/utils/image.ts
import { downscaleIfNeeded } from './utils/image.js';

const DEV_SERVER_URL = process.env['DEV_SERVER_URL'] ?? 'http://localhost:5173';

function parseArgs(args: string[]) {
  const routePath = args[0];
  const outputPath = args[1];

  if (!routePath || !outputPath) {
    console.error(
      'Usage: yarn tsx .claude/scripts/ui-screenshot.ts <route-path> <output-path> [--width=1440] [--height=900] [--full-page] [--max-width=1400]',
    );
    process.exit(1);
  }

  let width = 1440;
  let height = 900;
  let fullPage = false;
  let maxWidth = 1400;

  for (const arg of args.slice(2)) {
    if (arg.startsWith('--width=')) {
      width = Number.parseInt(arg.split('=')[1] ?? '1440', 10);
    } else if (arg.startsWith('--height=')) {
      height = Number.parseInt(arg.split('=')[1] ?? '900', 10);
    } else if (arg.startsWith('--max-width=')) {
      maxWidth = Number.parseInt(arg.split('=')[1] ?? '1400', 10);
    } else if (arg === '--full-page') {
      fullPage = true;
    }
  }

  return { routePath, outputPath, width, height, fullPage, maxWidth };
}

async function main() {
  const { routePath, outputPath, width, height, fullPage, maxWidth } = parseArgs(
    process.argv.slice(2),
  );

  const url = `${DEV_SERVER_URL}${routePath.startsWith('/') ? routePath : `/${routePath}`}`;

  // Check if dev server is running
  try {
    await fetch(DEV_SERVER_URL, { signal: AbortSignal.timeout(3000) });
  } catch {
    console.error(`Dev server not responding at ${DEV_SERVER_URL}`);
    console.error('Start it with: yarn dev');
    process.exit(1);
  }

  console.log(`Navigating to ${url} (${width}x${height})...`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width, height },
    // Dark mode to match typical exchange UI
    colorScheme: 'dark',
  });
  const page = await context.newPage();

  // Pre-navigate to the root to allow MSW service worker to register and activate.
  // MSW's SW only intercepts after it has activated, which requires at least one
  // prior navigation in the same browser context.
  await page.goto(DEV_SERVER_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Now navigate to the actual target page with MSW active
  await page.goto(url, { waitUntil: 'networkidle' });

  // Extra wait for animations/transitions and MSW-served data to render
  await page.waitForTimeout(2000);

  await page.screenshot({ path: outputPath, fullPage });
  downscaleIfNeeded(outputPath, maxWidth);
  console.log(`Screenshot saved: ${outputPath}`);

  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
