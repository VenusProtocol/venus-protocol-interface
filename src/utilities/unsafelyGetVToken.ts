import { Token } from 'types';

import { VBEP_TOKENS } from 'constants/tokens';

/**
 * @deprecated This method is unsafe since it assumes ID passed is always correct
 * see: https://jira.toolsfdg.net/browse/VEN-723
 */
export const unsafelyGetVToken = (id: string) =>
  VBEP_TOKENS[id as keyof typeof VBEP_TOKENS] as Token;

export default unsafelyGetVToken;
