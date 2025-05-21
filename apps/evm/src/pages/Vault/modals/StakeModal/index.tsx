/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import { useGetBalanceOf, useStakeInVault } from 'clients/api';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { Token } from 'types';

import { NULL_ADDRESS } from 'constants/address';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import ActionModal, { type ActionModalProps } from '../ActionModal';

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
  const { accountAddress } = useAccountAddress();

  const { address: xvsVaultContractAddress } = useGetContractAddress({
    name: 'XvsVault',
  });
  const { address: vaiVaultContractAddress } = useGetContractAddress({
    name: 'VaiVault',
  });

  const spenderAddress = useMemo(
    () => (typeof poolIndex === 'number' ? xvsVaultContractAddress : vaiVaultContractAddress),
    [poolIndex, xvsVaultContractAddress, vaiVaultContractAddress],
  );

  const { data: availableTokensData, isLoading: isGetWalletBalanceMantissaLoading } =
    useGetBalanceOf(
      {
        accountAddress: accountAddress || NULL_ADDRESS,
        token: stakedToken,
      },
      {
        enabled: !!accountAddress,
      },
    );

  const { stake, isLoading: isStakeLoading } = useStakeInVault();

  const handleStake = async (amountMantissa: BigNumber) => {
    // Send request to stake
    const res = await stake({
      amountMantissa,
      stakedToken,
      rewardToken,
      poolIndex,
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
      availableTokensMantissa={availableTokensData?.balanceMantissa || new BigNumber(0)}
      isInitialLoading={isGetWalletBalanceMantissaLoading}
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
