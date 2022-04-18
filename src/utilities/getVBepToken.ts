import { VTokenId, IVBepToken } from 'types';
import { VBEP_TOKENS } from 'constants/tokens';

export const getVBepToken = (id: VTokenId) => VBEP_TOKENS[id] as IVBepToken;

export default getVBepToken;
