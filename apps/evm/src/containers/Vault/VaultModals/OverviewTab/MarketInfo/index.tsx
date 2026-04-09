import { Icon, LabeledInlineContent } from 'components';
import { PLACEHOLDER_KEY } from 'constants/placeholders';
import { CopyAddressButton } from 'containers/CopyAddressButton';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';
import { type InstitutionalVault, type PendleVault, VaultManager } from 'types';
import { isInstitutionalVault } from 'utilities';

interface MarketInfoProps {
  vault: PendleVault | InstitutionalVault;
}

export const MarketInfo: React.FC<MarketInfoProps> = ({ vault }) => {
  const { t, Trans } = useTranslation();

  const formattedDeploymentDate = vault.vaultDeploymentDate
    ? t('vault.modals.textualDate', { date: vault.vaultDeploymentDate })
    : PLACEHOLDER_KEY;

  const isInstitutional = isInstitutionalVault(vault);
  const managerLabel = vault.manager === VaultManager.Ceefu ? 'CEFFU' : 'PENDLE';
  const managerIcon = vault.manager === VaultManager.Ceefu ? vault.managerIcon : 'pendle';
  const riskDisclosureKey = isInstitutional
    ? 'vault.modals.overview.institutionalRiskDisclosureText'
    : 'vault.modals.overview.riskDisclosureText';

  return (
    <div className="flex flex-col gap-4">
      <p className="text-p2s text-white flex-1 pb-2">{t('vault.modals.overview.marketInfo')}</p>

      <LabeledInlineContent label={t('vault.modals.overview.vaultDeploymentDate')}>
        {formattedDeploymentDate}
      </LabeledInlineContent>

      <LabeledInlineContent
        label={t('vault.modals.overview.manager')}
        tooltip={t('vault.modals.overview.managerTooltip')}
      >
        <div className="flex items-center gap-2">
          <Icon name={managerIcon} className="size-4" />
          <span className="text-b1r text-white">{managerLabel}</span>
          {vault.managerLink && (
            <Link href={vault.managerLink} target="_blank">
              <Icon
                name="link"
                className="text-light-grey hover:cursor-pointer hover:text-blue active:text-blue"
              />
            </Link>
          )}
          {vault.vaultAddress && (
            <CopyAddressButton address={vault.vaultAddress} className="text-light-grey" />
          )}
        </div>
      </LabeledInlineContent>

      <div className="mt-2">
        <p className="text-b1r text-grey mb-2">
          {t('vault.modals.overview.marketRiskDisclosures')}
        </p>
        <p className="text-b1r text-white">
          <Trans
            i18nKey={riskDisclosureKey}
            components={{
              br: <br />,
            }}
          />
        </p>
      </div>
    </div>
  );
};
