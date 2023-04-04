import { Asset } from 'types';

const calculatePercentageOfUserBorrowBalance = ({
  asset,
  percentage,
}: {
  asset: Asset;
  percentage: number;
}) =>
  asset.userBorrowBalanceTokens
    .multipliedBy(percentage / 100)
    .decimalPlaces(asset.vToken.underlyingToken.decimals)
    .toFixed();

export default calculatePercentageOfUserBorrowBalance;
