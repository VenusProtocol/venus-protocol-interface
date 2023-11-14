import { NoticeWarning } from 'components';
import { useGetToken } from 'packages/tokens';
import { useTranslation } from 'packages/translations';
import React from 'react';

import { useGetPrimeStatus, useGetPrimeToken } from 'clients/api';
import { useAuth } from 'context/AuthContext';
import useConvertWeiToReadableTokenString from 'hooks/useConvertWeiToReadableTokenString';

import TEST_IDS from './testIds';

export interface PrimeLossWarningNoticeProps {
  poolIndex: number;
}

const PrimeLossWarningNotice: React.FC<PrimeLossWarningNoticeProps> = ({ poolIndex }) => {
  const { accountAddress } = useAuth();

  const { data: getPrimeTokenData } = useGetPrimeToken({
    accountAddress,
  });
  const { data: getPrimeStatusData } = useGetPrimeStatus({
    accountAddress,
  });

  const shouldDisplayPrimeWarning =
    getPrimeTokenData?.exists &&
    !getPrimeTokenData?.isIrrevocable &&
    getPrimeStatusData?.xvsVaultPoolId === poolIndex;

  const xvs = useGetToken({
    symbol: 'XVS',
  });
  const readablePrimeMinimumStakedXvs = useConvertWeiToReadableTokenString({
    valueWei: getPrimeStatusData?.primeMinimumStakedXvsMantissa,
    token: xvs,
  });

  const { t } = useTranslation();

  if (!shouldDisplayPrimeWarning) {
    return null;
  }

  return (
    <NoticeWarning
      data-testid={TEST_IDS.notice}
      className="mb-6 sm:mb-8"
      description={t('withdrawFromVestingVaultModalModal.primeWarning', {
        minimumXvsStake: readablePrimeMinimumStakedXvs,
      })}
    />
  );
};

export default PrimeLossWarningNotice;
