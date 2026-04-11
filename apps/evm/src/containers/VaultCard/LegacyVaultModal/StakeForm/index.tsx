import BigNumber from 'bignumber.js';
import { useGetBalanceOf, useStakeInVault } from 'clients/api';
import { Spinner } from 'components';
import { NULL_ADDRESS } from 'constants/address';
import { ConnectWallet } from 'containers/ConnectWallet';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { useMemo } from 'react';
import type { Vault } from 'types';
import TransactionForm from '../TransactionForm';

export interface StakeFormProps {
  vault: Vault;
  onClose: () => void;
}

export const StakeForm: React.FC<StakeFormProps> = ({ vault, onClose }) => {
  const { t } = useTranslation();
  const { accountAddress } = useAccountAddress();

  const { address: xvsVaultContractAddress } = useGetContractAddress({
    name: 'XvsVault',
  });
  const { address: vaiVaultContractAddress } = useGetContractAddress({
    name: 'VaiVault',
  });

  const spenderAddress = useMemo(
    () => (typeof vault.poolIndex === 'number' ? xvsVaultContractAddress : vaiVaultContractAddress),
    [vault.poolIndex, xvsVaultContractAddress, vaiVaultContractAddress],
  );

  const { data: availableTokensData, isLoading: isGetWalletBalanceMantissaLoading } =
    useGetBalanceOf(
      {
        accountAddress: accountAddress || NULL_ADDRESS,
        token: vault.stakedToken,
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
      stakedToken: vault.stakedToken,
      rewardToken: vault.rewardToken,
      poolIndex: vault.poolIndex,
    });

    // Close modal
    onClose();

    return res;
  };

  return (
    <ConnectWallet
      message={t('stakeModal.connectWalletMessage', {
        tokenSymbol: vault.stakedToken.symbol,
      })}
      analyticVariant="vault_stake_modal"
    >
      {isGetWalletBalanceMantissaLoading ? (
        <Spinner />
      ) : (
        <TransactionForm
          token={vault.stakedToken}
          spenderAddress={spenderAddress}
          tokenNeedsToBeApproved
          availableTokensMantissa={availableTokensData?.balanceMantissa || new BigNumber(0)}
          onSubmit={handleStake}
          isSubmitting={isStakeLoading}
          availableTokensLabel={t('stakeModal.availableTokensLabel', {
            tokenSymbol: vault.stakedToken.symbol,
          })}
          submitButtonLabel={t('stakeModal.submitButtonLabel')}
          submitButtonDisabledLabel={t('stakeModal.submitButtonDisabledLabel')}
        />
      )}
    </ConnectWallet>
  );
};
