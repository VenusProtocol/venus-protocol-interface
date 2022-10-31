import { Token } from 'types';

import { TOKENS } from 'constants/tokens';

/**
 * @deprecated This method is unsafe since it assumes ID passed is always correct
 */
export const unsafeGetToken = (id: string) => TOKENS[id as keyof typeof TOKENS] as Token;

export default unsafeGetToken;
