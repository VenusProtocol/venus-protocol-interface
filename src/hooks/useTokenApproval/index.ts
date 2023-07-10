import BigNumber from 'bignumber.js';
import { VError } from 'errors';
import { ContractReceipt } from 'ethers';
import { useMemo } from 'react';
import { Token } from 'types';
import { convertWeiToTokens } from 'utilities';

import fakeContractReceipt from '__mocks__/models/contractReceipt';
import { useApproveToken, useGetAllowance } from 'clients/api';

interface UseTokenApprovalInput {
  token: Token;
  spenderAddress?: string;
  accountAddress?: string;
}

interface UseTokenApprovalOutput {
  isTokenApproved: boolean | undefined; // TODO: remove
  isTokenApprovalStatusLoading: boolean;
  approveToken: () => Promise<ContractReceipt | undefined>;
  revokeSpendingLimit: () => Promise<ContractReceipt>;
  isApproveTokenLoading: boolean;
  isRevokeSpendingLimitLoading: boolean;
  spendingLimitTokens?: BigNumber;
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
      spenderAddress: spenderAddress || '',
      token,
    },
    {
      enabled: !!spenderAddress && !!accountAddress && !token.isNative,
    },
  );

  // TODO: add hook to revoke allowance
  const revokeSpendingLimit = async () => fakeContractReceipt;
  const isRevokeSpendingLimitLoading = false;

  const spendingLimitTokens = useMemo(
    () =>
      getTokenAllowanceData?.allowanceWei &&
      convertWeiToTokens({ valueWei: getTokenAllowanceData.allowanceWei, token }),
    [getTokenAllowanceData?.allowanceWei],
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
    if (!spenderAddress) {
      throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
    }

    return approveTokenMutation({
      spenderAddress,
    });
  };

  return {
    isTokenApproved,
    isTokenApprovalStatusLoading,
    isApproveTokenLoading,
    approveToken,
    revokeSpendingLimit,
    isRevokeSpendingLimitLoading,
    spendingLimitTokens,
  };
};

export default useTokenApproval;
