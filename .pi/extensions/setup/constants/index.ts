export const SETUP_VERSION = 1;
export const SETUP_DIR_NAME = 'venus';
export const STATE_FILE_NAME = 'state.json';
export const CREDENTIALS_FILE_NAME = 'credentials.json';
export const BLOCKED_PATH_HINT = `${SETUP_DIR_NAME}/${CREDENTIALS_FILE_NAME}`;
export const STORAGE_DIR_PATH_HINT = `.pi/agent/${SETUP_DIR_NAME}`;
export const DEFAULT_MAX_BYTES = 50 * 1024;
export const DEFAULT_MAX_LINES = 2000;

export const GITHUB_CLI_INSTALL_URL = 'https://cli.github.com/';
export const NOTION_CLI_INSTALL_COMMAND = 'curl -fsSL https://ntn.dev | bash';

export const JIRA_MCP_SERVER_URL = 'https://mcp.atlassian.com/v1/mcp/authv2';
export const JIRA_MCP_RESOURCE_URL = JIRA_MCP_SERVER_URL;
export const JIRA_MCP_AUTHORIZATION_METADATA_URL =
  'https://auth.atlassian.com/VCeDsk8ZHncYF1g234fKtc4lNipbBhu3/.well-known/oauth-authorization-server';
export const JIRA_MCP_SCOPE = 'read:me read:account read:jira-work offline_access';
export const JIRA_OAUTH_CALLBACK_PORT = 39172;
export const JIRA_OAUTH_CALLBACK_PATH = '/oauth/jira/callback';
export const VENUS_PROTOCOL_JIRA_PROJECT_KEY = 'VPD';
export const MCP_PROTOCOL_VERSION = '2025-06-18';
