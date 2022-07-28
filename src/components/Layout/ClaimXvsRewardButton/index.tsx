/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import { VError } from 'errors';
import React, { useContext } from 'react';
import { useTranslation } from 'translation';
import { TokenId } from 'types';
import type { TransactionReceipt } from 'web3-core/types';

import { useClaimXvsReward, useGetXvsReward } from 'clients/api';
import { AuthContext } from 'context/AuthContext';
import useConvertWeiToReadableTokenString from 'hooks/useConvertWeiToReadableTokenString';
import useHandleTransactionMutation from 'hooks/useHandleTransactionMutation';

import { ButtonProps, SecondaryButton } from '../../Button';
import { Icon } from '../../Icon';
import TEST_IDS from '../testIds';
import { useStyles } from './styles';

const XVS_SYMBOL = 'xvs';

export interface ClaimXvsRewardButtonProps extends Omit<ButtonProps, 'onClick'> {
  onClaimReward: () => Promise<TransactionReceipt>;
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
    tokenId: XVS_SYMBOL,
    minimizeDecimals: true,
  });

  // Check readable amount isn't 0 (since we strip out decimals)
  if (!amountWei || readableAmount.split(' ')[0] === '0') {
    return null;
  }

  const handleClick = () =>
    handleTransactionMutation({
      mutate: onClaimReward,
      successTransactionModalProps: transactionReceipt => ({
        title: t('claimXvsRewardButton.successfulTransactionModal.title'),
        content: t('claimXvsRewardButton.successfulTransactionModal.message'),
        amount: {
          valueWei: amountWei,
          tokenId: 'xvs' as TokenId,
        },
        transactionHash: transactionReceipt.transactionHash,
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
          Icon: <Icon css={styles.icon} name={XVS_SYMBOL} />,
        }}
        values={{
          amount: readableAmount,
        }}
      />
    </SecondaryButton>
  );
};

export const ClaimXvsRewardButton: React.FC<ButtonProps> = props => {
  const { account } = useContext(AuthContext);
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
    if (!account?.address) {
      throw new VError({ type: 'unexpected', code: 'walletNotConnected' });
    }

    return claimXvsReward({
      fromAccountAddress: account.address,
    });
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
