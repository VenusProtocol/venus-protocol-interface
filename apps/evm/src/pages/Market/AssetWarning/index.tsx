import { TextButton } from '@venusprotocol/ui';
import { useState } from 'react';

import { useTranslation } from 'libs/translations';
import type { Asset, Pool, Token } from 'types';
import { scrollToElement } from 'utilities';

import { Modal, Notice } from 'components';
import { MarketTable } from 'containers/MarketTable';
import { useBreakpointUp } from 'hooks/responsive';
import { getDescription } from './getDescription';
import TEST_IDS from './testIds';

export interface AssetWarningProps extends React.HTMLAttributes<HTMLDivElement> {
  token: Token;
  asset: Asset;
  pool: Pool;
  className?: string;
}

export const AssetWarning: React.FC<AssetWarningProps> = ({
  pool,
  asset,
  className,
  ...otherProps
}) => {
  const [showAssets, setShowAssets] = useState(false);
  const { Trans, t } = useTranslation();
  const isSmOrUp = useBreakpointUp('sm');

  const handleShowAssets = () => setShowAssets(true);
  const handleHideAssets = () => setShowAssets(false);
  const tokenSymbol = asset.vToken.underlyingToken.symbol;
  const handleScrollToModeInfo = () => scrollToElement('mode-info');

  const showAllMarketsButton = (
    <TextButton className="p-0 h-auto font-medium text-xs md:text-sm" onClick={handleShowAssets} />
  );

  const modeInfoButton = (
    <TextButton
      className="p-0 h-auto font-medium text-xs md:text-sm"
      onClick={handleScrollToModeInfo}
    />
  );
  const description = getDescription({
    asset,
    pool,
    tokenSymbol,
    Trans,
    showAllMarketsButton,
    modeInfoButton,
  });

  if (!description) {
    return undefined;
  }

  return (
    <div className={className} {...otherProps}>
      <Notice description={description} />

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
          columns={['asset', 'supplyApy', 'liquidity']}
          size="sm"
          initialOrder={{
            orderBy: 'supplyApy',
            orderDirection: 'asc',
          }}
        />
      </Modal>
    </div>
  );
};

export default AssetWarning;
