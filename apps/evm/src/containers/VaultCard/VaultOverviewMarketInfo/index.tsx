import { Icon, type IconName, LabeledInlineContent } from 'components';
import { PLACEHOLDER_KEY } from 'constants/placeholders';
import { CopyAddressButton } from 'containers/CopyAddressButton';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';

export interface VaultOverviewMarketInfoProps {
  vaultDeploymentDate?: Date;
  manager: string;
  managerIcon: IconName;
  managerLink?: string;
  copyAddress?: string;
}

export const VaultOverviewMarketInfo: React.FC<VaultOverviewMarketInfoProps> = ({
  vaultDeploymentDate,
  manager,
  managerIcon,
  managerLink,
  copyAddress,
}) => {
  const { t, Trans } = useTranslation();

  const formattedDeploymentDate = vaultDeploymentDate
    ? t('vault.modals.textualDate', { date: vaultDeploymentDate })
    : PLACEHOLDER_KEY;

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

          <span className="text-b1r text-white uppercase">{manager}</span>

          {managerLink && (
            <Link href={managerLink} target="_blank">
              <Icon
                name="link"
                className="text-light-grey hover:cursor-pointer hover:text-blue active:text-blue"
              />
            </Link>
          )}

          {copyAddress && <CopyAddressButton address={copyAddress} className="text-light-grey" />}
        </div>
      </LabeledInlineContent>

      <div className="mt-2">
        <p className="text-b1r text-grey mb-2">
          {t('vault.modals.overview.marketRiskDisclosures')}
        </p>

        <p className="text-b1r text-white">
          <Trans
            i18nKey="vault.modals.overview.riskDisclosureText"
            components={{
              br: <br />,
            }}
          />
        </p>
      </div>
    </div>
  );
};
