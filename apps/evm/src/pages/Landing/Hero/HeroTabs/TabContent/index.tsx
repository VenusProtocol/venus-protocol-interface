import { cn } from '@venusprotocol/ui';

import { InfoIcon, TokenIconWithSymbol } from 'components';
import { VENUS_DOC_URL } from 'constants/production';
import { Link } from 'containers/Link';
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
  asset: Asset;
  type: 'supply' | 'borrow';
}

export const TabContent: React.FC<TabContentProps> = ({ asset, type }) => {
  const { t, Trans } = useTranslation();

  const combinedApys = getCombinedDistributionApys({ asset, usePrimeMax: true });

  const readableApy = formatPercentageToReadableValue(
    type === 'supply'
      ? combinedApys.totalSupplyApyPercentage
      : combinedApys.totalBorrowApyPercentage,
  );

  const readableBaseAmount = formatCentsToReadableValue({
    value: BASE_AMOUNT_CENTS,
    shorten: false,
  });

  return (
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
        <TokenIconWithSymbol token={asset.vToken.underlyingToken} className="sm:hidden" />

        <TokenIconWithSymbol
          token={asset.vToken.underlyingToken}
          size="lg"
          className="hidden sm:flex"
        />

        <div className="flex items-center text-light-grey gap-1.5 text-b1s sm:text-p2s">
          <span>{readableBaseAmount}</span>

          <InfoIcon
            className="cursor-pointer"
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
  );
};
