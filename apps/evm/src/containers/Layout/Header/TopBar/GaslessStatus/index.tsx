import { useGetSponsorshipVaultData } from 'clients/api';
import { useTranslation } from 'libs/translations';
import { gasGreen, gasSlashedGreen, useChainId } from 'libs/wallet';
import type { ChainId } from 'types';

const GaslessStatus = ({
  chainId,
  variant,
}: { chainId?: ChainId; variant: 'header' | 'chainSelector' | 'mobile' }) => {
  const { t } = useTranslation();
  const { chainId: chainIdFromHook } = useChainId();
  const { data: sponsorshipVaultData } = useGetSponsorshipVaultData({
    chainId: chainId ?? chainIdFromHook,
  });

  const containerClassName =
    variant === 'header'
      ? 'hidden md:flex flex-row text-green [font-variant:all-small-caps] mr-'
      : 'flex flex-row text-green [font-variant:all-small-caps] ml-1 mr-2';

  return (
    sponsorshipVaultData?.hasEnoughFunds &&
    (variant === 'mobile' ? (
      <div className="block md:hidden">
        <img src={gasSlashedGreen} alt={t('gaslessTransactions.gas')} className="ml-1" />
      </div>
    ) : (
      <div className={containerClassName}>
        <img src={gasGreen} alt={t('gaslessTransactions.gas')} className="mr-1" />
        <span className="hidden md:block">{t('gaslessTransactions.chainLabel')}</span>
      </div>
    ))
  );
};

export default GaslessStatus;
