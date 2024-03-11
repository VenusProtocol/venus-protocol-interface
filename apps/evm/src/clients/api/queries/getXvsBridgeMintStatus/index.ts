import BigNumber from 'bignumber.js';

import type { XvsTokenMultichain } from 'libs/contracts';

export interface GetXvsMintStatusInput {
  chainXvsProxyOftDestContractAddress: string;
  xvsTokenMultichainContract: XvsTokenMultichain;
}

export interface GetXvsMintStatusOutput {
  minterToCapMantissa: BigNumber;
  bridgeAmountMintedMantissa: BigNumber;
}

const getXvsBridgeMintStatus = async ({
  chainXvsProxyOftDestContractAddress,
  xvsTokenMultichainContract,
}: GetXvsMintStatusInput): Promise<GetXvsMintStatusOutput> => {
  const [minterToCap, bridgeAmountMinted] = await Promise.all([
    xvsTokenMultichainContract.minterToCap(chainXvsProxyOftDestContractAddress),
    xvsTokenMultichainContract.minterToMintedAmount(chainXvsProxyOftDestContractAddress),
  ]);
  return {
    minterToCapMantissa: new BigNumber(minterToCap.toString()),
    bridgeAmountMintedMantissa: new BigNumber(bridgeAmountMinted.toString()),
  };
};

export default getXvsBridgeMintStatus;
