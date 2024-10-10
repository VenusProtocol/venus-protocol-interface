import { useGetSponsorshipVaultData } from 'clients/api';
import { useTranslation } from 'libs/translations';
import { gasGreen, useChainId } from 'libs/wallet';
import type { ChainId } from 'types';

const GaslessStatus = ({
  chainId,
  variant,
}: { chainId?: ChainId; variant: 'header' | 'chainSelector' }) => {
  const { t } = useTranslation();
  const { chainId: chainIdFromHook } = useChainId();
  const { data: sponsorshipVaultData } = useGetSponsorshipVaultData({
    chainId: chainId ?? chainIdFromHook,
  });

  const containerClassName =
    variant === 'header'
      ? 'hidden md:flex flex-row text-green [font-variant:all-small-caps] mr-4'
      : 'flex flex-row text-green [font-variant:all-small-caps] ml-1 mr-2';

  return sponsorshipVaultData?.hasEnoughFunds ? (
    <span className={containerClassName}>
      <img src={gasGreen} alt={t('gaslessTransactions.gas')} className="mr-1" />
      {t('gaslessTransactions.chainLabel')}
    </span>
  ) : null;
};

export default GaslessStatus;
