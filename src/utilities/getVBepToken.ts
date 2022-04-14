import { VBepTokenId, IVBepToken } from 'types';
import { VBEP_TOKENS } from 'constants/tokens';

export const getVBepToken = (id: VBepTokenId) => VBEP_TOKENS[id] as IVBepToken;

export default getVBepToken;
