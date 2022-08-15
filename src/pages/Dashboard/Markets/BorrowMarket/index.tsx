/** @jsxImportSource @emotion/react */
import { Paper } from '@mui/material';
import React, { useContext } from 'react';
import { Asset, TokenId } from 'types';

import { TOKENS } from 'constants/tokens';
import { DisableLunaUstWarningContext } from 'context/DisableLunaUstWarning';
import BorrowRepayModal from 'pages/Dashboard/Modals/BorrowRepay';

import { useStyles } from '../styles';
import BorrowMarketTable, { BorrowMarketTableProps } from './BorrowMarketTable';

export interface BorrowMarketUiProps {
  className?: string;
  borrowMarketAssets: Asset[];
  isXvsEnabled: boolean;
  hasLunaOrUstCollateralEnabled: boolean;
  openLunaUstWarningModal: () => void;
}

export const BorrowMarketUi: React.FC<BorrowMarketUiProps> = ({
  className,
  borrowMarketAssets,
  isXvsEnabled,
  hasLunaOrUstCollateralEnabled,
  openLunaUstWarningModal,
}) => {
  const [selectedAssetId, setSelectedAssetId] = React.useState<Asset['id'] | undefined>(undefined);
  const styles = useStyles();

  const rowOnClick: BorrowMarketTableProps['rowOnClick'] = (_e, row) => {
    const assetId = row[0].value as TokenId;

    // Block action and show warning modal if user has LUNA or UST enabled as
    // collateral and is attempting to open the borrow modal of other assets
    if (hasLunaOrUstCollateralEnabled && assetId !== TOKENS.luna.id && assetId !== TOKENS.ust.id) {
      openLunaUstWarningModal();
      return;
    }

    setSelectedAssetId(row[0].value as TokenId);
  };

  const selectedAsset = React.useMemo(
    () => borrowMarketAssets.find(marketAsset => marketAsset.id === selectedAssetId),
    [selectedAssetId, JSON.stringify(borrowMarketAssets)],
  );

  return (
    <>
      <Paper className={className} css={styles.tableContainer}>
        <BorrowMarketTable
          assets={borrowMarketAssets}
          isXvsEnabled={isXvsEnabled}
          rowOnClick={rowOnClick}
        />
      </Paper>

      {selectedAsset && (
        <BorrowRepayModal
          asset={selectedAsset}
          onClose={() => setSelectedAssetId(undefined)}
          isXvsEnabled={isXvsEnabled}
        />
      )}
    </>
  );
};

const BorrowMarket: React.FC<
  Omit<BorrowMarketUiProps, 'hasLunaOrUstCollateralEnabled' | 'openLunaUstWarningModal'>
> = ({ className, isXvsEnabled, borrowMarketAssets }) => {
  const { hasLunaOrUstCollateralEnabled, openLunaUstWarningModal } = useContext(
    DisableLunaUstWarningContext,
  );

  return (
    <BorrowMarketUi
      className={className}
      borrowMarketAssets={borrowMarketAssets}
      isXvsEnabled={isXvsEnabled}
      hasLunaOrUstCollateralEnabled={hasLunaOrUstCollateralEnabled}
      openLunaUstWarningModal={openLunaUstWarningModal}
    />
  );
};

export default BorrowMarket;
