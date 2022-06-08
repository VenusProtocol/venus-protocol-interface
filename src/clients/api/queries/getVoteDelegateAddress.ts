import { NULL_ADDRESS } from 'constants/address';
import { XvsVault } from 'types/contracts';

export interface IGetVoteDelegateAddressInput {
  xvsVaultContract: XvsVault;
  accountAddress: string;
}

export type GetVoteDelegateAddressOutput = string | undefined;

/**
 *
 * @param address string (valid Ethereum address)
 * @returns Delegated address, if no delegation returns undefined
 */
const getVoteDelegateAddress = async ({
  xvsVaultContract,
  accountAddress,
}: IGetVoteDelegateAddressInput): Promise<GetVoteDelegateAddressOutput> => {
  const resp = await xvsVaultContract.methods.delegates(accountAddress).call();
  return resp !== NULL_ADDRESS ? resp : undefined;
};

export default getVoteDelegateAddress;
