import BigNumber from 'bignumber.js';

import type { XvsTokenOmnichain } from 'libs/contracts';

export interface GetXvsMintStatusInput {
  chainXvsProxyOftDestContractAddress: string;
  xvsTokenOmnichainContract: XvsTokenOmnichain;
}

export interface GetXvsMintStatusOutput {
  minterToCapMantissa: BigNumber;
  bridgeAmountMintedMantissa: BigNumber;
}

const getXvsBridgeMintStatus = async ({
  chainXvsProxyOftDestContractAddress,
  xvsTokenOmnichainContract,
}: GetXvsMintStatusInput): Promise<GetXvsMintStatusOutput> => {
  const [minterToCap, bridgeAmountMinted] = await Promise.all([
    xvsTokenOmnichainContract.minterToCap(chainXvsProxyOftDestContractAddress),
    xvsTokenOmnichainContract.minterToMintedAmount(chainXvsProxyOftDestContractAddress),
  ]);
  return {
    minterToCapMantissa: new BigNumber(minterToCap.toString()),
    bridgeAmountMintedMantissa: new BigNumber(bridgeAmountMinted.toString()),
  };
};

export default getXvsBridgeMintStatus;
