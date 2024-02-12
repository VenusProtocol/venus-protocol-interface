import { NULL_ADDRESS } from 'constants/address';
import { XvsVault } from 'packages/contracts';

export interface GetVoteDelegateAddressInput {
  xvsVaultContract: XvsVault;
  accountAddress: string;
}

export type GetVoteDelegateAddressOutput = {
  delegateAddress: string | undefined;
};

/**
 *
 * @param address string (valid Ethereum address)
 * @returns Delegated address, if no delegation returns undefined
 */
const getVoteDelegateAddress = async ({
  xvsVaultContract,
  accountAddress,
}: GetVoteDelegateAddressInput): Promise<GetVoteDelegateAddressOutput> => {
  const resp = await xvsVaultContract.delegates(accountAddress);

  return {
    delegateAddress: resp !== NULL_ADDRESS ? resp : undefined,
  };
};

export default getVoteDelegateAddress;
