import { execFileSync } from 'node:child_process';

/** Downscale a PNG if wider than maxW using macOS sips. No-op on other platforms. */
export function downscaleIfNeeded(filePath: string, maxW: number): void {
  if (maxW <= 0) return;
  try {
    const info = execFileSync('sips', ['-g', 'pixelWidth', filePath], {
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    const match = info.match(/pixelWidth:\s*(\d+)/);
    const currentWidth = match ? Number.parseInt(match[1] ?? '0', 10) : 0;
    if (currentWidth > maxW) {
      execFileSync('sips', ['--resampleWidth', String(maxW), filePath, '--out', filePath], {
        stdio: 'pipe',
      });
      console.log(`Downscaled ${filePath}: ${currentWidth}px -> ${maxW}px`);
    }
  } catch {
    // sips not available (non-macOS) - skip downscaling
  }
}
