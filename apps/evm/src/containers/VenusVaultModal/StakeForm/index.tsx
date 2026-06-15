import BigNumber from 'bignumber.js';

import { useGetBalanceOf, useStakeInVault } from 'clients/api';
import { NULL_ADDRESS } from 'constants/address';
import { Footer as PrimeRankFooter } from 'containers/PrimeRank/Footer';
import { TransactionForm } from 'containers/VaultCard/TransactionForm';
import { useForm } from 'containers/VaultCard/useForm';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import useTokenApproval from 'hooks/useTokenApproval';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { type Vault, VaultCategory } from 'types';
import { convertMantissaToTokens, convertTokensToMantissa } from 'utilities';
import { Footer } from '../Footer';

export interface StakeFormProps {
  vault: Vault;
  onClose: () => void;
  hidePrimeLeaderboardLink?: boolean;
}

export const StakeForm: React.FC<StakeFormProps> = ({
  vault,
  onClose,
  hidePrimeLeaderboardLink,
}) => {
  const { t } = useTranslation();

  const isPrimeLeaderboardEnabled = useIsFeatureEnabled({ name: 'primeLeaderboard' });
  const showPrimeRankFooter =
    isPrimeLeaderboardEnabled && vault.category === VaultCategory.GOVERNANCE;
  const { accountAddress } = useAccountAddress();

  const fromToken = vault.stakedToken;

  const { address: xvsVaultContractAddress } = useGetContractAddress({
    name: 'XvsVault',
  });
  const { address: vaiVaultContractAddress } = useGetContractAddress({
    name: 'VaiVault',
  });

  const spenderAddress =
    typeof vault.poolIndex === 'number' ? xvsVaultContractAddress : vaiVaultContractAddress;

  const { data: getUserWalletBalanceData } = useGetBalanceOf(
    {
      accountAddress: accountAddress || NULL_ADDRESS,
      token: fromToken,
    },
    {
      enabled: !!accountAddress,
    },
  );

  const userWalletBalanceMantissa = getUserWalletBalanceData?.balanceMantissa;

  const { walletSpendingLimitTokens } = useTokenApproval({
    token: fromToken,
    spenderAddress,
    accountAddress,
  });

  const userWalletBalanceTokens = userWalletBalanceMantissa
    ? convertMantissaToTokens({
        value: userWalletBalanceMantissa,
        token: fromToken,
      })
    : new BigNumber(0);

  const limitFromTokens = userWalletBalanceTokens;

  const form = useForm({
    limitFromTokens,
    walletSpendingLimitTokens,
    fromToken,
  });

  const fromAmountTokensFieldValue = form.watch('fromAmountTokens');
  const fromAmountTokens = new BigNumber(fromAmountTokensFieldValue || 0);

  const { stake } = useStakeInVault();

  const handleSubmit = async () => {
    const amountMantissa = convertTokensToMantissa({
      value: fromAmountTokens,
      token: fromToken,
    });

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
    <TransactionForm
      onSubmit={handleSubmit}
      spenderAddress={spenderAddress}
      fromToken={fromToken}
      form={form}
      limitFromTokens={limitFromTokens}
      fromTokenFieldLabel={t('vaultCard.vaultModal.stakeForm.depositField.label')}
      submitButtonLabel={t('vaultCard.vaultModal.stakeForm.submitButton.label')}
      fromTokenPriceCents={vault.stakedTokenPriceCents.toNumber()}
      footer={
        <div className="flex flex-col gap-4">
          <Footer action="stake" vault={vault} fromAmountTokens={fromAmountTokens} />

          {showPrimeRankFooter && (
            <PrimeRankFooter hideLeaderboardLink={hidePrimeLeaderboardLink} />
          )}
        </div>
      }
    />
  );
};
