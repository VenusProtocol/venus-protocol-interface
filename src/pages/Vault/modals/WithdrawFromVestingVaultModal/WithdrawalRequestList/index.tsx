/** @jsxImportSource @emotion/react */
import Typography from '@mui/material/Typography';
import { ConnectWallet, LabeledInlineContent, Spinner } from 'components';
import React, { useContext } from 'react';
import { useTranslation } from 'translation';
import { LockedDeposit, TokenId } from 'types';
import { convertWeiToTokens } from 'utilities';

import { useGetXvsVaultLockedDeposits } from 'clients/api';
import { TOKENS } from 'constants/tokens';
import { AuthContext } from 'context/AuthContext';

import { useStyles } from './styles';
import TEST_IDS from './testIds';

export interface WithdrawalRequestListUiProps {
  isInitialLoading: boolean;
  hasError: boolean;
  userLockedDeposits: LockedDeposit[];
}

const WithdrawalRequestListUi: React.FC<WithdrawalRequestListUiProps> = ({
  isInitialLoading,
  hasError,
  userLockedDeposits,
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
                  iconName={TOKENS.xvs.id as TokenId}
                  data-testid={TEST_IDS.withdrawalRequestListItem}
                  key={`withdrawal-request-list-item-${userLockedDeposit.unlockedAt.getTime()}`}
                  invertTextColors
                  label={convertWeiToTokens({
                    valueWei: userLockedDeposit.amountWei,
                    tokenId: TOKENS.xvs.id as TokenId,
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
  const { account } = useContext(AuthContext);
  const { t } = useTranslation();

  const {
    data: userLockedDeposits = [],
    isLoading: isGetXvsVaultUserLockedDepositsLoading,
    error: getXvsVaultUserLockedDepositsError,
  } = useGetXvsVaultLockedDeposits(
    {
      poolIndex,
      rewardTokenAddress: TOKENS.xvs.address,
      accountAddress: account?.address || '',
    },
    {
      placeholderData: [],
      enabled: !!account?.address,
    },
  );

  return (
    <ConnectWallet
      message={t(
        'withdrawFromVestingVaultModalModal.withdrawalRequestList.enableToken.connectWalletMessage',
      )}
    >
      <WithdrawalRequestListUi
        isInitialLoading={isGetXvsVaultUserLockedDepositsLoading}
        userLockedDeposits={userLockedDeposits}
        hasError={!!getXvsVaultUserLockedDepositsError}
      />
    </ConnectWallet>
  );
};

export default WithdrawalRequestList;
