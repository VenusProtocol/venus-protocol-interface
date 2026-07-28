import { textResult } from '../textResult';

export const unconfiguredResult = (provider: string) =>
  textResult(`${provider} is not connected. Run /setup to configure it.`);
