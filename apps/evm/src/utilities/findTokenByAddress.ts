import { areAddressesEqual } from '@venusprotocol/web3';

import { Token, VToken } from 'types';

function findTokenByAddress<TToken extends Token | VToken>({
  address,
  tokens,
}: {
  address: string;
  tokens: TToken[];
}) {
  return tokens.find(token => areAddressesEqual(token.address, address));
}

export default findTokenByAddress;
