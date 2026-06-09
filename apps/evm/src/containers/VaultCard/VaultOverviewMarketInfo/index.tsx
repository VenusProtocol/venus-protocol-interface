import type { Address } from 'viem';

import { PLACEHOLDER_KEY } from 'constants/placeholders';
import { routes } from 'constants/routing';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';
import { useChainId } from 'libs/wallet';
import { type Token, VaultVenue } from 'types';
import { generateExplorerUrl } from 'utilities';
import { Row } from './Row';

export interface VaultOverviewMarketInfoProps {
  vaultDeploymentDate?: Date;
  venue: string;
  venueIconSrc: string;
  venueUrl?: string;
  copyAddress?: Address;
  collateralToken?: Token;
}

export const VaultOverviewMarketInfo: React.FC<VaultOverviewMarketInfoProps> = ({
  vaultDeploymentDate,
  venue,
  venueIconSrc,
  venueUrl,
  copyAddress,
  collateralToken,
}) => {
  const { t, Trans } = useTranslation();
  const { chainId } = useChainId();

  const formattedDeploymentDate = vaultDeploymentDate
    ? t('vault.modals.textualDate', { date: vaultDeploymentDate })
    : PLACEHOLDER_KEY;

  const riskDisclosure =
    venue === VaultVenue.Pendle ? (
      <Trans
        i18nKey="vault.modals.overview.riskDisclosureText.pendle"
        components={{
          br: <br />,
        }}
      />
    ) : (
      <Trans
        i18nKey="vault.modals.overview.riskDisclosureText.matrixDock"
        components={{
          br: <br />,
          TermsOfUseLink: <Link to={routes.fixedTermVaultTermsOfUse.path} target="_blank" />,
          Bold: <span className="font-semibold" />,
        }}
      />
    );

  const collateralUrl =
    collateralToken && generateExplorerUrl({ hash: collateralToken.address, chainId });

  return (
    <div className="flex flex-col gap-5">
      <p className="text-p2s text-white flex-1 pb-2">{t('vault.modals.overview.marketInfo')}</p>

      <div className="flex flex-col gap-3">
        <Row label={t('vault.modals.overview.vaultDeploymentDate')}>{formattedDeploymentDate}</Row>

        <Row
          label={t('vault.modals.overview.venue')}
          tooltip={t('vault.modals.overview.venueTooltip')}
          url={venueUrl}
          address={copyAddress}
        >
          <img src={venueIconSrc} className="h-4" alt={t('vault.modals.overview.vaultVenueIcon')} />
        </Row>

        {collateralToken && !!collateralUrl && (
          <Row
            label={t('vault.modals.overview.collateral')}
            url={collateralUrl}
            address={collateralToken.address}
          >
            <span className="text-light-grey">{collateralToken.symbol}</span>
          </Row>
        )}

        <div className="space-y-3">
          <p className="text-b1r text-grey">{t('vault.modals.overview.marketRiskDisclosures')}</p>

          <p className="text-b1r text-white">{riskDisclosure}</p>
        </div>
      </div>
    </div>
  );
};
