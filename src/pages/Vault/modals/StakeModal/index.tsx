/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import { useGetVaiVaultContractAddress, useGetXvsVaultContractAddress } from 'packages/contracts';
import { useTranslation } from 'packages/translations';
import React from 'react';
import { Token } from 'types';

import { useGetBalanceOf, useStakeInVault } from 'clients/api';
import { useAuth } from 'context/AuthContext';

import ActionModal, { ActionModalProps } from '../ActionModal';

export interface StakeModalProps extends Pick<ActionModalProps, 'handleClose'> {
  stakedToken: Token;
  rewardToken: Token;
  poolIndex?: number;
}

const StakeModal: React.FC<StakeModalProps> = ({
  stakedToken,
  rewardToken,
  poolIndex,
  handleClose,
}) => {
  const { t } = useTranslation();
  const { accountAddress } = useAuth();

  const xvsVaultContractAddress = useGetXvsVaultContractAddress();
  const vaiVaultContractAddress = useGetVaiVaultContractAddress();

  const spenderAddress = React.useMemo(
    () => (typeof poolIndex === 'number' ? xvsVaultContractAddress : vaiVaultContractAddress),
    [poolIndex, xvsVaultContractAddress, vaiVaultContractAddress],
  );

  const { data: availableTokensData, isLoading: isGetWalletBalanceWeiLoading } = useGetBalanceOf(
    {
      accountAddress: accountAddress || '',
      token: stakedToken,
    },
    {
      enabled: !!accountAddress,
    },
  );

  const { stake, isLoading: isStakeLoading } = useStakeInVault({
    stakedToken,
    rewardToken,
    poolIndex,
  });

  const handleStake = async (amountWei: BigNumber) => {
    // Send request to stake
    const res = await stake({
      amountWei,
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
      tokenNeedsToBeApproved
      spenderAddress={spenderAddress}
      availableTokensLabel={t('stakeModal.availableTokensLabel', {
        tokenSymbol: stakedToken.symbol,
      })}
      submitButtonLabel={t('stakeModal.submitButtonLabel')}
      submitButtonDisabledLabel={t('stakeModal.submitButtonDisabledLabel')}
    />
  );
};

export default StakeModal;
