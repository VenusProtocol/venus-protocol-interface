/** @jsxImportSource @emotion/react */
import React, { useContext } from 'react';
import BigNumber from 'bignumber.js';

import { TokenId } from 'types';
import { AuthContext } from 'context/AuthContext';
import { getToken } from 'utilities';
import { useTranslation } from 'translation';
import { useGetBalanceOf } from 'clients/api';
import useStakeInVault from 'hooks/useStakeInVault';
import ActionModal, { IActionModalProps } from '../ActionModal';

export interface IStakeModalProps extends Pick<IActionModalProps, 'handleClose'> {
  stakedTokenId: TokenId;
  rewardTokenId: TokenId;
  poolIndex?: number;
}

const StakeModal: React.FC<IStakeModalProps> = ({
  stakedTokenId,
  rewardTokenId,
  poolIndex,
  handleClose,
}) => {
  const { t } = useTranslation();
  const { account } = useContext(AuthContext);
  const stakedTokenSymbol = getToken(stakedTokenId).symbol;

  const { data: availableTokensWei, isLoading: isGetWalletBalanceWeiLoading } = useGetBalanceOf(
    {
      accountAddress: account?.address || '',
      tokenId: stakedTokenId,
    },
    {
      enabled: !!account?.address,
    },
  );

  const { stake, isLoading: isStakeLoading } = useStakeInVault({
    stakedTokenId,
  });

  const handleStake = async (amountWei: BigNumber) => {
    // Send request to stake
    const res = await stake({
      amountWei,
      // account.address has to exist at this point since users are prompted to
      // connect their wallet before they're able to stake
      accountAddress: account?.address || '',
      rewardTokenId,
      poolIndex,
    });

    // Close modal
    handleClose();

    return res;
  };

  return (
    <ActionModal
      title={t('stakeModal.title', { tokenSymbol: stakedTokenSymbol })}
      tokenId={stakedTokenId}
      handleClose={handleClose}
      availableTokensWei={availableTokensWei || new BigNumber(0)}
      isInitialLoading={isGetWalletBalanceWeiLoading}
      onSubmit={handleStake}
      isSubmitting={isStakeLoading}
      connectWalletMessage={t('stakeModal.connectWalletMessage', {
        tokenSymbol: stakedTokenSymbol,
      })}
      tokenNeedsToBeEnabled
      enableTokenMessage={t('stakeModal.enableTokenMessage', { tokenSymbol: stakedTokenSymbol })}
      availableTokensLabel={t('stakeModal.availableTokensLabel', {
        tokenSymbol: stakedTokenSymbol,
      })}
      submitButtonLabel={t('stakeModal.submitButtonLabel')}
      submitButtonDisabledLabel={t('stakeModal.submitButtonDisabledLabel')}
      successfulTransactionTitle={t('stakeModal.successfulTransactionModal.title')}
      successfulTransactionDescription={t('stakeModal.successfulTransactionModal.description')}
    />
  );
};

export default StakeModal;
