/** @jsxImportSource @emotion/react */
import React, { useContext } from 'react';

import TEST_IDS from 'constants/testIds';
import { TokenId, LockedDeposit } from 'types';
import Typography from '@mui/material/Typography';
import { AuthContext } from 'context/AuthContext';
import { TOKENS } from 'constants/tokens';
import { useTranslation } from 'translation';
import { useGetXvsVaultLockedDeposits } from 'clients/api';
import { convertWeiToTokens } from 'utilities';
import { ConnectWallet, Spinner, LabeledInlineContent } from 'components';
import { useStyles } from './styles';

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
    <ConnectWallet
      message={t(
        'withdrawFromVestingVaultModalModal.withdrawalRequestList.enableToken.connectWalletMessage',
      )}
    >
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
                  data-testid={
                    TEST_IDS.vault.vaultItem.withdrawFromVestingVaultModal.withdrawalRequestListItem
                  }
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
    </ConnectWallet>
  );
};

export interface WithdrawalRequestListProps {
  poolIndex: number;
}

const WithdrawalRequestList: React.FC<WithdrawalRequestListProps> = ({ poolIndex }) => {
  const { account } = useContext(AuthContext);

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
    <WithdrawalRequestListUi
      isInitialLoading={isGetXvsVaultUserLockedDepositsLoading}
      userLockedDeposits={userLockedDeposits}
      hasError={!!getXvsVaultUserLockedDepositsError}
    />
  );
};

export default WithdrawalRequestList;
