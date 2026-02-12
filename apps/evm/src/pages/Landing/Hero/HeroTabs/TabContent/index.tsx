import { cn } from '@venusprotocol/ui';
import type { Address } from 'viem';

import { ButtonWrapper, InfoIcon, TokenIconWithSymbol } from 'components';
import { VENUS_DOC_URL } from 'constants/production';
import { Link } from 'containers/Link';
import { useMarketPageTo } from 'hooks/useMarketPageTo';
import { useTranslation } from 'libs/translations';
import type { Asset } from 'types';
import {
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
  getCombinedDistributionApys,
} from 'utilities';
import { Row } from '../Row';
import { Earnings } from './Earnings';
import { Interests } from './Interests';
import { BASE_AMOUNT_CENTS } from './constants';

export interface TabContentProps {
  poolComptrollerContractAddress: Address;
  asset: Asset;
  type: 'supply' | 'borrow';
}

export const TabContent: React.FC<TabContentProps> = ({
  poolComptrollerContractAddress,
  asset,
  type,
}) => {
  const { t, Trans } = useTranslation();

  const combinedApys = getCombinedDistributionApys({ asset });

  const readableApy = formatPercentageToReadableValue(
    type === 'supply'
      ? combinedApys.totalSupplyApyPercentage
      : combinedApys.totalBorrowApyPercentage,
  );

  const readableBaseAmount = formatCentsToReadableValue({
    value: BASE_AMOUNT_CENTS,
    shorten: false,
  });

  const { formatMarketPageTo } = useMarketPageTo();

  const to = formatMarketPageTo({
    poolComptrollerContractAddress,
    vTokenAddress: asset.vToken.address,
    tabId: type,
  });

  return (
    <div className="space-y-6">
      <div className="w-full space-y-6">
        <Row className="text-b1s sm:text-p2s">
          <p className="text-light-grey-active">
            {type === 'supply' ? t('landing.hero.highestApy') : t('landing.hero.totalApy')}
          </p>

          <p className={cn('', type === 'supply' ? 'text-green' : 'text-yellow')}>
            {type === 'supply'
              ? t('landing.hero.upToPercentage', {
                  percentage: readableApy,
                })
              : t('landing.hero.from', {
                  percentage: readableApy,
                })}
          </p>
        </Row>

        <Row>
          <TokenIconWithSymbol
            token={asset.vToken.underlyingToken}
            displayChain
            className="sm:hidden"
          />

          <TokenIconWithSymbol
            token={asset.vToken.underlyingToken}
            displayChain
            size="lg"
            className="hidden sm:flex"
          />

          <div className="flex items-center text-light-grey gap-1.5 text-b1s sm:text-p2s">
            <span>{readableBaseAmount}</span>

            <InfoIcon
              tooltip={
                <Trans
                  i18nKey="landing.hero.supplyTips"
                  components={{
                    Link: <Link href={`${VENUS_DOC_URL}/guides/protocol-math`} />,
                  }}
                />
              }
            />
          </div>
        </Row>

        {type === 'supply' ? (
          <Earnings supplyApyPercentage={combinedApys.totalSupplyApyPercentage} />
        ) : (
          <Interests borrowApyPercentage={combinedApys.totalBorrowApyPercentage} />
        )}
      </div>

      <ButtonWrapper asChild className="w-full" variant="tertiary">
        <Link to={to} noStyle>
          {t('landing.hero.startNow')}
        </Link>
      </ButtonWrapper>
    </div>
  );
};
