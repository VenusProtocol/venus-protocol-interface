import type { Token, VToken } from 'types';
import { areAddressesEqual } from 'utilities';

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
