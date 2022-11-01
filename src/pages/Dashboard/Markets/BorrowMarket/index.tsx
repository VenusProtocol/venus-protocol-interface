/** @jsxImportSource @emotion/react */
import { Paper } from '@mui/material';
import BigNumber from 'bignumber.js';
import { Delimiter } from 'components';
import React, { useContext } from 'react';
import { Asset } from 'types';

import { TOKENS } from 'constants/tokens';
import { DisableLunaUstWarningContext } from 'context/DisableLunaUstWarning';
import BorrowRepayModal from 'pages/Dashboard/Modals/BorrowRepay';

import { useStyles } from '../styles';
import BorrowMarketTable, { BorrowMarketTableProps } from './BorrowMarketTable';
import BorrowingTable, { BorrowingUiProps } from './BorrowingTable';

export interface BorrowMarketUiProps {
  className?: string;
  borrowMarketAssets: Asset[];
  borrowingAssets: Asset[];
  isXvsEnabled: boolean;
  userTotalBorrowLimitCents: BigNumber;
  hasLunaOrUstCollateralEnabled: boolean;
  openLunaUstWarningModal: () => void;
}

export const BorrowMarketUi: React.FC<BorrowMarketUiProps> = ({
  className,
  borrowingAssets,
  borrowMarketAssets,
  isXvsEnabled,
  userTotalBorrowLimitCents,
  hasLunaOrUstCollateralEnabled,
  openLunaUstWarningModal,
}) => {
  const [selectedAssetId, setSelectedAssetId] = React.useState<Asset['token']['id'] | undefined>(
    undefined,
  );
  const styles = useStyles();

  const rowOnClick: BorrowMarketTableProps['rowOnClick'] | BorrowingUiProps['rowOnClick'] = (
    _e,
    row,
  ) => {
    const assetId = row[0].value as string;

    // Block action and show warning modal if user has LUNA or UST enabled as
    // collateral and is attempting to open the borrow modal of other assets
    if (hasLunaOrUstCollateralEnabled && assetId !== TOKENS.luna.id && assetId !== TOKENS.ust.id) {
      openLunaUstWarningModal();
      return;
    }

    setSelectedAssetId(assetId);
  };

  const selectedAsset = React.useMemo(
    () =>
      [...borrowingAssets, ...borrowMarketAssets].find(
        marketAsset => marketAsset.token.id === selectedAssetId,
      ),
    [selectedAssetId, JSON.stringify(borrowingAssets), JSON.stringify(borrowMarketAssets)],
  );

  return (
    <>
      <Paper className={className} css={styles.tableContainer}>
        {borrowingAssets.length > 0 && (
          <>
            <BorrowingTable
              assets={borrowingAssets}
              isXvsEnabled={isXvsEnabled}
              userTotalBorrowLimitCents={userTotalBorrowLimitCents}
              rowOnClick={rowOnClick}
            />
            <Delimiter css={styles.delimiter} />
          </>
        )}
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
> = ({
  className,
  isXvsEnabled,
  borrowMarketAssets,
  borrowingAssets,
  userTotalBorrowLimitCents,
}) => {
  const { hasLunaOrUstCollateralEnabled, openLunaUstWarningModal } = useContext(
    DisableLunaUstWarningContext,
  );

  return (
    <BorrowMarketUi
      className={className}
      borrowingAssets={borrowingAssets}
      borrowMarketAssets={borrowMarketAssets}
      isXvsEnabled={isXvsEnabled}
      userTotalBorrowLimitCents={userTotalBorrowLimitCents}
      hasLunaOrUstCollateralEnabled={hasLunaOrUstCollateralEnabled}
      openLunaUstWarningModal={openLunaUstWarningModal}
    />
  );
};

export default BorrowMarket;
