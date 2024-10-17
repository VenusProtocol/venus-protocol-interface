import BigNumber from 'bignumber.js';
import { MIN_PAYMASTER_BALANCE_MANTISSA } from 'constants/gasLess';
import type { ZyFiVault } from 'libs/contracts';

export interface GetPaymasterInfoInput {
  zyFiVaultContract: ZyFiVault;
  zyFiWalletAddress: string;
}

export type GetPaymasterInfoOutput = {
  balanceMantissa: BigNumber;
  canSponsorTransactions: boolean;
};

export const getPaymasterInfo = async ({
  zyFiVaultContract,
  zyFiWalletAddress,
}: GetPaymasterInfoInput): Promise<GetPaymasterInfoOutput> => {
  const res = await zyFiVaultContract.balances(zyFiWalletAddress);

  const balanceMantissa = new BigNumber(res.toString());
  const canSponsorTransactions = balanceMantissa.gte(MIN_PAYMASTER_BALANCE_MANTISSA);

  return {
    balanceMantissa,
    canSponsorTransactions,
  };
};
