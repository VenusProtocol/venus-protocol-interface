import { Token } from 'types';

import { TOKENS } from 'constants/tokens';

/**
 * @deprecated This method is unsafe since it assumes ID passed is always correct
 * see: https://jira.toolsfdg.net/browse/VEN-723
 */
export const unsafelyGetToken = (id: string) => TOKENS[id as keyof typeof TOKENS] as Token;

export default unsafelyGetToken;
