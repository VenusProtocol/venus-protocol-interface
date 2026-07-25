import { spawn } from 'node:child_process';

export const runInteractiveCommand = (command: string, args: string[]): Promise<void> =>
  new Promise((resolveCommand, rejectCommand) => {
    const child = spawn(command, args, { stdio: 'inherit' });

    child.on('error', error => {
      rejectCommand(new Error(`${command} failed to start: ${error.message}`));
    });
    child.on('close', code => {
      const exitCode = code ?? 1;
      if (exitCode === 0) {
        resolveCommand();
        return;
      }

      rejectCommand(new Error(`${command} exited with code ${exitCode}`));
    });
  });
