import { ChainId } from 'types';

import { getUniqueContractAddress } from '..';
import uniqueContractInfos from '../../contractInfos/uniqueContractInfos';

describe('getUniqueContractAddress', () => {
  it('returns address when contract exists on chain', () => {
    const CHAIN_ID = 56;
    const address = getUniqueContractAddress({
      name: 'mainPoolComptroller',
      chainId: CHAIN_ID,
    });

    expect(address).toBe(uniqueContractInfos.mainPoolComptroller.address[CHAIN_ID]);
  });

  it('returns undefined when contract does not exist for the chainId argument passed', () => {
    const address = getUniqueContractAddress({
      name: 'mainPoolComptroller',
      chainId: 1 as ChainId,
    });

    expect(address).toBe(undefined);
  });
});
