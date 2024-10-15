import { useGetSponsorshipVaultData } from 'clients/api';
import { Tooltip } from 'components';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';
import { gasGreen, gasSlashedGreen, useChainId } from 'libs/wallet';
import type { ChainId } from 'types';

const GaslessStatus = ({
  chainId,
  variant,
}: { chainId?: ChainId; variant: 'header' | 'chainSelector' | 'mobile' }) => {
  const { t, Trans } = useTranslation();
  const { chainId: chainIdFromHook } = useChainId();
  const { data: sponsorshipVaultData } = useGetSponsorshipVaultData({
    chainId: chainId ?? chainIdFromHook,
  });

  if (sponsorshipVaultData?.hasEnoughFunds !== true) return null;

  const containerClassName =
    variant === 'header'
      ? 'hidden md:flex flex-row text-green [font-variant:all-small-caps] mr-'
      : 'flex flex-row text-green [font-variant:all-small-caps] ml-1 mr-2';

  if (variant === 'mobile') {
    return (
      <div className="block md:hidden">
        <img src={gasSlashedGreen} alt={t('gaslessTransactions.gas')} className="ml-1" />
      </div>
    );
  }
  if (variant === 'chainSelector') {
    return (
      <div className={containerClassName}>
        <img src={gasGreen} alt={t('gaslessTransactions.gas')} className="mr-1" />
        <span>{t('gaslessTransactions.chainLabel')}</span>
      </div>
    );
  }

  // @TODO: add link to docs
  return (
    <Tooltip
      title={
        <Trans
          i18nKey="gaslessTransactions.tooltip"
          components={{
            Link: <Link href={''} />,
          }}
        />
      }
    >
      <div className={containerClassName}>
        <img src={gasGreen} alt={t('gaslessTransactions.gas')} className="mr-1" />
        <span>{t('gaslessTransactions.chainLabel')}</span>
      </div>
    </Tooltip>
  );
};

export default GaslessStatus;
