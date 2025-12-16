import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import { useApproveToken, useGetAllowance } from 'clients/api';
import { NULL_ADDRESS } from 'constants/address';
import { VError } from 'libs/errors';
import type { Token } from 'types';
import { convertMantissaToTokens } from 'utilities';
import type { Address } from 'viem';

export interface UseTokenApprovalInput {
  token: Token;
  spenderAddress?: Address;
  accountAddress?: Address;
}

export interface UseTokenApprovalOptions {
  enabled?: boolean;
}

export interface UseTokenApprovalOutput {
  isTokenApproved: boolean | undefined;
  approveToken: () => Promise<void>;
  revokeWalletSpendingLimit: () => Promise<unknown>;
  isApproveTokenLoading: boolean;
  isRevokeWalletSpendingLimitLoading: boolean;
  isWalletSpendingLimitLoading: boolean;
  walletSpendingLimitTokens?: BigNumber;
}

// TODO: add tests

const useTokenApproval = (
  { token, spenderAddress, accountAddress }: UseTokenApprovalInput,
  options?: UseTokenApprovalOptions,
): UseTokenApprovalOutput => {
  const { data: getTokenAllowanceData, isLoading: isWalletSpendingLimitLoading } = useGetAllowance(
    {
      accountAddress: accountAddress || NULL_ADDRESS,
      spenderAddress: spenderAddress || NULL_ADDRESS,
      token,
    },
    {
      enabled:
        (options?.enabled === undefined || options.enabled) &&
        !!spenderAddress &&
        !!accountAddress &&
        !token.isNative,
    },
  );

  const { mutateAsync: approveTokenMutation, isPending: isApproveTokenLoading } = useApproveToken({
    waitForConfirmation: true,
  });

  const walletSpendingLimitTokens = useMemo(
    () =>
      getTokenAllowanceData?.allowanceMantissa &&
      convertMantissaToTokens({ value: getTokenAllowanceData.allowanceMantissa, token }),
    [getTokenAllowanceData?.allowanceMantissa, token],
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

  const approveToken = async () => {
    if (!spenderAddress) {
      throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
    }

    await approveTokenMutation({
      spenderAddress,
      tokenAddress: token.address,
    });
  };

  const revokeWalletSpendingLimit = async () => {
    if (!spenderAddress) {
      throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
    }

    return approveTokenMutation({
      spenderAddress,
      tokenAddress: token.address,
      allowanceMantissa: new BigNumber(0),
    });
  };

  return {
    isTokenApproved,
    isWalletSpendingLimitLoading,
    isApproveTokenLoading,
    isRevokeWalletSpendingLimitLoading: isApproveTokenLoading,
    approveToken,
    revokeWalletSpendingLimit,
    walletSpendingLimitTokens,
  };
};

export default useTokenApproval;
