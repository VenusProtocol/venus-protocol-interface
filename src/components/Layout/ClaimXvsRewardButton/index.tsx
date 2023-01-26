/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import { ContractReceipt } from 'ethers';
import React, { useContext } from 'react';
import { useTranslation } from 'translation';

import { useClaimXvsReward, useGetXvsReward } from 'clients/api';
import { TOKENS } from 'constants/tokens';
import { useAuth } from 'context/AuthContext';
import { DisableLunaUstWarningContext } from 'context/DisableLunaUstWarning';
import useConvertWeiToReadableTokenString from 'hooks/useConvertWeiToReadableTokenString';
import useHandleTransactionMutation from 'hooks/useHandleTransactionMutation';

import { ButtonProps, SecondaryButton } from '../../Button';
import { TokenIcon } from '../../TokenIcon';
import TEST_IDS from '../testIds';
import { useStyles } from './styles';

export interface ClaimXvsRewardButtonProps extends Omit<ButtonProps, 'onClick'> {
  onClaimReward: () => Promise<ContractReceipt | void>;
  amountWei?: BigNumber;
}

export const ClaimXvsRewardButtonUi: React.FC<ClaimXvsRewardButtonProps> = ({
  amountWei,
  onClaimReward,
  ...otherProps
}) => {
  const { t, Trans } = useTranslation();
  const styles = useStyles();

  const handleTransactionMutation = useHandleTransactionMutation();

  const readableAmount = useConvertWeiToReadableTokenString({
    valueWei: amountWei,
    token: TOKENS.xvs,
    minimizeDecimals: true,
  });

  // Check readable amount isn't 0 (since we strip out decimals)
  if (!amountWei || readableAmount.split(' ')[0] === '0') {
    return null;
  }

  const handleClick = () =>
    handleTransactionMutation({
      mutate: onClaimReward,
      successTransactionModalProps: contractReceipt => ({
        title: t('claimXvsRewardButton.successfulTransactionModal.title'),
        content: t('claimXvsRewardButton.successfulTransactionModal.message'),
        amount: {
          valueWei: amountWei,
          token: TOKENS.xvs,
        },
        transactionHash: contractReceipt.transactionHash,
      }),
    });

  return (
    <SecondaryButton
      data-testid={TEST_IDS.claimXvsRewardButton}
      css={styles.button}
      onClick={handleClick}
      {...otherProps}
    >
      <Trans
        i18nKey="claimXvsRewardButton.title"
        components={{
          Icon: <TokenIcon token={TOKENS.xvs} css={styles.icon} />,
        }}
        values={{
          amount: readableAmount,
        }}
      />
    </SecondaryButton>
  );
};

export const ClaimXvsRewardButton: React.FC<ButtonProps> = props => {
  const { account } = useAuth();

  const { hasLunaOrUstCollateralEnabled, openLunaUstWarningModal } = useContext(
    DisableLunaUstWarningContext,
  );

  const { data: xvsRewardData } = useGetXvsReward(
    {
      accountAddress: account?.address || '',
    },
    {
      enabled: !!account?.address,
    },
  );

  const { mutateAsync: claimXvsReward, isLoading: isClaimXvsRewardLoading } = useClaimXvsReward();

  const handleClaim = async () => {
    // Block action is user has LUNA or UST enabled as collateral
    if (hasLunaOrUstCollateralEnabled) {
      openLunaUstWarningModal();
      return;
    }

    return claimXvsReward();
  };

  return (
    <ClaimXvsRewardButtonUi
      amountWei={xvsRewardData?.xvsRewardWei}
      loading={isClaimXvsRewardLoading}
      onClaimReward={handleClaim}
      {...props}
    />
  );
};

export default ClaimXvsRewardButton;
