import { TokenSymbol, IVBepToken } from 'types';
import { VBEP_TOKENS } from 'constants/tokens';

// @TODO: refactor to take chain ID in consideration (currently handled in
// constant file directly)
export const getVBepToken = (key: TokenSymbol): IVBepToken =>
  VBEP_TOKENS[key as keyof typeof VBEP_TOKENS] as IVBepToken;

export default getVBepToken;
