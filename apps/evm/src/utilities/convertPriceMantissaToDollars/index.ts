import BigNumber from 'bignumber.js';

const convertPriceMantissaToDollars = ({
  priceMantissa,
  decimals,
}: {
  priceMantissa: BigNumber | string;
  decimals: number;
}) => new BigNumber(priceMantissa).shiftedBy(-36 + decimals);

export default convertPriceMantissaToDollars;
