import { execSync } from 'node:child_process';

/** Downscale a PNG if wider than maxW using macOS sips. No-op on other platforms. */
export function downscaleIfNeeded(filePath: string, maxW: number): void {
  if (maxW <= 0) return;
  try {
    const info = execSync(`sips -g pixelWidth "${filePath}" 2>/dev/null`, {
      encoding: 'utf-8',
    });
    const match = info.match(/pixelWidth:\s*(\d+)/);
    const currentWidth = match ? Number.parseInt(match[1] ?? '0', 10) : 0;
    if (currentWidth > maxW) {
      execSync(`sips --resampleWidth ${maxW} "${filePath}" --out "${filePath}"`, {
        stdio: 'pipe',
      });
      console.log(`Downscaled ${filePath}: ${currentWidth}px -> ${maxW}px`);
    }
  } catch {
    // sips not available (non-macOS) - skip downscaling
  }
}
