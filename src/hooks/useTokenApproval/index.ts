import BigNumber from 'bignumber.js';
import { VError } from 'errors';
import { ContractReceipt } from 'ethers';
import { useMemo } from 'react';
import { Token } from 'types';
import { convertWeiToTokens } from 'utilities';

import { useApproveToken, useGetAllowance, useRevokeSpendingLimit } from 'clients/api';

export interface UseTokenApprovalInput {
  token: Token;
  spenderAddress?: string;
  accountAddress?: string;
}

export interface UseTokenApprovalOutput {
  isTokenApproved: boolean | undefined; // TODO: remove
  approveToken: () => Promise<ContractReceipt | undefined>;
  revokeWalletSpendingLimit: () => Promise<ContractReceipt | undefined>;
  isApproveTokenLoading: boolean;
  isRevokeWalletSpendingLimitLoading: boolean;
  isWalletSpendingLimitLoading: boolean;
  walletSpendingLimitTokens?: BigNumber;
}

// TODO: add tests

const useTokenApproval = ({
  token,
  spenderAddress,
  accountAddress,
}: UseTokenApprovalInput): UseTokenApprovalOutput => {
  const { data: getTokenAllowanceData, isLoading: isWalletSpendingLimitLoading } = useGetAllowance(
    {
      accountAddress: accountAddress || '',
      spenderAddress: spenderAddress || '',
      token,
    },
    {
      enabled: !!spenderAddress && !!accountAddress && !token.isNative,
    },
  );

  const { mutateAsync: revokeAsync, isLoading: isRevokeWalletSpendingLimitLoading } =
    useRevokeSpendingLimit({
      token,
    });

  const revokeWalletSpendingLimit = async () => {
    if (spenderAddress) {
      return revokeAsync({ spenderAddress });
    }
  };

  const walletSpendingLimitTokens = useMemo(
    () =>
      getTokenAllowanceData?.allowanceWei &&
      convertWeiToTokens({ valueWei: getTokenAllowanceData.allowanceWei, token }),
    [getTokenAllowanceData?.allowanceWei],
  );

  const isTokenApproved = useMemo(() => {
    if (token.isNative) {
      return true;
    }

    if (!walletSpendingLimitTokens) {
      return undefined;
    }

    return walletSpendingLimitTokens.isGreaterThan(0);
  }, [token.isNative, walletSpendingLimitTokens]);

  const { mutateAsync: approveTokenMutation, isLoading: isApproveTokenLoading } = useApproveToken({
    token,
  });

  const approveToken = async () => {
    if (!spenderAddress) {
      throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
    }

    return approveTokenMutation({
      spenderAddress,
    });
  };

  return {
    isTokenApproved,
    isWalletSpendingLimitLoading,
    isApproveTokenLoading,
    approveToken,
    revokeWalletSpendingLimit,
    isRevokeWalletSpendingLimitLoading,
    walletSpendingLimitTokens,
  };
};

export default useTokenApproval;
