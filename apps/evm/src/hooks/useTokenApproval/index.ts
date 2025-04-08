import type BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import { useApproveToken, useGetAllowance, useRevokeSpendingLimit } from 'clients/api';
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

const useTokenApproval = ({
  token,
  spenderAddress,
  accountAddress,
}: UseTokenApprovalInput): UseTokenApprovalOutput => {
  const { data: getTokenAllowanceData, isLoading: isWalletSpendingLimitLoading } = useGetAllowance(
    {
      accountAddress: accountAddress || NULL_ADDRESS,
      spenderAddress: spenderAddress || NULL_ADDRESS,
      token,
    },
    {
      enabled: !!spenderAddress && !!accountAddress && !token.isNative,
    },
  );

  const { mutateAsync: revokeAsync, isPending: isRevokeWalletSpendingLimitLoading } =
    useRevokeSpendingLimit(
      {
        token,
      },
      {
        waitForConfirmation: true,
      },
    );

  const revokeWalletSpendingLimit = async () => {
    if (spenderAddress) {
      return revokeAsync({ spenderAddress });
    }
  };

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

  const { mutateAsync: approveTokenMutation, isPending: isApproveTokenLoading } = useApproveToken({
    waitForConfirmation: true,
  });

  const approveToken = async () => {
    if (!spenderAddress) {
      throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
    }

    await approveTokenMutation({
      spenderAddress,
      tokenAddress: token.address,
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
