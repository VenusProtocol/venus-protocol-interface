import { VToken } from 'types';

import { VBEP_TOKENS } from 'constants/tokens';

const getVTokenByAddress = (address: string) =>
  address.toLowerCase() in VBEP_TOKENS
    ? (VBEP_TOKENS[address.toLowerCase() as keyof typeof VBEP_TOKENS] as VToken)
    : undefined;

export default getVTokenByAddress;
