import type { ExtensionAPI, ExtensionContext } from '@earendil-works/pi-coding-agent';
import { Type } from 'typebox';
import { NOTION_CLI_INSTALL_COMMAND } from '../constants';
import type {
  NotionCliApiResult,
  NotionReadPageParams,
  NotionSearchPagesParams,
  NotionUserMeResponse,
  ProviderMetadata,
  SetupState,
} from '../types';
import {
  limit,
  runCommand,
  runInteractiveCommand,
  runInteractiveShellCommand,
  textResult,
  truncate,
} from '../utils';

export class NotionIntegration {
  registerTools(pi: ExtensionAPI) {
    pi.registerTool({
      name: 'notion_search_pages',
      label: 'Notion Search Pages',
      description: 'Search Notion pages using the connected Notion CLI session.',
      promptSnippet: 'Search Notion pages with read-only access',
      promptGuidelines: ['Use notion_search_pages only for read-only Notion lookups.'],
      parameters: Type.Object({
        query: Type.String({ description: 'Search query' }),
        limit: Type.Optional(Type.Number({ description: 'Maximum number of results, up to 20' })),
      }),
      execute: async (_toolCallId, params) => this.searchPages(params),
    });

    pi.registerTool({
      name: 'notion_read_page',
      label: 'Notion Read Page',
      description:
        'Read Notion page metadata and first-level blocks using the connected Notion CLI session.',
      promptSnippet: 'Read Notion pages with read-only access',
      promptGuidelines: ['Use notion_read_page only to read Notion content.'],
      parameters: Type.Object({
        pageId: Type.String({ description: 'Notion page ID' }),
      }),
      execute: async (_toolCallId, params) => this.readPage(params),
    });
  }

  async setup(ctx: ExtensionContext): Promise<ProviderMetadata | undefined> {
    if (!(await this.ensureCliInstalled(ctx))) {
      return undefined;
    }

    let profile = await this.getCliProfile();
    if (!profile) {
      const shouldLogin = await ctx.ui.confirm(
        'Notion login',
        'Notion CLI is not authenticated. Run ntn login now?',
      );
      if (!shouldLogin) {
        return undefined;
      }

      ctx.ui.notify('Starting Notion CLI login in the terminal...', 'info');
      await runInteractiveCommand('ntn', ['login']);
      profile = await this.getCliProfile();
    }

    if (!profile) {
      throw new Error('Notion CLI authentication did not complete.');
    }

    return {
      connectedAtMs: Date.now(),
      accountName: this.accountName(profile),
      url: 'https://notion.so',
    };
  }

  async statusLine(state: SetupState) {
    const metadata = state.providers.notion;
    const profile = await this.getCliProfile();
    if (!profile && !metadata) {
      return 'notion: not connected';
    }

    const account = metadata?.accountName || (profile ? this.accountName(profile) : 'via ntn');
    return `notion: connected (${account})`;
  }

  private async ensureCliInstalled(ctx: ExtensionContext) {
    const result = await runCommand('ntn', ['--version']);
    if (result.code === 0) {
      return true;
    }

    const shouldInstall = await ctx.ui.confirm(
      'Install Notion CLI',
      `Notion CLI is not installed. Run ${NOTION_CLI_INSTALL_COMMAND} now?`,
    );
    if (!shouldInstall) {
      return false;
    }

    ctx.ui.notify('Installing Notion CLI in the terminal...', 'info');
    await runInteractiveShellCommand(NOTION_CLI_INSTALL_COMMAND);

    const installedResult = await runCommand('ntn', ['--version']);
    if (installedResult.code === 0) {
      return true;
    }

    throw new Error('Notion CLI install completed, but ntn is still unavailable in PATH.');
  }

  private async getCliProfile() {
    const response = await this.runCliApi('v1/users/me', [], 'Notion profile');
    if (response.ok === false) {
      return undefined;
    }

    return response.payload as NotionUserMeResponse;
  }

  private accountName(profile: NotionUserMeResponse) {
    return (
      profile.workspace_name ||
      profile.bot?.workspace_name ||
      profile.name ||
      profile.person?.email ||
      profile.workspace_id ||
      profile.bot?.workspace_id ||
      profile.id ||
      'Notion workspace'
    );
  }

  private async runCliApi(
    path: string,
    args: string[],
    label: string,
  ): Promise<NotionCliApiResult> {
    const result = await runCommand('ntn', ['api', path, ...args]);
    if (result.code !== 0) {
      return { ok: false, message: result.stderr.trim() || `${label} failed.` };
    }

    try {
      return { ok: true, payload: JSON.parse(result.stdout) as unknown };
    } catch {
      throw new Error(`${label} returned invalid JSON: ${truncate(result.stdout)}`);
    }
  }

  private async searchPages(params: NotionSearchPagesParams) {
    const body = {
      query: params.query,
      page_size: limit(params.limit),
      filter: { property: 'object', value: 'page' },
    };
    const cliResult = await this.runCliApi(
      'v1/search',
      ['--data', JSON.stringify(body)],
      'Notion search',
    );
    if (cliResult.ok === false) {
      return textResult(`Notion CLI request failed: ${cliResult.message}`);
    }

    return textResult(truncate(JSON.stringify(cliResult.payload, undefined, 2)));
  }

  private async readPage(params: NotionReadPageParams) {
    const pageResult = await this.runCliApi(`v1/pages/${params.pageId}`, [], 'Notion page read');
    if (pageResult.ok === false) {
      return textResult(`Notion CLI request failed: ${pageResult.message}`);
    }

    const blocksResult = await this.runCliApi(
      `v1/blocks/${params.pageId}/children`,
      ['page_size==50'],
      'Notion block read',
    );
    if (blocksResult.ok === false) {
      throw new Error(blocksResult.message);
    }

    return textResult(
      truncate(
        JSON.stringify({ page: pageResult.payload, blocks: blocksResult.payload }, undefined, 2),
      ),
    );
  }
}
