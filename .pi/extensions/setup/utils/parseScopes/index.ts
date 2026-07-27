export const parseScopes = (scopes: string) =>
  scopes
    .split(/[\s,]+/)
    .map(scope => scope.trim())
    .filter(Boolean);
