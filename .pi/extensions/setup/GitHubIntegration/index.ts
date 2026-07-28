import type { ExtensionAPI, ExtensionContext } from '@earendil-works/pi-coding-agent';
import { Type } from 'typebox';
import type { SetupStorage } from '../SetupStorage';
import { GITHUB_CLI_INSTALL_URL } from '../constants';
import type {
  GitHubReadFileParams,
  GitHubSearchIssuesParams,
  GitHubSearchRepositoriesParams,
  ProviderMetadata,
  SetupState,
  StoredCredentials,
} from '../types';
import {
  limit,
  openBrowser,
  parseScopes,
  readJsonResponse,
  runCommand,
  runInteractiveCommand,
  textResult,
  truncate,
  unconfiguredResult,
} from '../utils';

export class GitHubIntegration {
  constructor(private storage: SetupStorage) {}

  registerTools(pi: ExtensionAPI) {
    pi.registerTool({
      name: 'github_search_repositories',
      label: 'GitHub Search Repositories',
      description: 'Search GitHub repositories using the connected read-only GitHub token.',
      promptSnippet:
        'Search GitHub repositories when a connected read-only GitHub token is available',
      promptGuidelines: [
        'Use github_search_repositories only for read-only GitHub lookups and never for mutations.',
      ],
      parameters: Type.Object({
        query: Type.String({ description: 'GitHub repository search query' }),
        limit: Type.Optional(Type.Number({ description: 'Maximum number of results, up to 20' })),
      }),
      execute: async (_toolCallId, params) => this.searchRepositories(params),
    });

    pi.registerTool({
      name: 'github_search_issues',
      label: 'GitHub Search Issues',
      description:
        'Search GitHub issues and pull requests using the connected read-only GitHub token.',
      promptSnippet: 'Search GitHub issues and pull requests with read-only access',
      promptGuidelines: ['Use github_search_issues only for read-only GitHub lookups.'],
      parameters: Type.Object({
        query: Type.String({ description: 'GitHub issue search query' }),
        repo: Type.Optional(
          Type.String({
            description: 'Optional owner/repo to scope the search',
          }),
        ),
        limit: Type.Optional(Type.Number({ description: 'Maximum number of results, up to 20' })),
      }),
      execute: async (_toolCallId, params) => this.searchIssues(params),
    });

    pi.registerTool({
      name: 'github_read_file',
      label: 'GitHub Read File',
      description:
        'Read a file from a GitHub repository using the connected read-only GitHub token.',
      promptSnippet: 'Read files from GitHub repositories with read-only access',
      promptGuidelines: ['Use github_read_file only to read repository contents.'],
      parameters: Type.Object({
        owner: Type.String({ description: 'Repository owner' }),
        repo: Type.String({ description: 'Repository name' }),
        path: Type.String({ description: 'File path inside the repository' }),
        ref: Type.Optional(Type.String({ description: 'Optional branch, tag, or commit SHA' })),
      }),
      execute: async (_toolCallId, params) => this.readFile(params),
    });
  }

  async setup(
    ctx: ExtensionContext,
    credentials: StoredCredentials,
  ): Promise<ProviderMetadata | undefined> {
    if (!(await this.ensureCliInstalled(ctx))) {
      return undefined;
    }

    await this.sanitizeGitCredentialHelpers();

    if (!(await this.isCliAuthenticated())) {
      const shouldLogin = await ctx.ui.confirm(
        'GitHub login',
        'GitHub CLI is not authenticated. Run gh auth login --git-protocol https now?',
      );
      if (!shouldLogin) {
        return undefined;
      }

      ctx.ui.notify('Starting GitHub CLI login in the terminal...', 'info');
      await runInteractiveCommand('gh', ['auth', 'login', '--git-protocol', 'https']);
    }

    if (!(await this.isCliAuthenticated())) {
      throw new Error('GitHub CLI authentication did not complete.');
    }

    const token = await this.getCliToken();
    if (!token) {
      throw new Error('GitHub CLI did not return an auth token.');
    }

    const response = await fetch('https://api.github.com/user', {
      headers: this.headers(token),
    });

    if (!response.ok) {
      ctx.ui.notify(`GitHub validation failed: ${response.status} ${response.statusText}`, 'error');
      return undefined;
    }

    const profile = (await response.json()) as {
      login?: string;
      name?: string;
    };
    credentials.github = undefined;

    return {
      connectedAtMs: Date.now(),
      accountName: profile.login || profile.name || 'GitHub account',
      scopes: parseScopes(response.headers.get('x-oauth-scopes') || ''),
      url: 'https://github.com',
    };
  }

  async statusLine(state: SetupState) {
    const metadata = state.providers.github;
    const token = await this.getApiToken();
    if (!token) {
      return 'github: not connected';
    }

    const account = metadata?.accountName ? ` (${metadata.accountName})` : ' (via gh)';
    return `github: connected${account}`;
  }

  private async sanitizeGitCredentialHelpers() {
    const staleHelperPattern = /\/opt\/homebrew|\/usr\/local\/bin\/gh|Program Files/;
    const hosts = ['https://github.com', 'https://gist.github.com'];

    for (const host of hosts) {
      const key = `credential.${host}.helper`;
      const helpers = await runCommand('git', ['config', '--global', '--get-all', key]);
      if (!staleHelperPattern.test(helpers.stdout)) {
        continue;
      }

      await runCommand('git', ['config', '--global', '--unset-all', key]);
    }
  }

  private async ensureCliInstalled(ctx: ExtensionContext) {
    const result = await runCommand('gh', ['--version']);
    if (result.code === 0) {
      return true;
    }

    const shouldOpenInstructions = await ctx.ui.confirm(
      'Install GitHub CLI',
      'GitHub CLI is not installed. Open GitHub CLI install instructions now?',
    );
    if (!shouldOpenInstructions) {
      return false;
    }

    openBrowser(GITHUB_CLI_INSTALL_URL);
    ctx.ui.notify('Install GitHub CLI, then rerun /setup.', 'info');
    return false;
  }

  private async isCliAuthenticated() {
    const result = await runCommand('gh', ['auth', 'status']);
    return result.code === 0;
  }

  private async getCliToken() {
    const result = await runCommand('gh', ['auth', 'token']);
    if (result.code !== 0) {
      return undefined;
    }

    return result.stdout.trim() || undefined;
  }

  private async getApiToken() {
    const cliToken = await this.getCliToken();
    if (cliToken) {
      return cliToken;
    }

    const credentials = await this.storage.readCredentials();
    return credentials.github?.token;
  }

  private async searchRepositories(params: GitHubSearchRepositoriesParams) {
    const token = await this.getApiToken();
    if (!token) {
      return unconfiguredResult('GitHub');
    }

    const url = new URL('https://api.github.com/search/repositories');
    url.searchParams.set('q', params.query);
    url.searchParams.set('per_page', String(limit(params.limit)));

    const response = await fetch(url, { headers: this.headers(token) });
    const payload = await readJsonResponse(response, 'GitHub repository search');

    return textResult(truncate(JSON.stringify(payload, undefined, 2)));
  }

  private async searchIssues(params: GitHubSearchIssuesParams) {
    const token = await this.getApiToken();
    if (!token) {
      return unconfiguredResult('GitHub');
    }

    const url = new URL('https://api.github.com/search/issues');
    const repoPrefix = params.repo ? `repo:${params.repo} ` : '';
    url.searchParams.set('q', `${repoPrefix}${params.query}`);
    url.searchParams.set('per_page', String(limit(params.limit)));

    const response = await fetch(url, { headers: this.headers(token) });
    const payload = await readJsonResponse(response, 'GitHub issue search');

    return textResult(truncate(JSON.stringify(payload, undefined, 2)));
  }

  private async readFile(params: GitHubReadFileParams) {
    const token = await this.getApiToken();
    if (!token) {
      return unconfiguredResult('GitHub');
    }

    const encodedPath = params.path
      .split('/')
      .map(segment => encodeURIComponent(segment))
      .join('/');
    const url = new URL(
      `https://api.github.com/repos/${encodeURIComponent(params.owner)}/${encodeURIComponent(
        params.repo,
      )}/contents/${encodedPath}`,
    );
    if (params.ref) {
      url.searchParams.set('ref', params.ref);
    }

    const response = await fetch(url, { headers: this.headers(token) });
    const payload = (await readJsonResponse(response, 'GitHub file read')) as {
      content?: string;
      encoding?: string;
      path?: string;
      html_url?: string;
    };

    if (payload.encoding !== 'base64' || !payload.content) {
      return textResult(truncate(JSON.stringify(payload, undefined, 2)));
    }

    const text = Buffer.from(payload.content.replaceAll('\n', ''), 'base64').toString('utf8');
    const header = `# ${payload.path || params.path}\n${payload.html_url || ''}\n\n`;

    return textResult(truncate(`${header}${text}`));
  }

  private headers(token: string) {
    return {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'venus-pi-setup',
    };
  }
}
