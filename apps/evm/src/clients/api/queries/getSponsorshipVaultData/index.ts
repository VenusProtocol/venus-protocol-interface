import BigNumber from 'bignumber.js';
import config from 'config';
import { type createPublicClient, parseAbi } from 'viem';

export interface GetSponsorshipVaultDataInput {
  publicClient: ReturnType<typeof createPublicClient>;
}

export type GetSponsorshipVaultDataOutput = {
  amountLeft: BigNumber;
  hasEnoughFunds: boolean;
};

const getSponsorshipVaultData = async ({
  publicClient,
}: GetSponsorshipVaultDataInput): Promise<GetSponsorshipVaultDataOutput> => {
  const { vaultAddress, walletAddress } = config.zyFi;

  const res = await publicClient.readContract({
    address: vaultAddress,
    // TODO: add ABI to contracts package config
    abi: parseAbi(['function balances(address addr) view returns (uint256)']),
    functionName: 'balances',
    args: [walletAddress],
  });

  const amountLeft = new BigNumber(res.toString());
  const hasEnoughFunds = amountLeft.gt(new BigNumber(10).pow(14));

  return {
    amountLeft,
    hasEnoughFunds,
  };
};

export default getSponsorshipVaultData;
