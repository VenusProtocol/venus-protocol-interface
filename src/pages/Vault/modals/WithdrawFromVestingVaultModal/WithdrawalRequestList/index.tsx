/** @jsxImportSource @emotion/react */
import React, { useContext } from 'react';

import { TokenId } from 'types';
import Typography from '@mui/material/Typography';
import { AuthContext } from 'context/AuthContext';
import { TOKENS } from 'constants/tokens';
import { useTranslation } from 'translation';
import { useGetXvsVaultWithdrawalRequests } from 'clients/api';
import { convertWeiToTokens } from 'utilities';
import { ConnectWallet, Spinner, LabeledInlineContent } from 'components';
import { useStyles } from './styles';

export interface WithdrawalRequestListProps {
  poolIndex: number;
}

// TODO: add tests

const WithdrawalRequestList: React.FC<WithdrawalRequestListProps> = ({ poolIndex }) => {
  const { account } = useContext(AuthContext);
  const { t } = useTranslation();
  const styles = useStyles();

  const {
    data: xvsVaultUserWithdrawalRequests = [],
    isLoading: isGetXvsVaultUserWithdrawalRequestsLoading,
    error: getXvsVaultUserWithdrawalRequestsError,
  } = useGetXvsVaultWithdrawalRequests(
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

  const isInitialLoading = isGetXvsVaultUserWithdrawalRequestsLoading;

  return (
    <ConnectWallet
      message={t(
        'withdrawFromVestingVaultModalModal.withdrawalRequestList.enableToken.connectWalletMessage',
      )}
    >
      {isInitialLoading || getXvsVaultUserWithdrawalRequestsError ? (
        <Spinner />
      ) : (
        <>
          {xvsVaultUserWithdrawalRequests.length === 0 ? (
            <Typography>
              {t('withdrawFromVestingVaultModalModal.withdrawalRequestList.emptyState')}
            </Typography>
          ) : (
            <>
              {xvsVaultUserWithdrawalRequests.map(xvsVaultUserWithdrawalRequest => (
                <LabeledInlineContent
                  css={styles.listItem}
                  iconName={TOKENS.xvs.id as TokenId}
                  key={`withdrawal-request-list-item-${xvsVaultUserWithdrawalRequest.unlockedAt.getTime()}`}
                  invertTextColors
                  label={convertWeiToTokens({
                    valueWei: xvsVaultUserWithdrawalRequest.amountWei,
                    tokenId: TOKENS.xvs.id as TokenId,
                    returnInReadableFormat: true,
                  })}
                >
                  {t('withdrawFromVestingVaultModalModal.withdrawalRequestList.itemContent', {
                    date: xvsVaultUserWithdrawalRequest.unlockedAt,
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

export default WithdrawalRequestList;
