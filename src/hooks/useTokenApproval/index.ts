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
  approveToken: () => Promise<ContractReceipt | undefined>;
  revokeSpendingLimit: () => Promise<ContractReceipt>;
  isApproveTokenLoading: boolean;
  isRevokeSpendingLimitLoading: boolean;
  isSpendingLimitLoading: boolean;
  spendingLimitTokens?: BigNumber;
}

// TODO: add tests

const useTokenApproval = ({
  token,
  spenderAddress,
  accountAddress,
}: UseTokenApprovalInput): UseTokenApprovalOutput => {
  const { data: getTokenAllowanceData, isLoading: isSpendingLimitLoading } = useGetAllowance(
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

    if (!spendingLimitTokens) {
      return undefined;
    }

    return spendingLimitTokens.isGreaterThan(0);
  }, [token.isNative, spendingLimitTokens]);

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
    isSpendingLimitLoading,
    isApproveTokenLoading,
    approveToken,
    revokeSpendingLimit,
    isRevokeSpendingLimitLoading,
    spendingLimitTokens,
  };
};

export default useTokenApproval;
