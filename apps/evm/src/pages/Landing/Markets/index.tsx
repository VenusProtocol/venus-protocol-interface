import { cn } from '@venusprotocol/ui';

import { useGetPool } from 'clients/api';
import { ButtonWrapper, Icon } from 'components';
import { Link } from 'containers/Link';
import { MarketTable } from 'containers/MarketTable';
import { useIsMdDown, useIsSmDown } from 'hooks/responsive';
import { useChain } from 'hooks/useChain';
import { useGetMarketsPagePath } from 'hooks/useGetMarketsPagePath';
import { useTranslation } from 'libs/translations';
import { compareBigNumbers } from 'utilities';

export interface MarketsProps {
  className?: string;
}

export const Markets: React.FC<MarketsProps> = ({ className }) => {
  const { t } = useTranslation();
  const { corePoolComptrollerContractAddress } = useChain();
  const isSm = useIsSmDown();
  const isMd = useIsMdDown();

  const { marketsPagePath } = useGetMarketsPagePath();

  const { data: getLegacyPoolData } = useGetPool({
    poolComptrollerAddress: corePoolComptrollerContractAddress,
  });
  const pool = getLegacyPoolData?.pool;
  const assets = pool?.assets || [];

  const total = isSm ? 3 : isMd ? 4 : 6;

  // Extract top 6 assets by supply balance
  const topAssets = [...assets]
    .sort((assetA, assetB) =>
      compareBigNumbers(assetA.supplyBalanceCents, assetB.supplyBalanceCents, 'desc'),
    )
    .slice(0, total);

  if (!pool) {
    // TODO: display loader (?)
    return undefined;
  }

  return (
    <div className={cn('flex flex-col gap-6 w-full', className)}>
      <h2 className="text-2xl">{t('landing.markets.title')}</h2>

      <MarketTable
        controls={false}
        selectVariant="quaternary"
        className="border-0 p-0"
        breakpoint="md"
        poolName={pool.name}
        poolComptrollerContractAddress={pool.comptrollerAddress}
        assets={topAssets}
        columns={[
          'assetAndChain',
          'supplyBalance',
          'labeledSupplyApy',
          'labeledBorrowApy',
          'liquidity',
        ]}
      />

      <ButtonWrapper
        className="flex justify-self-center grow-0 bg-dark-blue-disabled border-dark-blue-disabled text-light-grey hover:bg-blue hover:border-blue hover:text-white active:bg-blue active:border-blue active:text-white mx-auto"
        rounded
        asChild
      >
        <Link to={marketsPagePath} noStyle>
          <div className="flex items-center gap-x-3">
            <span>{t('landing.markets.button.label')}</span>

            <Icon name="link" className="text-inherit" />
          </div>
        </Link>
      </ButtonWrapper>
    </div>
  );
};
