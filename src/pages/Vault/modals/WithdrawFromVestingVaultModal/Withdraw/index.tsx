/** @jsxImportSource @emotion/react */
import React, { useContext, useMemo } from 'react';
import BigNumber from 'bignumber.js';
import isBefore from 'date-fns/isBefore';

import TEST_IDS from 'constants/testIds';
import { AuthContext } from 'context/AuthContext';
import { TOKENS } from 'constants/tokens';
import { TokenId } from 'types';
import { getToken } from 'utilities';
import useConvertWeiToReadableTokenString from 'hooks/useConvertWeiToReadableTokenString';
import { useTranslation } from 'translation';
import { useGetXvsVaultWithdrawalRequests, useExecuteWithdrawalFromXvsVault } from 'clients/api';
import { ConnectWallet, Spinner, LabeledInlineContent, PrimaryButton } from 'components';
import { useStyles } from './styles';

export interface WithdrawProps {
  stakedTokenId: TokenId;
  poolIndex: number;
  handleClose: () => void;
}

const Withdraw: React.FC<WithdrawProps> = ({ stakedTokenId, poolIndex, handleClose }) => {
  const { account } = useContext(AuthContext);
  const { t } = useTranslation();
  const styles = useStyles();
  const stakedToken = getToken(stakedTokenId);

  const {
    data: xvsVaultUserWithdrawalRequests = [],
    isLoading: isGetXvsVaultUserWithdrawalRequestsLoading,
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

  const withdrawableWei = useMemo(() => {
    const now = new Date();

    return xvsVaultUserWithdrawalRequests.reduce(
      (acc, xvsVaultUserWithdrawalRequest) =>
        isBefore(xvsVaultUserWithdrawalRequest.unlockedAt, now)
          ? acc.plus(xvsVaultUserWithdrawalRequest.amountWei)
          : acc,
      new BigNumber(0),
    );
  }, [JSON.stringify(xvsVaultUserWithdrawalRequests)]);

  const readableWithdrawableTokens = useConvertWeiToReadableTokenString({
    valueWei: withdrawableWei,
    tokenId: stakedTokenId,
    minimizeDecimals: true,
  });

  const {
    mutateAsync: executeWithdrawalFromXvsVault,
    isLoading: isExecutingWithdrawalFromXvsVault,
  } = useExecuteWithdrawalFromXvsVault({
    stakedTokenId,
  });

  const isInitialLoading = isGetXvsVaultUserWithdrawalRequestsLoading;

  const handleSubmit = async () => {
    const res = await executeWithdrawalFromXvsVault({
      poolIndex,
      // account has to be defined at this stage since we don't display the form
      // if no account is connected
      fromAccountAddress: account?.address || '',
      rewardTokenAddress: TOKENS.xvs.address,
    });

    // Close modal on success
    handleClose();

    return res;
  };

  return (
    <ConnectWallet
      message={t('withdrawFromVestingVaultModalModal.withdrawTab.enableToken.connectWalletMessage')}
    >
      {isInitialLoading || !xvsVaultUserWithdrawalRequests ? (
        <Spinner />
      ) : (
        <>
          <LabeledInlineContent
            css={styles.content}
            iconName={stakedTokenId}
            data-testid={TEST_IDS.vault.vaultItem.withdrawFromVestingVaultModal.availableTokens}
            label={t('withdrawFromVestingVaultModalModal.withdrawTab.availableTokens', {
              tokenSymbol: stakedToken.symbol,
            })}
          >
            {readableWithdrawableTokens}
          </LabeledInlineContent>

          <PrimaryButton
            type="submit"
            onClick={handleSubmit}
            loading={isExecutingWithdrawalFromXvsVault}
            disabled={withdrawableWei.isEqualTo(0)}
            fullWidth
          >
            {t('withdrawFromVestingVaultModalModal.withdrawTab.submitButton')}
          </PrimaryButton>
        </>
      )}
    </ConnectWallet>
  );
};

export default Withdraw;
