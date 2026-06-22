import BigNumber from 'bignumber.js';

import { useGetBalanceOf, useStakeIntoInstitutionalVault } from 'clients/api';
import { NoticeInfo } from 'components';
import { NULL_ADDRESS } from 'constants/address';
import { Link } from 'containers/Link';
import { TransactionForm } from 'containers/TransactionForm';
import { useForm } from 'containers/useForm';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { InstitutionalVault } from 'types';
import { convertMantissaToTokens, convertTokensToMantissa } from 'utilities';

import { routes } from 'constants/routing';
import { Footer } from '../Footer';

export interface DepositFormProps {
  vault: InstitutionalVault;
  onClose: () => void;
}

export const DepositForm: React.FC<DepositFormProps> = ({ vault, onClose }) => {
  const { t, Trans } = useTranslation();
  const { accountAddress } = useAccountAddress();

  const { data: walletBalanceData } = useGetBalanceOf(
    {
      accountAddress: accountAddress || NULL_ADDRESS,
      token: vault.stakedToken,
    },
    {
      enabled: !!accountAddress,
    },
  );

  const walletBalanceTokens = convertMantissaToTokens({
    value: walletBalanceData?.balanceMantissa || new BigNumber(0),
    token: vault.stakedToken,
  });

  const remainingCapacityTokens = convertMantissaToTokens({
    value: vault.stakeLimitMantissa.minus(vault.stakeBalanceMantissa),
    token: vault.stakedToken,
  });

  const limitFromTokens = BigNumber.min(walletBalanceTokens, remainingCapacityTokens);

  const minFromTokens =
    vault.userMinIndividualStakeMantissa &&
    convertMantissaToTokens({
      value: vault.userMinIndividualStakeMantissa,
      token: vault.stakedToken,
    });

  const form = useForm({
    fromToken: vault.stakedToken,
    limitFromTokens,
    minFromTokens,
  });

  const fromAmountTokens = new BigNumber(form.watch('fromAmountTokens') || 0);

  const { mutateAsync: stake, isPending: isStakeLoading } = useStakeIntoInstitutionalVault({
    vaultAddress: vault.vaultAddress,
  });

  const handleStake = async () => {
    await stake({
      amountMantissa: convertTokensToMantissa({
        value: fromAmountTokens,
        token: vault.stakedToken,
      }),
    });

    onClose();
  };

  return (
    <div className="space-y-4">
      <TransactionForm
        form={form}
        fromToken={vault.stakedToken}
        limitFromTokens={limitFromTokens}
        fromTokenFieldLabel={t('vault.modals.deposit')}
        submitButtonLabel={t('vault.modals.deposit')}
        onSubmit={handleStake}
        fromTokenPriceCents={vault.stakedTokenPriceCents.toNumber()}
        spenderAddress={vault.vaultAddress}
        isLoading={isStakeLoading}
        footer={<Footer vault={vault} fromAmountTokens={fromAmountTokens} />}
        acknowledgement={
          <Trans
            i18nKey="vault.modals.institutionalTcsAgreement"
            components={{
              Link: <Link to={routes.fixedTermVaultTermsOfUse.path} target="_blank" />,
            }}
          />
        }
      />

      {!!accountAddress && <NoticeInfo description={t('vault.modals.institutionalDisclaimer')} />}
    </div>
  );
};
