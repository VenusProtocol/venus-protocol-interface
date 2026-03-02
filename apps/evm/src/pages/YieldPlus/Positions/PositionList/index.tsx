import BigNumber from 'bignumber.js';
import { Table } from 'components';
import { useMemo, useState } from 'react';

import { PAGE_CONTAINER_ID } from 'constants/layout';
import { useTranslation } from 'libs/translations';
import {
  LONG_TOKEN_ADDRESS_PARAM_KEY,
  SHORT_TOKEN_ADDRESS_PARAM_KEY,
} from 'pages/YieldPlus/constants';
import { useSearchParams } from 'react-router';
import type { Asset } from 'types';
import { areAddressesEqual } from 'utilities';
import { RowFooter } from './RowFooter';
import { rowKeyExtractor } from './rowKeyExtractor';
import type { PositionListProps, Row } from './types';
import { useColumns } from './useColumns';

export const PositionList: React.FC<PositionListProps> = ({ positions }) => {
  const { t } = useTranslation();
  const [_, setSearchParams] = useSearchParams();
  const [openPositionAccordionKeys, setOpenAccordionKeys] = useState<string[]>([]);

  const handleRowClick = (_e: React.MouseEvent<HTMLDivElement>, row: Row) => {
    document.getElementById(PAGE_CONTAINER_ID)?.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });

    setSearchParams(currentSearchParams => ({
      ...Object.fromEntries(currentSearchParams),
      [LONG_TOKEN_ADDRESS_PARAM_KEY]: row.longToken.address,
      [SHORT_TOKEN_ADDRESS_PARAM_KEY]: row.shortToken.address,
    }));
  };

  const renderRowFooter = (row: Row) => {
    const isOpen = openPositionAccordionKeys.includes(rowKeyExtractor(row));

    return <RowFooter row={row} isOpen={isOpen} />;
  };

  const renderRowControl = (_row: Row) => {
    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // TODO: open "Close" modal
    };

    return (
      <button
        onClick={handleClick}
        className="-ml-2 text-b2s px-2 py-1 rounded-lg border border-dark-blue-hover text-light-grey transition-colors cursor-pointer hover:bg-dark-blue-hover"
        type="button"
      >
        {t('yieldPlus.positions.closeButtonLabel')}
      </button>
    );
  };

  const rows = positions.reduce<Row[]>((acc, position) => {
    let dsaAsset: Asset | undefined;
    let longAsset: Asset | undefined;
    let shortAsset: Asset | undefined;

    position.pool.assets.forEach(asset => {
      if (areAddressesEqual(asset.vToken.address, position.dsaVTokenAddress)) {
        dsaAsset = asset;
      }

      if (areAddressesEqual(asset.vToken.address, position.shortVTokenAddress)) {
        shortAsset = asset;
      }

      if (areAddressesEqual(asset.vToken.address, position.longVTokenAddress)) {
        longAsset = asset;
      }
    });

    if (!longAsset || !shortAsset || !dsaAsset) {
      return acc;
    }

    const longBalanceTokens = longAsset.userSupplyBalanceTokens;
    const shortBalanceTokens = shortAsset.userBorrowBalanceTokens;
    const dsaBalanceTokens = dsaAsset.userSupplyBalanceTokens;

    const longBalanceCents = longAsset.userSupplyBalanceCents;
    const shortBalanceCents = shortAsset.userBorrowBalanceCents;
    const dsaBalanceCents = dsaAsset.userSupplyBalanceCents;

    const entryPriceTokens = longBalanceTokens.isZero()
      ? new BigNumber(0)
      : shortBalanceTokens.dividedBy(longBalanceTokens);

    const entryPriceCents = entryPriceTokens.multipliedBy(shortAsset.tokenPriceCents);

    const collateralLt = new BigNumber(dsaAsset.liquidationThresholdPercentage).dividedBy(100);
    const longLt = new BigNumber(longAsset.liquidationThresholdPercentage).dividedBy(100);

    const liquidationPriceTokens =
      longBalanceTokens.isZero() || longLt.isZero() || shortAsset.tokenPriceCents.isZero()
        ? new BigNumber(0)
        : shortBalanceTokens
            .minus(
              dsaBalanceTokens
                .multipliedBy(dsaAsset.tokenPriceCents.dividedBy(shortAsset.tokenPriceCents))
                .multipliedBy(collateralLt),
            )
            .dividedBy(longBalanceTokens.multipliedBy(longLt));

    const liquidationPriceCents = liquidationPriceTokens.multipliedBy(shortAsset.tokenPriceCents);

    const totalSupplyValueCents = dsaBalanceCents.plus(longBalanceCents);
    const shortBorrowApyPercentage = shortAsset.borrowApyPercentage.absoluteValue();
    const netApyPercentage = totalSupplyValueCents.isZero()
      ? 0
      : dsaBalanceCents
          .multipliedBy(dsaAsset.supplyApyPercentage)
          .plus(longBalanceCents.multipliedBy(longAsset.supplyApyPercentage))
          .minus(shortBalanceCents.multipliedBy(shortBorrowApyPercentage))
          .dividedBy(totalSupplyValueCents)
          .toNumber();

    const netValueCents = dsaBalanceCents
      .plus(longBalanceCents)
      .minus(shortBalanceCents)
      .toNumber();

    const row: Row = {
      ...position,
      longToken: longAsset.vToken.underlyingToken,
      longBalanceTokens,
      longBalanceCents: longBalanceCents.toNumber(),
      shortToken: shortAsset.vToken.underlyingToken,
      shortBalanceTokens,
      shortBalanceCents: shortBalanceCents.toNumber(),
      dsaToken: dsaAsset.vToken.underlyingToken,
      dsaBalanceTokens,
      dsaBalanceCents: dsaBalanceCents.toNumber(),
      netValueCents,
      netApyPercentage,
      entryPriceTokens,
      entryPriceCents: entryPriceCents.toNumber(),
      liquidationPriceTokens,
      liquidationPriceCents: liquidationPriceCents.toNumber(),
    };

    return [...acc, row];
  }, []);

  const columns = useColumns({
    openPositionAccordionKeys,
    setOpenAccordionKeys,
    rowKeyExtractor,
  });
  const initialOrder = useMemo(() => {
    const orderByColumn = columns.find(column => column.key === 'pnl');

    return (
      orderByColumn && {
        orderBy: orderByColumn,
        orderDirection: 'desc' as const,
      }
    );
  }, [columns]);

  return (
    <Table
      columns={columns}
      data={rows}
      rowKeyExtractor={rowKeyExtractor}
      initialOrder={initialOrder}
      breakpoint="xl"
      variant="primary"
      className="py-0 border-0 xl:border"
      tableLayout="auto"
      rowOnClick={handleRowClick}
      renderRowFooter={renderRowFooter}
      renderRowControl={renderRowControl}
    />
  );
};
