export type ProviderName = 'github' | 'notion' | 'jira';

export type ProviderMetadata = {
  connectedAtMs: number;
  accountName?: string;
  scopes?: string[];
  url?: string;
};

export type SetupState = {
  version: number;
  promptDismissed: boolean;
  providers: Partial<Record<ProviderName, ProviderMetadata>>;
};

export type StoredCredentials = {
  github?: { token: string };
  jira?: {
    token: string;
    clientId: string;
    cloudId: string;
    siteUrl: string;
    projectKeys?: string[];
    refreshToken?: string;
    expiresAtMs?: number;
  };
};

export type CommandResult = {
  code: number;
  stdout: string;
  stderr: string;
};

export type GitHubSearchRepositoriesParams = {
  query: string;
  limit?: number;
};

export type GitHubSearchIssuesParams = {
  query: string;
  repo?: string;
  limit?: number;
};

export type GitHubReadFileParams = {
  owner: string;
  repo: string;
  path: string;
  ref?: string;
};

export type NotionSearchPagesParams = {
  query: string;
  limit?: number;
};

export type NotionReadPageParams = {
  pageId: string;
};

export type NotionUserMeResponse = {
  id?: string;
  name?: string;
  workspace_name?: string;
  workspace_id?: string;
  bot?: {
    workspace_name?: string;
    workspace_id?: string;
  };
  person?: {
    email?: string;
  };
};

export type NotionCliApiResult = { ok: true; payload: unknown } | { ok: false; message: string };

export type JiraSearchIssuesParams = {
  jql: string;
  limit?: number;
};

export type JiraReadIssueParams = {
  issueKey: string;
};

export type JiraOAuthTokenResponse = {
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
  scope?: string;
  error?: string;
  error_description?: string;
};

export type JiraOAuthMetadata = {
  authorization_endpoint: string;
  token_endpoint: string;
  registration_endpoint?: string;
};

export type JiraOAuthClientRegistrationResponse = {
  client_id?: string;
  error?: string;
  error_description?: string;
};

export type OAuthCallbackServer = {
  redirectUri: string;
  waitForCode: Promise<string>;
  close: () => Promise<void>;
};

export type JiraMcpMessage = {
  jsonrpc?: string;
  id?: number | string;
  result?: unknown;
  error?: { code?: number; message?: string; data?: unknown };
};

export type JiraMcpRequestResult = {
  message?: JiraMcpMessage;
  sessionId?: string;
};

export type JiraMcpToolResult = {
  content?: Array<{ type?: string; text?: string }>;
  isError?: boolean;
};

export type JiraMcpResource = {
  id: string;
  name?: string;
  url?: string;
};

export type JiraMcpProject = {
  key: string;
  name?: string;
};
