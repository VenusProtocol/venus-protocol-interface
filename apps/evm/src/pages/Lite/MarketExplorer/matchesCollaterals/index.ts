import type { LiteBorrowMarket } from '../../types';

export const matchesCollaterals = ({
  market,
  searchValue,
  selectedCollaterals,
}: {
  market: LiteBorrowMarket;
  searchValue: string;
  selectedCollaterals: string[];
}) => {
  const symbols = market.source.collaterals.map(collateral =>
    collateral.vToken.underlyingToken.symbol.toLowerCase(),
  );
  const search = searchValue.trim().toLowerCase();

  return (
    (!search || symbols.some(symbol => symbol.includes(search))) &&
    (selectedCollaterals.length === 0 ||
      selectedCollaterals.some(collateral => symbols.includes(collateral.toLowerCase())))
  );
};
