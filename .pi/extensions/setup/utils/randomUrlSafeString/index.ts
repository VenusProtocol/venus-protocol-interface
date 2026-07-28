import { randomBytes } from 'node:crypto';

export const randomUrlSafeString = (byteLength = 32) =>
  randomBytes(byteLength).toString('base64url');
