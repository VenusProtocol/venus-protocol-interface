import type { Address } from 'viem';

import { TokenIcon } from 'components';
import { PLACEHOLDER_KEY } from 'constants/placeholders';
import { routes } from 'constants/routing';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';
import { useChainId } from 'libs/wallet';
import { type Token, VaultVenue } from 'types';
import { generateExplorerUrl, truncateAddress } from 'utilities';
import { Row } from './Row';

export interface VaultOverviewMarketInfoProps {
  vaultDeploymentDate?: Date;
  contractAddress?: Address;
  venue: string;
  venueName: string;
  venueIconSrc: string;
  venueUrl?: string;
  copyAddress?: Address;
  collateralToken?: Token;
}

export const VaultOverviewMarketInfo: React.FC<VaultOverviewMarketInfoProps> = ({
  vaultDeploymentDate,
  contractAddress,
  venue,
  venueName,
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

  const contractAddressUrl =
    contractAddress && generateExplorerUrl({ hash: contractAddress, chainId });

  return (
    <div className="flex flex-col gap-5">
      <p className="text-p2s text-white flex-1 pb-2">{t('vault.modals.overview.marketInfo')}</p>

      <div className="flex flex-col gap-3">
        <Row label={t('vault.modals.overview.vaultDeploymentDate')}>{formattedDeploymentDate}</Row>

        {!!contractAddress && !!contractAddressUrl && (
          <Row label={t('vault.modals.overview.contractAddress')} url={contractAddressUrl}>
            {truncateAddress(contractAddress)}
          </Row>
        )}

        {!!venueName && !!venueIconSrc && (
          <Row
            label={t('vault.modals.overview.venue')}
            tooltip={t('vault.modals.overview.venueTooltip')}
            url={venueUrl}
            address={copyAddress}
          >
            <div className="flex items-center text-b1r">
              <img
                src={venueIconSrc}
                className="mr-2 h-5 w-5"
                alt={t('vault.modals.overview.vaultVenueIcon')}
              />
              {venueName}
            </div>
          </Row>
        )}

        {collateralToken && !!collateralUrl && (
          <Row
            label={t('vault.modals.overview.collateral')}
            url={collateralUrl}
            address={collateralToken.address}
          >
            <div className="flex items-center text-b1r">
              <TokenIcon token={collateralToken} className="mr-2 h-5 w-5" />
              {collateralToken.symbol}
            </div>
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
