import { TokenId } from 'types';

import vBepTokens from 'constants/contracts/addresses/vBepTokens.json';

const getTokenIdFromVAddress = (address: string) => {
  const token = Object.entries<{ [key: string]: string }>(vBepTokens).find(
    ([, value]) =>
      value[process.env.REACT_APP_CHAIN_ID || '56'].toLowerCase() === address.toLowerCase(),
  );
  if (token) {
    return token[0] as TokenId;
  }
};

export default getTokenIdFromVAddress;
