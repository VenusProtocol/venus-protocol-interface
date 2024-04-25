import { useMemo } from 'react';

import { Button, Card, SecondaryButton } from 'components';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import useOperationModal from 'hooks/useOperationModal';
import { useTranslation } from 'libs/translations';
import { InterestRateChart } from 'pages/Market/Market/InterestRateChart';
import { MarketHistory } from 'pages/Market/Market/MarketHistory';
import MarketInfo from 'pages/Market/Market/MarketInfo';
import type { Asset, Pool } from 'types';
import TEST_IDS from '../testIds';

export interface MarketProps {
  pool: Pool;
  asset: Asset;
}

export const Market: React.FC<MarketProps> = ({ asset, pool }) => {
  const { t } = useTranslation();

  const isMarketHistoryFeatureEnabled = useIsFeatureEnabled({
    name: 'marketHistory',
  });

  const { openOperationModal, OperationModal } = useOperationModal();

  const { isBorrowActionEnabled, isSupplyActionEnabled } = useMemo(() => {
    let tmpIsBorrowActionEnabled = true;
    let tmpIsSupplyActionEnabled = true;

    asset.disabledTokenActions.forEach(disabledTokenAction => {
      if (disabledTokenAction === 'borrow') {
        tmpIsBorrowActionEnabled = false;
      } else if (disabledTokenAction === 'supply') {
        tmpIsSupplyActionEnabled = false;
      }
    });

    return {
      isBorrowActionEnabled: tmpIsBorrowActionEnabled,
      isSupplyActionEnabled: tmpIsSupplyActionEnabled,
    };
  }, [asset.disabledTokenActions]);
  const isSupplyOrBorrowEnabled = isSupplyActionEnabled || isBorrowActionEnabled;

  const buttonsDom = (
    <div className="flex items-center space-x-4">
      {isSupplyActionEnabled && (
        <Button
          className="w-full"
          onClick={() =>
            openOperationModal({
              vToken: asset.vToken,
              poolComptrollerAddress: pool.comptrollerAddress,
              initialActiveTabIndex: 0,
            })
          }
        >
          {t('market.supplyButtonLabel')}
        </Button>
      )}
      {isBorrowActionEnabled && (
        <SecondaryButton
          className="w-full"
          onClick={() =>
            openOperationModal({
              vToken: asset.vToken,
              poolComptrollerAddress: pool.comptrollerAddress,
              initialActiveTabIndex: 2,
            })
          }
        >
          {t('market.borrowButtonLabel')}
        </SecondaryButton>
      )}
    </div>
  );

  return (
    <>
      <div className="space-y-6 xl:grid xl:grid-cols-3 xl:gap-8 xl:space-y-0">
        {isSupplyOrBorrowEnabled && <Card className="xl:hidden">{buttonsDom}</Card>}

        <div className="space-y-6 xl:col-span-2 xl:mt-0">
          {isMarketHistoryFeatureEnabled && <MarketHistory asset={asset} />}

          <InterestRateChart asset={asset} isIsolatedPoolMarket={pool.isIsolated} />
        </div>

        <div className="xl:col-span-1 xl:space-y-6">
          {isSupplyOrBorrowEnabled && <Card className="hidden xl:block">{buttonsDom}</Card>}

          <MarketInfo asset={asset} testId={TEST_IDS.marketInfo} />
        </div>
      </div>

      <OperationModal />
    </>
  );
};

export default Market;
