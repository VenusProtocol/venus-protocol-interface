import { spawn } from 'node:child_process';

export const openBrowser = (url: string) => {
  let command = 'xdg-open';
  let args = [url];

  if (process.platform === 'darwin') {
    command = 'open';
  }

  if (process.platform === 'win32') {
    command = 'cmd';
    args = ['/c', 'start', '', url];
  }

  const child = spawn(command, args, { detached: true, stdio: 'ignore' });
  child.unref();
};
