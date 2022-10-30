import { Token } from 'types';

import { VBEP_TOKENS } from 'constants/tokens';

// TODO: remove (currently unsafe since it assumes ID passed is always correct
export const getVBepToken = (id: string) => VBEP_TOKENS[id as keyof typeof VBEP_TOKENS] as Token;

export default getVBepToken;
