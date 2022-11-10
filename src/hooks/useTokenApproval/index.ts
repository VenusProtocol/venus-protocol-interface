import { useMemo } from 'react';
import { Token } from 'types';
import type { TransactionReceipt } from 'web3-core/types';

import { useApproveToken, useGetAllowance } from 'clients/api';

interface UseTokenApprovalInput {
  token: Token;
  spenderAddress: string;
  accountAddress?: string;
}

interface UseTokenApprovalOutput {
  isTokenApproved: boolean | undefined;
  isTokenApprovalStatusLoading: boolean;
  approveToken: () => Promise<TransactionReceipt | undefined>;
  isApproveTokenLoading: boolean;
}

// TODO: add tests

const useTokenApproval = ({
  token,
  spenderAddress,
  accountAddress,
}: UseTokenApprovalInput): UseTokenApprovalOutput => {
  const { data: getTokenAllowanceData, isLoading: isTokenApprovalStatusLoading } = useGetAllowance(
    {
      accountAddress: accountAddress || '',
      spenderAddress,
      token,
    },
    {
      enabled: !!accountAddress && !token.isNative,
    },
  );

  const isTokenApproved = useMemo(() => {
    if (token.isNative) {
      return true;
    }

    if (!getTokenAllowanceData) {
      return undefined;
    }

    return getTokenAllowanceData.allowanceWei.isGreaterThan(0);
  }, [token.isNative, getTokenAllowanceData]);

  const { mutateAsync: approveTokenMutation, isLoading: isApproveTokenLoading } = useApproveToken({
    token,
  });

  const approveToken = async () => {
    if (accountAddress) {
      return approveTokenMutation({
        accountAddress,
        spenderAddress,
      });
    }
  };

  return {
    isTokenApproved,
    isTokenApprovalStatusLoading,
    isApproveTokenLoading,
    approveToken,
  };
};

export default useTokenApproval;
