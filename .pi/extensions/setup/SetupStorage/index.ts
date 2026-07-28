import { chmod, mkdir, readFile, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, resolve } from 'node:path';
import {
  BLOCKED_PATH_HINT,
  CREDENTIALS_FILE_NAME,
  SETUP_DIR_NAME,
  SETUP_VERSION,
  STATE_FILE_NAME,
  STORAGE_DIR_PATH_HINT,
} from '../constants';
import type { SetupState, StoredCredentials } from '../types';

export class SetupStorage {
  readonly statePath: string;
  readonly credentialsPath: string;
  readonly storageDir: string;

  constructor() {
    this.storageDir = resolve(
      process.env.PI_CODING_AGENT_DIR || resolve(homedir(), '.pi', 'agent'),
      SETUP_DIR_NAME,
    );
    this.statePath = resolve(this.storageDir, STATE_FILE_NAME);
    this.credentialsPath = resolve(this.storageDir, CREDENTIALS_FILE_NAME);
  }

  async readState(): Promise<SetupState> {
    try {
      const content = await readFile(this.statePath, 'utf8');
      const parsed = JSON.parse(content) as Partial<SetupState>;
      return {
        version: parsed.version || SETUP_VERSION,
        promptDismissed: parsed.promptDismissed === true,
        providers: parsed.providers || {},
      };
    } catch {
      return { version: SETUP_VERSION, promptDismissed: false, providers: {} };
    }
  }

  async writeState(state: SetupState) {
    await this.ensureStorageDir();
    await writeFile(this.statePath, `${JSON.stringify(state, undefined, 2)}\n`, { mode: 0o600 });
    await chmod(this.statePath, 0o600);
  }

  async readCredentials(): Promise<StoredCredentials> {
    try {
      const content = await readFile(this.credentialsPath, 'utf8');
      const parsed = JSON.parse(content) as Partial<StoredCredentials>;
      return {
        github: parsed.github,
        jira: parsed.jira,
      };
    } catch {
      return {};
    }
  }

  async writeCredentials(credentials: StoredCredentials) {
    await this.ensureStorageDir();
    await writeFile(this.credentialsPath, `${JSON.stringify(credentials, undefined, 2)}\n`, {
      mode: 0o600,
    });
    await chmod(this.credentialsPath, 0o600);
  }

  async ensureStorageDir() {
    await mkdir(dirname(this.statePath), { recursive: true, mode: 0o700 });
    await chmod(dirname(this.statePath), 0o700);
  }

  isBlockedCredentialAccess(toolName: string, input: unknown, cwd: string) {
    if (toolName === 'bash') {
      const command = (input as { command?: unknown }).command;
      return typeof command === 'string' && this.containsBlockedCredentialPath(command);
    }

    if (!['read', 'write', 'edit'].includes(toolName)) {
      return false;
    }

    const path = (input as { path?: unknown }).path;
    if (typeof path !== 'string') {
      return false;
    }

    const resolvedPath = resolve(cwd, this.expandHomeDir(path));
    return this.isCredentialPath(resolvedPath);
  }

  private containsBlockedCredentialPath(command: string) {
    return (
      command.includes(BLOCKED_PATH_HINT) ||
      command.includes(STORAGE_DIR_PATH_HINT) ||
      command.includes(this.credentialsPath) ||
      command.includes(this.storageDir)
    );
  }

  private expandHomeDir(path: string) {
    if (path === '~') {
      return homedir();
    }

    if (path.startsWith('~/')) {
      return resolve(homedir(), path.slice(2));
    }

    return path;
  }

  private isCredentialPath(path: string) {
    return path === this.credentialsPath || path.startsWith(`${this.storageDir}/`);
  }
}
