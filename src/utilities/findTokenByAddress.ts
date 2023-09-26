import { Token, VToken } from 'types';

import { areAddressesEqual } from './areAddressesEqual';

export function findTokenByAddress<TToken extends Token | VToken>({
  address,
  tokens,
}: {
  address: string;
  tokens: TToken[];
}) {
  return tokens.find(token => areAddressesEqual(token.address, address));
}
