import { type Server, createServer } from 'node:http';
import type { ExtensionAPI, ExtensionContext } from '@earendil-works/pi-coding-agent';
import { Type } from 'typebox';
import type { SetupStorage } from '../SetupStorage';
import {
  JIRA_MCP_AUTHORIZATION_METADATA_URL,
  JIRA_MCP_RESOURCE_URL,
  JIRA_MCP_SCOPE,
  JIRA_MCP_SERVER_URL,
  JIRA_OAUTH_CALLBACK_PATH,
  JIRA_OAUTH_CALLBACK_PORT,
  MCP_PROTOCOL_VERSION,
  SETUP_VERSION,
  VENUS_PROTOCOL_JIRA_PROJECT_KEY,
} from '../constants';
import type {
  JiraMcpMessage,
  JiraMcpRequestResult,
  JiraMcpResource,
  JiraMcpToolResult,
  JiraOAuthClientRegistrationResponse,
  JiraOAuthMetadata,
  JiraOAuthTokenResponse,
  JiraReadIssueParams,
  JiraSearchIssuesParams,
  OAuthCallbackServer,
  ProviderMetadata,
  SetupState,
  StoredCredentials,
} from '../types';
import {
  expiresAtMs,
  limit,
  openBrowser,
  parseScopes,
  pkceChallenge,
  randomUrlSafeString,
  readJsonResponse,
  textResult,
  truncate,
  unconfiguredResult,
} from '../utils';

export class JiraIntegration {
  constructor(private storage: SetupStorage) {}

  registerTools(pi: ExtensionAPI) {
    pi.registerTool({
      name: 'jira_search_issues',
      label: 'Jira Search Issues',
      description:
        'Search Venus Protocol Jira issues with JQL using the connected Atlassian Rovo MCP session.',
      promptSnippet: 'Search Venus Protocol Jira issues with read-only Atlassian Rovo MCP access',
      promptGuidelines: [
        'Use jira_search_issues only for read-only Jira MCP lookups. Searches are scoped to the Venus Protocol project.',
      ],
      parameters: Type.Object({
        jql: Type.String({
          description: 'Jira JQL query. Project scoping is applied automatically.',
        }),
        limit: Type.Optional(Type.Number({ description: 'Maximum number of results, up to 20' })),
      }),
      execute: async (_toolCallId, params) => this.searchIssues(params),
    });

    pi.registerTool({
      name: 'jira_read_issue',
      label: 'Jira Read Issue',
      description: 'Read a Jira issue using the connected Atlassian Rovo MCP session.',
      promptSnippet: 'Read Jira issues with read-only Atlassian Rovo MCP access',
      promptGuidelines: ['Use jira_read_issue only to read Jira issue content through MCP.'],
      parameters: Type.Object({
        issueKey: Type.String({
          description: 'Jira issue key, for example PROJ-123',
        }),
      }),
      execute: async (_toolCallId, params) => this.readIssue(params),
    });
  }

  async setup(
    ctx: ExtensionContext,
    credentials: StoredCredentials,
  ): Promise<ProviderMetadata | undefined> {
    const token = await this.login(ctx);
    if (!token) {
      return undefined;
    }

    const connection = {
      token: token.accessToken,
      clientId: token.clientId,
      refreshToken: token.refreshToken,
      expiresAtMs: token.expiresAtMs,
      cloudId: '',
      siteUrl: '',
    };
    const resourcesResult = await this.callTool(connection, 'getAccessibleAtlassianResources', {});
    const resources = this.parseResources(resourcesResult);
    if (resources.length === 0) {
      ctx.ui.notify('Jira validation failed: no accessible Atlassian sites found.', 'error');
      return undefined;
    }

    const resource = await this.selectResource(ctx, resources);
    if (!resource) {
      return undefined;
    }

    credentials.jira = {
      token: token.accessToken,
      clientId: token.clientId,
      refreshToken: token.refreshToken,
      expiresAtMs: token.expiresAtMs,
      cloudId: resource.id,
      siteUrl: resource.url || '',
      projectKeys: [VENUS_PROTOCOL_JIRA_PROJECT_KEY],
    };

    return {
      connectedAtMs: Date.now(),
      accountName: resource.name || resource.url || 'Jira site',
      scopes: token.scopes,
      url: resource.url,
    };
  }

  async statusLine(state: SetupState) {
    const credentials = await this.storage.readCredentials();
    const jira = credentials.jira;
    if (!jira?.clientId) {
      return 'jira: not connected';
    }

    const metadata = state.providers.jira;
    const account = metadata?.accountName || jira.siteUrl || 'Atlassian Rovo MCP';
    return `jira: connected (${account}) project: ${VENUS_PROTOCOL_JIRA_PROJECT_KEY}`;
  }

  private async login(ctx: ExtensionContext): Promise<
    | {
        accessToken: string;
        clientId: string;
        refreshToken?: string;
        expiresAtMs?: number;
        scopes?: string[];
      }
    | undefined
  > {
    const state = randomUrlSafeString();
    const codeVerifier = randomUrlSafeString(64);
    const callbackServer = await this.startOAuthCallbackServer({
      provider: 'Jira',
      callbackPath: JIRA_OAUTH_CALLBACK_PATH,
      port: JIRA_OAUTH_CALLBACK_PORT,
      state,
    });

    try {
      const metadata = await this.getOAuthMetadata();
      const client = await this.registerOAuthClient(callbackServer.redirectUri, metadata);
      const authUrl = new URL(metadata.authorization_endpoint);
      authUrl.searchParams.set('response_type', 'code');
      authUrl.searchParams.set('client_id', client.clientId);
      authUrl.searchParams.set('scope', JIRA_MCP_SCOPE);
      authUrl.searchParams.set('redirect_uri', callbackServer.redirectUri);
      authUrl.searchParams.set('state', state);
      authUrl.searchParams.set('prompt', 'consent');
      authUrl.searchParams.set('resource', JIRA_MCP_RESOURCE_URL);
      authUrl.searchParams.set('code_challenge', pkceChallenge(codeVerifier));
      authUrl.searchParams.set('code_challenge_method', 'S256');

      openBrowser(authUrl.toString());
      ctx.ui.notify('Waiting for Jira authorization in your browser...', 'info');

      const code = await callbackServer.waitForCode;
      const token = await this.exchangeCode(
        code,
        codeVerifier,
        callbackServer.redirectUri,
        client.clientId,
        metadata,
      );
      if (!token.access_token) {
        throw new Error(
          token.error_description || token.error || 'Jira did not return an access token.',
        );
      }

      return {
        accessToken: token.access_token,
        clientId: client.clientId,
        refreshToken: token.refresh_token,
        expiresAtMs: expiresAtMs(token.expires_in),
        scopes: parseScopes(token.scope || ''),
      };
    } finally {
      await callbackServer.close();
    }
  }

  private async getOAuthMetadata() {
    const response = await fetch(JIRA_MCP_AUTHORIZATION_METADATA_URL, {
      headers: { Accept: 'application/json' },
    });

    return (await readJsonResponse(response, 'Jira MCP OAuth metadata')) as JiraOAuthMetadata;
  }

  private async registerOAuthClient(redirectUri: string, metadata: JiraOAuthMetadata) {
    if (!metadata.registration_endpoint) {
      throw new Error('Jira MCP OAuth server does not support dynamic client registration.');
    }

    const response = await fetch(metadata.registration_endpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        redirect_uris: [redirectUri],
        token_endpoint_auth_method: 'none',
        grant_types: ['authorization_code', 'refresh_token'],
        response_types: ['code'],
        client_name: 'Venus Pi setup',
        client_uri: 'https://github.com/VenusProtocol/venus-protocol',
        software_version: String(SETUP_VERSION),
        scope: JIRA_MCP_SCOPE,
      }),
    });

    const payload = (await response.json()) as JiraOAuthClientRegistrationResponse;
    if (!response.ok || payload.error || !payload.client_id) {
      throw new Error(
        payload.error_description ||
          payload.error ||
          `Jira MCP client registration failed: ${response.status}`,
      );
    }

    return { clientId: payload.client_id };
  }

  private async exchangeCode(
    code: string,
    codeVerifier: string,
    redirectUri: string,
    clientId: string,
    metadata: JiraOAuthMetadata,
  ) {
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
      resource: JIRA_MCP_RESOURCE_URL,
    });

    return this.requestOAuthToken(metadata.token_endpoint, body, 'Jira MCP OAuth');
  }

  private async refreshToken(refreshToken: string, clientId: string) {
    const metadata = await this.getOAuthMetadata();
    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: clientId,
      refresh_token: refreshToken,
      resource: JIRA_MCP_RESOURCE_URL,
    });

    return this.requestOAuthToken(metadata.token_endpoint, body, 'Jira MCP token refresh');
  }

  private async requestOAuthToken(tokenEndpoint: string, body: URLSearchParams, label: string) {
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    const payload = (await response.json()) as JiraOAuthTokenResponse;
    if (!response.ok || payload.error) {
      throw new Error(
        payload.error_description || payload.error || `${label} failed: ${response.status}`,
      );
    }

    return payload;
  }

  private async startOAuthCallbackServer({
    provider,
    callbackPath,
    port,
    state,
  }: {
    provider: string;
    callbackPath: string;
    port: number;
    state: string;
  }): Promise<OAuthCallbackServer> {
    const redirectUri = `http://localhost:${port}${callbackPath}`;
    const server = createServer();

    const waitForCode = new Promise<string>((resolveCode, rejectCode) => {
      server.on('request', (request, response) => {
        const requestUrl = new URL(request.url || '/', redirectUri);
        const code = requestUrl.searchParams.get('code') || undefined;
        const returnedState = requestUrl.searchParams.get('state') || undefined;
        const error = requestUrl.searchParams.get('error') || undefined;
        const errorDescription = requestUrl.searchParams.get('error_description') || undefined;

        if (requestUrl.pathname !== callbackPath) {
          response.writeHead(404, { 'Content-Type': 'text/plain' });
          response.end('Not found');
          return;
        }

        if (error) {
          response.writeHead(400, { 'Content-Type': 'text/html' });
          response.end(this.oauthHtml(`${provider} authorization failed. You can close this tab.`));
          rejectCode(new Error(errorDescription || error));
          return;
        }

        if (returnedState !== state) {
          response.writeHead(400, { 'Content-Type': 'text/html' });
          response.end(this.oauthHtml(`${provider} authorization failed. You can close this tab.`));
          rejectCode(new Error(`${provider} OAuth state mismatch.`));
          return;
        }

        if (!code) {
          response.writeHead(400, { 'Content-Type': 'text/html' });
          response.end(
            this.oauthHtml(`${provider} did not return a code. You can close this tab.`),
          );
          rejectCode(new Error(`${provider} did not return an authorization code.`));
          return;
        }

        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(this.oauthHtml(`${provider} authorization complete. You can close this tab.`));
        resolveCode(code);
      });

      server.on('error', error => {
        rejectCode(error);
      });
    });

    await this.listen(server, port);

    return {
      redirectUri,
      waitForCode,
      close: async () => this.closeServer(server),
    };
  }

  private listen(server: Server, port: number) {
    return new Promise<void>((resolveListen, rejectListen) => {
      server.once('error', rejectListen);
      server.listen(port, 'localhost', () => {
        server.off('error', rejectListen);
        resolveListen();
      });
    });
  }

  private closeServer(server: Server) {
    return new Promise<void>(resolveClose => {
      if (!server.listening) {
        resolveClose();
        return;
      }

      server.close(() => {
        resolveClose();
      });
    });
  }

  private oauthHtml(message: string) {
    return `<!doctype html><meta charset="utf-8"><title>Venus Pi setup</title><body>${message}</body>`;
  }

  private async selectResource(ctx: ExtensionContext, resources: JiraMcpResource[]) {
    if (resources.length === 1) {
      return resources[0];
    }

    const labels = resources.map(
      resource => `${resource.name || resource.url || resource.id} (${resource.id})`,
    );
    const selected = await ctx.ui.select('Select Jira site', labels);
    if (!selected) {
      return undefined;
    }

    const selectedIndex = labels.indexOf(selected);
    return resources[selectedIndex];
  }

  private async searchIssues(params: JiraSearchIssuesParams) {
    const jira = await this.getConfiguredJira();
    if (!jira) {
      return unconfiguredResult('Jira');
    }

    const payload = await this.callTool(jira, 'searchJiraIssuesUsingJql', {
      cloudId: jira.cloudId,
      jql: this.scopedJql(params.jql),
      maxResults: limit(params.limit),
      fields: [
        'key',
        'summary',
        'status',
        'assignee',
        'reporter',
        'issuetype',
        'priority',
        'updated',
      ],
      responseContentFormat: 'markdown',
    });

    return textResult(truncate(this.formatToolResult(payload)));
  }

  private async readIssue(params: JiraReadIssueParams) {
    const jira = await this.getConfiguredJira();
    if (!jira) {
      return unconfiguredResult('Jira');
    }

    const payload = await this.callTool(jira, 'getJiraIssue', {
      cloudId: jira.cloudId,
      issueIdOrKey: params.issueKey,
      fields: [
        'key',
        'summary',
        'status',
        'assignee',
        'reporter',
        'issuetype',
        'priority',
        'description',
        'comment',
        'updated',
        'created',
      ],
      responseContentFormat: 'markdown',
    });

    return textResult(truncate(this.formatToolResult(payload)));
  }

  private async callTool(
    jira: NonNullable<StoredCredentials['jira']>,
    name: string,
    args: Record<string, unknown>,
  ) {
    const initialize = await this.mcpRequest(jira.token, 'initialize', {
      protocolVersion: MCP_PROTOCOL_VERSION,
      capabilities: {},
      clientInfo: { name: 'venus-pi-setup', version: String(SETUP_VERSION) },
    });
    const sessionId = initialize.sessionId;

    await this.mcpNotification(jira.token, 'notifications/initialized', {}, sessionId);

    const response = await this.mcpRequest(
      jira.token,
      'tools/call',
      { name, arguments: args },
      sessionId,
    );
    const result = response.message?.result as JiraMcpToolResult | undefined;
    if (!result) {
      throw new Error(`Jira MCP tool ${name} returned no result.`);
    }

    if (result.isError) {
      throw new Error(this.formatToolResult(result));
    }

    return result;
  }

  private async mcpNotification(
    token: string,
    method: string,
    params: Record<string, unknown>,
    sessionId: string | undefined,
  ) {
    await this.mcpHttp(token, { jsonrpc: '2.0', method, params }, sessionId);
  }

  private async mcpRequest(
    token: string,
    method: string,
    params: Record<string, unknown>,
    sessionId?: string,
  ) {
    const id = Date.now();
    const result = await this.mcpHttp(token, { jsonrpc: '2.0', id, method, params }, sessionId);
    if (result.message?.error) {
      throw new Error(result.message.error.message || `Jira MCP request ${method} failed.`);
    }

    return result;
  }

  private async mcpHttp(
    token: string,
    body: Record<string, unknown>,
    sessionId?: string,
  ): Promise<JiraMcpRequestResult> {
    const headers: Record<string, string> = {
      Accept: 'application/json, text/event-stream',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'mcp-protocol-version': MCP_PROTOCOL_VERSION,
    };
    if (sessionId) {
      headers['mcp-session-id'] = sessionId;
    }

    const response = await fetch(JIRA_MCP_SERVER_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    const nextSessionId = response.headers.get('mcp-session-id') || sessionId;
    const text = await response.text();
    if (!response.ok) {
      throw new Error(`Jira MCP request failed: ${response.status} ${truncate(text)}`);
    }

    if (response.status === 202 || !text.trim()) {
      return { sessionId: nextSessionId };
    }

    return {
      sessionId: nextSessionId,
      message: this.parseMcpResponseMessage(text, response.headers.get('content-type') || ''),
    };
  }

  private parseMcpResponseMessage(text: string, contentType: string): JiraMcpMessage {
    if (contentType.includes('text/event-stream')) {
      const dataLine = text.split('\n').find(line => line.startsWith('data:'));
      if (!dataLine) {
        throw new Error(`Jira MCP returned an empty event stream: ${truncate(text)}`);
      }

      return JSON.parse(dataLine.slice('data:'.length).trim()) as JiraMcpMessage;
    }

    const payload = JSON.parse(text) as JiraMcpMessage | JiraMcpMessage[];
    return Array.isArray(payload) ? payload[0] : payload;
  }

  private formatToolResult(result: JiraMcpToolResult) {
    const text = result.content
      ?.map(item => (typeof item.text === 'string' ? item.text : JSON.stringify(item)))
      .filter(Boolean)
      .join('\n');

    return text || JSON.stringify(result, undefined, 2);
  }

  private parseResources(result: JiraMcpToolResult): JiraMcpResource[] {
    const payload = this.parseToolJson(result);
    const objects = this.collectObjects(payload);

    return objects
      .map(item => ({
        id: this.stringField(item, 'id') || this.stringField(item, 'cloudId') || '',
        name: this.stringField(item, 'name'),
        url: this.stringField(item, 'url'),
      }))
      .filter(resource => resource.id);
  }

  private parseToolJson(result: JiraMcpToolResult) {
    const text = this.formatToolResult(result).trim();
    const withoutFence = text
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/```$/i, '')
      .trim();

    try {
      return JSON.parse(withoutFence) as unknown;
    } catch {
      const match = withoutFence.match(/(\[[\s\S]*\]|\{[\s\S]*\})/);
      if (!match) {
        return undefined;
      }

      try {
        return JSON.parse(match[1]) as unknown;
      } catch {
        return undefined;
      }
    }
  }

  private collectObjects(value: unknown): Record<string, unknown>[] {
    if (Array.isArray(value)) {
      return value.flatMap(item => this.collectObjects(item));
    }

    if (!value || typeof value !== 'object') {
      return [];
    }

    const record = value as Record<string, unknown>;
    const children = Object.values(record).flatMap(item => this.collectObjects(item));
    return [record, ...children];
  }

  private stringField(record: Record<string, unknown>, field: string) {
    const value = record[field];
    return typeof value === 'string' ? value : undefined;
  }

  private scopedJql(jql: string) {
    const scope = `project = "${VENUS_PROTOCOL_JIRA_PROJECT_KEY}"`;
    const trimmedJql = jql.trim();
    if (!trimmedJql) {
      return scope;
    }

    const orderByIndex = trimmedJql.search(/\border\s+by\b/i);
    if (orderByIndex < 0) {
      return `${scope} AND (${trimmedJql})`;
    }

    const filter = trimmedJql.slice(0, orderByIndex).trim();
    const orderBy = trimmedJql.slice(orderByIndex).trim();
    return `${scope} AND (${filter || 'key is not EMPTY'}) ${orderBy}`;
  }

  private async getConfiguredJira() {
    const credentials = await this.storage.readCredentials();
    const jira = credentials.jira;
    if (!jira) {
      return undefined;
    }

    if (!jira.clientId) {
      return undefined;
    }

    if (!this.shouldRefresh(jira)) {
      return jira;
    }

    if (!jira.refreshToken) {
      return jira;
    }

    const refreshedToken = await this.refreshToken(jira.refreshToken, jira.clientId);
    if (!refreshedToken.access_token) {
      return jira;
    }

    credentials.jira = {
      ...jira,
      token: refreshedToken.access_token,
      refreshToken: refreshedToken.refresh_token || jira.refreshToken,
      expiresAtMs: expiresAtMs(refreshedToken.expires_in),
    };
    await this.storage.writeCredentials(credentials);

    return credentials.jira;
  }

  private shouldRefresh(jira: NonNullable<StoredCredentials['jira']>) {
    if (!jira.expiresAtMs) {
      return false;
    }

    return jira.expiresAtMs <= Date.now() + 60_000;
  }
}
