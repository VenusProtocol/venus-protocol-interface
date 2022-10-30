import { Token } from 'types';

import { TOKENS } from 'constants/tokens';

// TODO: remove (currently unsafe since it assumes ID passed is always correct
export const getToken = (id: string) => TOKENS[id as keyof typeof TOKENS] as Token;

export default getToken;
