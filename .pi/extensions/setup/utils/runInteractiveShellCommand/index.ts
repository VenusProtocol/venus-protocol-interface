import { runInteractiveCommand } from '../runInteractiveCommand';

export const runInteractiveShellCommand = (command: string) =>
  runInteractiveCommand('sh', ['-lc', command]);
