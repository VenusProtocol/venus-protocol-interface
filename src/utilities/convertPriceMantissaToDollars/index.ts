import BigNumber from 'bignumber.js';

const convertPriceMantissaToDollars = ({
  priceMantissa,
  decimals,
}: {
  priceMantissa: BigNumber | string;
  decimals: number;
}) => new BigNumber(priceMantissa).dividedBy(10 ** (36 - decimals));

export default convertPriceMantissaToDollars;
