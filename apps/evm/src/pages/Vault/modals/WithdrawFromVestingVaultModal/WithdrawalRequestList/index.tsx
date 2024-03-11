/** @jsxImportSource @emotion/react */
import Typography from '@mui/material/Typography';

import { useGetXvsVaultLockedDeposits } from 'clients/api';
import { LabeledInlineContent, Spinner } from 'components';
import { ConnectWallet } from 'containers/ConnectWallet';
import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { LockedDeposit, Token } from 'types';
import { convertMantissaToTokens } from 'utilities';

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
                  label={convertMantissaToTokens({
                    value: userLockedDeposit.amountMantissa,
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
  const { accountAddress } = useAccountAddress();
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
