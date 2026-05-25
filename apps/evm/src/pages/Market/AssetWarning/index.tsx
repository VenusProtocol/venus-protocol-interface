import { useState } from 'react';

import { useTranslation } from 'libs/translations';
import type { Asset, Pool, Token } from 'types';

import { Modal, Notice, TextButton } from 'components';
import { MarketTable } from 'containers/MarketTable';
import { useBreakpointUp } from 'hooks/responsive';
import { SupplyNotification } from './SupplyNotification';
import TEST_IDS from './testIds';
import type { WarningType } from './types';

export interface AssetWarningProps extends React.HTMLAttributes<HTMLDivElement> {
  type: WarningType;
  token: Token;
  asset: Asset;
  pool?: Pool;
  className?: string;
}

export const AssetWarning: React.FC<AssetWarningProps> = ({
  pool,
  asset,
  token,
  type,
  className,
  ...otherProps
}) => {
  const [showAssets, setShowAssets] = useState(false);
  const { t, Trans } = useTranslation();
  const isSmOrUp = useBreakpointUp('sm');

  const handleShowAssets = () => setShowAssets(true);
  const handleHideAssets = () => setShowAssets(false);

  if (!pool) {
    return null;
  }

  const description =
    type === 'supply' ? (
      <SupplyNotification asset={asset} pool={pool} onShowAllMarkets={handleShowAssets} />
    ) : (
      <Trans
        i18nKey="assetWarning.borrowDescription"
        values={{ poolName: pool.name, tokenSymbol: token.symbol }}
        components={{
          Button: (
            <TextButton
              className="p-0 h-auto font-medium text-xs md:text-sm"
              onClick={handleShowAssets}
            />
          ),
        }}
      />
    );

  return (
    <div className={className} {...otherProps}>
      <Notice className="mb-2" description={description} />

      <Modal
        isOpen={showAssets}
        handleClose={handleHideAssets}
        noHorizontalPadding={isSmOrUp}
        title={t('assetWarning.modalTitle', {
          poolName: pool.name,
        })}
      >
        <MarketTable
          data-testid={TEST_IDS.marketTable}
          rowOnClick={handleHideAssets}
          rowControl={false}
          variant="secondary"
          selectVariant="quaternary"
          breakpoint="sm"
          className="my-0 p-0 border-0 sm:p-0"
          poolName={pool.name}
          poolComptrollerContractAddress={pool.comptrollerAddress}
          assets={pool.assets}
          userEModeGroup={pool.userEModeGroup}
          eModeGroups={pool.eModeGroups}
          columns={['asset', type === 'borrow' ? 'labeledBorrowApy' : 'supplyApy', 'liquidity']}
          size="sm"
          initialOrder={{
            orderBy: type === 'borrow' ? 'labeledBorrowApy' : 'supplyApy',
            orderDirection: type === 'supply' ? 'desc' : 'asc',
          }}
        />
      </Modal>
    </div>
  );
};

export default AssetWarning;
