import { format } from 'date-fns';

import { Icon, LabeledInlineContent } from 'components';
import { CopyAddressButton } from 'containers/CopyAddressButton';
import { Link } from 'containers/Link';
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

  const deploymentDate = pendleVault?.vaultDeploymentTime
    ? format(new Date(pendleVault.vaultDeploymentTime), 'dd MMM yyyy')
    : '-';

  return (
    <div className="flex flex-col gap-4">
      <LabeledInlineContent label={t('vaultModals.overview.vaultDeploymentDate')}>
        {deploymentDate}
      </LabeledInlineContent>

      <LabeledInlineContent label={t('vaultModals.overview.manager')}>
        <div className="flex items-center gap-2">
          <Icon name="pendle" className="size-4" />
          <span className="text-b1r text-white">PENDLE</span>
          {'managerLink' in vault && vault.managerLink && (
            <Link href={vault.managerLink} target="_blank">
              <Icon
                name="link"
                className="text-light-grey hover:cursor-pointer hover:text-blue active:text-blue"
              />
            </Link>
          )}
          {'underlyingAssetAddress' in vault && (
            <CopyAddressButton address={vault.underlyingAssetAddress} className="text-light-grey" />
          )}
        </div>
      </LabeledInlineContent>

      <div className="mt-2">
        <p className="text-b1r text-grey mb-2">{t('vaultModals.overview.marketRiskDisclosures')}</p>
        <p className="text-b1r text-white">{t('vaultModals.overview.riskDisclosureText')}</p>
      </div>
    </div>
  );
};
