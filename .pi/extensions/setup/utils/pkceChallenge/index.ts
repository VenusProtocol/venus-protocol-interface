import { createHash } from 'node:crypto';

export const pkceChallenge = (codeVerifier: string) =>
  createHash('sha256').update(codeVerifier).digest('base64url');
