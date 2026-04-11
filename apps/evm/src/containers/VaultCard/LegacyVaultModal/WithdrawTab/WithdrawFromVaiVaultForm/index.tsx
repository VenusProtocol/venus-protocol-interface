import BigNumber from 'bignumber.js';

import { useGetVaiVaultUserInfo, useWithdrawFromVaiVault } from 'clients/api';
import { NULL_ADDRESS } from 'constants/address';
import { useForm } from 'containers/VaultCard/useForm';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { VenusVault } from 'types';
import { convertMantissaToTokens, convertTokensToMantissa } from 'utilities';
import { Footer } from '../../Footer';
import { TransactionForm } from '../../TransactionForm';

export interface WithdrawFromVaiVaultFormProps {
  vault: VenusVault;
  onClose: () => void;
}

export const WithdrawFromVaiVaultForm: React.FC<WithdrawFromVaiVaultFormProps> = ({
  vault,
  onClose,
}) => {
  const { t } = useTranslation();
  const { accountAddress } = useAccountAddress();

  const fromToken = vault.stakedToken;

  const { data: vaiVaultUserInfo } = useGetVaiVaultUserInfo(
    {
      accountAddress: accountAddress || NULL_ADDRESS,
    },
    {
      enabled: !!accountAddress,
    },
  );

  const limitFromTokens = vaiVaultUserInfo
    ? convertMantissaToTokens({
        value: vaiVaultUserInfo.stakedVaiMantissa,
        token: fromToken,
      })
    : new BigNumber(0);

  const { mutateAsync: withdraw } = useWithdrawFromVaiVault();

  const form = useForm({
    limitFromTokens,
  });

  const fromAmountTokensFieldValue = form.watch('fromAmountTokens');
  const fromAmountTokens = new BigNumber(fromAmountTokensFieldValue || 0);

  const handleSubmit = async () => {
    const amountMantissa = convertTokensToMantissa({
      value: fromAmountTokens,
      token: fromToken,
    });

    // Send request to withdraw
    const res = await withdraw({
      amountMantissa: BigInt(amountMantissa.toFixed()),
    });

    // Close modal
    onClose();

    return res;
  };

  return (
    <TransactionForm
      onSubmit={handleSubmit}
      fromToken={fromToken}
      form={form}
      limitFromTokens={limitFromTokens}
      fromTokenFieldLabel={t('vaultCard.vaultModal.withdrawFromVaiVault.withdrawField.label')}
      submitButtonLabel={t('vaultCard.vaultModal.withdrawFromVaiVault.submitButton.label')}
      fromTokenPriceCents={vault.stakedTokenPriceCents.toNumber()}
      footer={<Footer action="withdraw" vault={vault} fromAmountTokens={fromAmountTokens} />}
    />
  );
};
