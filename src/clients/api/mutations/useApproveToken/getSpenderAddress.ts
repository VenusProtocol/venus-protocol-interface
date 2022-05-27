import { TokenId } from 'types';
import { getContractAddress, getVBepToken } from 'utilities';

const getSpenderAddress = (tokenId: TokenId) => {
  if (tokenId === 'vai') {
    return getContractAddress('vaiUnitroller');
  }

  if (tokenId === 'vrt') {
    return getContractAddress('vrtConverterProxy');
  }

  return getVBepToken(tokenId).address;
};

export default getSpenderAddress;
