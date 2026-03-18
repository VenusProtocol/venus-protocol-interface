import { format } from 'date-fns';

import { Icon, LabeledInlineContent } from 'components';
import { CopyAddressButton } from 'containers/CopyAddressButton';
import { useTranslation } from 'libs/translations';
import type { AnyVault, PendleVault, VaultManager } from 'types';

interface MarketInfoProps {
  vault: AnyVault;
}

const isPendleVault = (vault: AnyVault): vault is PendleVault =>
  vault.manager === ('pendle' as VaultManager);

export const MarketInfo: React.FC<MarketInfoProps> = ({ vault }) => {
  const { t } = useTranslation();

  const pendleVault = isPendleVault(vault) ? vault : undefined;

  const deploymentDate = pendleVault?.maturityDate
    ? format(new Date(pendleVault.maturityDate), 'dd MMM yyyy')
    : '-';

  return (
    <div className="flex flex-col gap-4">
      <LabeledInlineContent label={t('pendleModal.overview.vaultDeploymentDate')}>
        {deploymentDate}
      </LabeledInlineContent>

      <LabeledInlineContent label={t('pendleModal.overview.manager')}>
        <div className="flex items-center gap-2">
          <Icon name="pendle" className="size-4" />
          <span className="text-b1r text-white">PENDLE</span>
          {vault.managerAddress && <CopyAddressButton address={vault.managerAddress} />}
        </div>
      </LabeledInlineContent>

      <div className="mt-2">
        <p className="text-b1r text-grey mb-2">{t('pendleModal.overview.marketRiskDisclosures')}</p>
        <p className="text-b1r text-white">{t('pendleModal.overview.riskDisclosureText')}</p>
      </div>
    </div>
  );
};
