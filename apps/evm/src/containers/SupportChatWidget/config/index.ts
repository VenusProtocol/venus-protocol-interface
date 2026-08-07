import { envVariables } from 'config/envVariables';

export const SUPPORT_CHAT_API_URL =
  envVariables.VITE_SUPPORT_CHAT_API_URL || 'http://localhost:4747';
