import { spawn } from 'node:child_process';
import type { CommandResult } from '../../types';

export const runCommand = (command: string, args: string[]): Promise<CommandResult> =>
  new Promise(resolveCommand => {
    let stdout = '';
    let stderr = '';
    let settled = false;
    const child = spawn(command, args, { stdio: ['ignore', 'pipe', 'pipe'] });

    child.stdout?.on('data', chunk => {
      stdout += String(chunk);
    });
    child.stderr?.on('data', chunk => {
      stderr += String(chunk);
    });
    child.on('error', error => {
      settled = true;
      resolveCommand({ code: 1, stdout, stderr: error.message });
    });
    child.on('close', code => {
      if (settled) {
        return;
      }

      resolveCommand({ code: code ?? 1, stdout, stderr });
    });
  });
