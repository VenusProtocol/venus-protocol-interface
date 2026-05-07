import BigNumber from 'bignumber.js';

import { useGetBalanceOf, useStakeIntoInstitutionalVault } from 'clients/api';
import { NoticeInfo } from 'components';
import { NULL_ADDRESS } from 'constants/address';
import { Link } from 'containers/Link';
import { TransactionForm } from 'containers/VaultCard/TransactionForm';
import { useForm } from 'containers/VaultCard/useForm';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { InstitutionalVault } from 'types';
import { convertMantissaToTokens, convertTokensToMantissa, formatWaitingPeriod } from 'utilities';

import { Footer } from '../Footer';

const CEFFU_TCS_URL = 'https://www.ceffu.com/legal/terms-of-service';

export interface DepositFormProps {
  vault: InstitutionalVault;
  onClose: () => void;
}

export const DepositForm: React.FC<DepositFormProps> = ({ vault, onClose }) => {
  const { t, Trans, language } = useTranslation();
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

  const form = useForm({
    limitFromTokens,
  });

  const fromAmountTokens = new BigNumber(form.watch('fromAmountTokens') || 0);

  const readableLockingPeriod = formatWaitingPeriod({
    waitingPeriodSeconds: vault.lockingPeriodMs ? vault.lockingPeriodMs / 1000 : 0,
    locale: language.locale,
  });

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
              Link: <Link href={CEFFU_TCS_URL} target="_blank" />,
            }}
          />
        }
      />

      {!!accountAddress && (
        <NoticeInfo
          description={t('vault.modals.institutionalDisclaimer', {
            lockingPeriod: readableLockingPeriod,
          })}
        />
      )}
    </div>
  );
};
