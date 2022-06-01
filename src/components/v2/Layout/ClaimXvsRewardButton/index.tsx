/** @jsxImportSource @emotion/react */
import React, { useContext } from 'react';
import BigNumber from 'bignumber.js';

import { AuthContext } from 'context/AuthContext';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';
import { useGetXvsReward, useClaimXvsReward } from 'clients/api';
import { useTranslation } from 'translation';
import { TokenId } from 'types';
import { convertWeiToCoins } from 'utilities/common';
import { VError } from 'errors';
import { transactionErrorPhrases } from 'errors/transactionErrorPhrases';
import { toast } from '../../Toast';
import { Icon } from '../../Icon';
import { SecondaryButton, IButtonProps } from '../../Button';
import { useStyles } from './styles';

const XVS_SYMBOL = 'xvs';

export const TEST_ID = 'claim-xvs-reward-button';

export interface IClaimXvsRewardButton extends Omit<IButtonProps, 'onClick'> {
  onClaim: () => Promise<string | undefined>;
  amountWei?: BigNumber;
}

export const ClaimXvsRewardButtonUi: React.FC<IClaimXvsRewardButton> = ({
  amountWei,
  onClaim,
  ...otherProps
}) => {
  const { t, Trans } = useTranslation();
  const styles = useStyles();

  const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();

  if (!amountWei || amountWei.isEqualTo(0)) {
    return null;
  }

  const handleClick = async () => {
    try {
      const transactionHash = await onClaim();
      if (transactionHash) {
        // Display successful transaction modal
        openSuccessfulTransactionModal({
          title: t('claimXvsRewardButton.successfulTransactionModal.title'),
          content: t('claimXvsRewardButton.successfulTransactionModal.message'),
          amount: {
            valueWei: amountWei,
            tokenId: 'xvs' as TokenId,
          },
          transactionHash,
        });
      }
    } catch (error) {
      let { message } = error as Error;
      if (error instanceof VError && error.type === 'transactions') {
        message = transactionErrorPhrases[error.message as keyof typeof transactionErrorPhrases];
      }
      toast.error({
        message,
      });
    }
  };

  const readableAmount = convertWeiToCoins({
    valueWei: amountWei,
    tokenId: XVS_SYMBOL,
    returnInReadableFormat: true,
  });

  return (
    <SecondaryButton
      data-testid={TEST_ID}
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

export const ClaimXvsRewardButton: React.FC<IButtonProps> = props => {
  const { account } = useContext(AuthContext);
  const { data: xvsRewardWei } = useGetXvsReward(account?.address);

  const { mutateAsync: claimXvsReward, isLoading: isClaimXvsRewardLoading } = useClaimXvsReward();

  const handleClaim = async () => {
    if (!account?.address) {
      throw new VError({ type: 'unexpected', code: 'walletNotConnected' });
    }

    const res = await claimXvsReward({
      fromAccountAddress: account.address,
    });
    return res.transactionHash;
  };

  return (
    <ClaimXvsRewardButtonUi
      amountWei={xvsRewardWei}
      loading={isClaimXvsRewardLoading}
      onClaim={handleClaim}
      {...props}
    />
  );
};

export default ClaimXvsRewardButton;
