import type { ExtensionAPI, ExtensionContext } from '@earendil-works/pi-coding-agent';
import { GitHubIntegration } from '../GitHubIntegration';
import { JiraIntegration } from '../JiraIntegration';
import { NotionIntegration } from '../NotionIntegration';
import { SetupStorage } from '../SetupStorage';
import type { ProviderMetadata, ProviderName, SetupState } from '../types';
import { errorMessage } from '../utils';

export class SetupExtension {
  private storage = new SetupStorage();
  private github = new GitHubIntegration(this.storage);
  private notion = new NotionIntegration();
  private jira = new JiraIntegration(this.storage);

  constructor(private pi: ExtensionAPI) {}

  register() {
    this.pi.on('session_start', async (_event, ctx) => {
      await this.runStartupCheck(ctx);
    });

    this.pi.on('tool_call', async (event, ctx) => {
      if (this.storage.isBlockedCredentialAccess(event.toolName, event.input, ctx.cwd)) {
        return {
          block: true,
          reason: 'Access to local AI integration credentials is blocked.',
        };
      }
    });

    this.pi.registerCommand('setup', {
      description: 'Set up optional read-only context integrations',
      handler: async (_args, ctx) => {
        await this.runWizard(ctx);
      },
    });

    this.pi.registerCommand('status', {
      description: 'Show optional AI integration setup status',
      handler: async (_args, ctx) => {
        ctx.ui.notify(await this.buildStatusMessage(), 'info');
      },
    });

    this.github.registerTools(this.pi);
    this.notion.registerTools(this.pi);
    this.jira.registerTools(this.pi);
  }

  private async runStartupCheck(ctx: ExtensionContext) {
    if (!ctx.hasUI) {
      return;
    }

    const state = await this.storage.readState();
    if (state.promptDismissed || this.hasConnectedProvider(state)) {
      return;
    }

    const shouldSetup = await ctx.ui.confirm(
      'Optional setup',
      'Set up optional read-only GitHub, Notion, and Jira context integrations?',
    );

    if (!shouldSetup) {
      await this.storage.writeState({ ...state, promptDismissed: true });
      return;
    }

    await this.runWizard(ctx);
  }

  private async runWizard(ctx: ExtensionContext) {
    if (!ctx.hasUI) {
      ctx.ui.notify('AI setup requires interactive mode.', 'warning');
      return;
    }

    ctx.ui.notify(
      'Setup is optional. GitHub auth uses gh, Notion auth uses ntn, and Jira uses Atlassian Rovo MCP browser auth. Tokens are stored locally for read-only tools.',
      'info',
    );

    let state = await this.storage.readState();
    const credentials = await this.storage.readCredentials();

    try {
      if (await ctx.ui.confirm('GitHub', 'Connect GitHub with the GitHub CLI?')) {
        const metadata = await this.github.setup(ctx, credentials);
        if (metadata) {
          state = this.withProvider(state, 'github', metadata);
        }
      }
    } catch (error) {
      ctx.ui.notify(`GitHub setup failed: ${errorMessage(error)}`, 'error');
    }

    try {
      if (await ctx.ui.confirm('Notion', 'Connect Notion with the Notion CLI?')) {
        const metadata = await this.notion.setup(ctx);
        if (metadata) {
          state = this.withProvider(state, 'notion', metadata);
        }
      }
    } catch (error) {
      ctx.ui.notify(`Notion setup failed: ${errorMessage(error)}`, 'error');
    }

    try {
      if (await ctx.ui.confirm('Jira', 'Connect Jira with browser login?')) {
        const metadata = await this.jira.setup(ctx, credentials);
        if (metadata) {
          state = this.withProvider(state, 'jira', metadata);
        }
      }
    } catch (error) {
      ctx.ui.notify(`Jira setup failed: ${errorMessage(error)}`, 'error');
    }

    await this.storage.writeCredentials(credentials);
    await this.storage.writeState({ ...state, promptDismissed: true });
    ctx.ui.notify(await this.buildStatusMessage(), 'info');
  }

  private async buildStatusMessage() {
    const state = await this.storage.readState();
    const lines = [
      await this.github.statusLine(state),
      await this.notion.statusLine(state),
      await this.jira.statusLine(state),
    ];

    return `AI integrations:\n${lines.join('\n')}`;
  }

  private withProvider(
    state: SetupState,
    provider: ProviderName,
    metadata: ProviderMetadata,
  ): SetupState {
    return {
      ...state,
      providers: {
        ...state.providers,
        [provider]: metadata,
      },
    };
  }

  private hasConnectedProvider(state: SetupState) {
    return Boolean(state.providers.github || state.providers.notion || state.providers.jira);
  }
}
