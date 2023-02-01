/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import React, { useContext } from 'react';
import { useTranslation } from 'translation';
import { getContractAddress, unsafelyGetToken } from 'utilities';

import { useGetBalanceOf } from 'clients/api';
import { AuthContext } from 'context/AuthContext';
import useStakeInVault from 'hooks/useStakeInVault';

import ActionModal, { ActionModalProps } from '../ActionModal';

export interface StakeModalProps extends Pick<ActionModalProps, 'handleClose'> {
  stakedTokenId: string;
  rewardTokenId: string;
  poolIndex?: number;
}

const StakeModal: React.FC<StakeModalProps> = ({
  stakedTokenId,
  rewardTokenId,
  poolIndex,
  handleClose,
}) => {
  const { t } = useTranslation();
  const { account } = useContext(AuthContext);
  const stakedToken = unsafelyGetToken(stakedTokenId);

  const spenderAddress = React.useMemo(() => {
    if (typeof poolIndex === 'number') {
      return getContractAddress('xvsVault');
    }

    if (stakedTokenId === 'vai') {
      return getContractAddress('vaiVault');
    }

    return getContractAddress('vrtVaultProxy');
  }, [stakedTokenId, poolIndex]);

  const { data: availableTokensData, isLoading: isGetWalletBalanceWeiLoading } = useGetBalanceOf(
    {
      accountAddress: account?.address || '',
      token: stakedToken,
    },
    {
      enabled: !!account?.address,
    },
  );

  const { stake, isLoading: isStakeLoading } = useStakeInVault({
    stakedTokenId,
    rewardTokenId,
    poolIndex,
  });

  const handleStake = async (amountWei: BigNumber) => {
    // Send request to stake
    const res = await stake({
      amountWei,
      // account.address has to exist at this point since users are prompted to
      // connect their wallet before they're able to stake
      accountAddress: account?.address || '',
    });

    // Close modal
    handleClose();

    return res;
  };

  return (
    <ActionModal
      title={t('stakeModal.title', { tokenSymbol: stakedToken.symbol })}
      token={stakedToken}
      handleClose={handleClose}
      availableTokensWei={availableTokensData?.balanceWei || new BigNumber(0)}
      isInitialLoading={isGetWalletBalanceWeiLoading}
      onSubmit={handleStake}
      isSubmitting={isStakeLoading}
      connectWalletMessage={t('stakeModal.connectWalletMessage', {
        tokenSymbol: stakedToken.symbol,
      })}
      tokenNeedsToBeEnabled
      enableTokenMessage={t('stakeModal.enableTokenMessage', { tokenSymbol: stakedToken.symbol })}
      spenderAddress={spenderAddress}
      availableTokensLabel={t('stakeModal.availableTokensLabel', {
        tokenSymbol: stakedToken.symbol,
      })}
      submitButtonLabel={t('stakeModal.submitButtonLabel')}
      submitButtonDisabledLabel={t('stakeModal.submitButtonDisabledLabel')}
      successfulTransactionTitle={t('stakeModal.successfulTransactionModal.title')}
      successfulTransactionDescription={t('stakeModal.successfulTransactionModal.description')}
    />
  );
};

export default StakeModal;
