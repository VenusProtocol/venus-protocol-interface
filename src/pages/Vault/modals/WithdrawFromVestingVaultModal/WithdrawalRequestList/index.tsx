/** @jsxImportSource @emotion/react */
import Typography from '@mui/material/Typography';
import { LabeledInlineContent, Spinner } from 'components';
import { useGetToken } from 'packages/tokens';
import React from 'react';
import { useTranslation } from 'translation';
import { LockedDeposit, Token } from 'types';
import { convertWeiToTokens } from 'utilities';

import { useGetXvsVaultLockedDeposits } from 'clients/api';
import { ConnectWallet } from 'containers/ConnectWallet';
import { useAuth } from 'context/AuthContext';

import { useStyles } from './styles';
import TEST_IDS from './testIds';

export interface WithdrawalRequestListUiProps {
  isInitialLoading: boolean;
  hasError: boolean;
  userLockedDeposits: LockedDeposit[];
  xvs: Token;
}

const WithdrawalRequestListUi: React.FC<WithdrawalRequestListUiProps> = ({
  isInitialLoading,
  hasError,
  userLockedDeposits,
  xvs,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();

  return (
    <>
      {isInitialLoading || hasError ? (
        <Spinner />
      ) : (
        <>
          {userLockedDeposits.length === 0 ? (
            <Typography>
              {t('withdrawFromVestingVaultModalModal.withdrawalRequestList.emptyState')}
            </Typography>
          ) : (
            <>
              {userLockedDeposits.map(userLockedDeposit => (
                <LabeledInlineContent
                  css={styles.listItem}
                  iconSrc={xvs}
                  data-testid={TEST_IDS.withdrawalRequestListItem}
                  key={`withdrawal-request-list-item-${userLockedDeposit.unlockedAt.getTime()}`}
                  invertTextColors
                  label={convertWeiToTokens({
                    valueWei: userLockedDeposit.amountWei,
                    token: xvs,
                    returnInReadableFormat: true,
                  })}
                >
                  {t('withdrawFromVestingVaultModalModal.withdrawalRequestList.itemContent', {
                    date: userLockedDeposit.unlockedAt,
                  })}
                </LabeledInlineContent>
              ))}
            </>
          )}
        </>
      )}
    </>
  );
};

export interface WithdrawalRequestListProps {
  poolIndex: number;
}

const WithdrawalRequestList: React.FC<WithdrawalRequestListProps> = ({ poolIndex }) => {
  const { accountAddress } = useAuth();
  const { t } = useTranslation();

  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const {
    data: userLockedDepositsData = {
      lockedDeposits: [],
    },
    isLoading: isGetXvsVaultUserLockedDepositsLoading,
    error: getXvsVaultUserLockedDepositsError,
  } = useGetXvsVaultLockedDeposits(
    {
      poolIndex,
      rewardTokenAddress: xvs!.address,
      accountAddress: accountAddress || '',
    },
    {
      placeholderData: {
        lockedDeposits: [],
      },
      enabled: !!accountAddress,
    },
  );

  return (
    <ConnectWallet
      message={t(
        'withdrawFromVestingVaultModalModal.withdrawalRequestList.approveToken.connectWalletMessage',
      )}
    >
      <WithdrawalRequestListUi
        isInitialLoading={isGetXvsVaultUserLockedDepositsLoading}
        userLockedDeposits={userLockedDepositsData.lockedDeposits}
        hasError={!!getXvsVaultUserLockedDepositsError}
        xvs={xvs!}
      />
    </ConnectWallet>
  );
};

export default WithdrawalRequestList;
