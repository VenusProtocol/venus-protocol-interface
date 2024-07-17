import BigNumber from 'bignumber.js';
import { ChainId } from 'types';

export const PRIME_DOC_URL = 'https://docs-v4.venus.io/whats-new/prime-yield';

export const PRIME_APY_DOC_URL =
  'https://docs-v4.venus.io/technical-reference/reference-technical-articles/prime#calculate-apr-associated-with-a-prime-market-and-user';

const bscPrimeMarketsAddresses = {
  vBTCB: '0x882C173bC7Ff3b7786CA16dfeD3DFFfb9Ee7847B',
  vUSDT: '0xfD5840Cd36d94D7229439859C0112a4185BC0255',
  vUSDC: '0xecA88125a5ADbe82614ffC12D0DB554E2e2867C8',
  vETH: '0xf508fCD89b8bd15579dc79A6827cB4686A3592c8',
};

const ethPrimeMarketsAddresses = {
  vUSDC_Core: '0x17C07e0c232f2f80DfDbd7a95b942D893A4C5ACb',
  vUSDT_Core: '0x8C3e3821259B82fFb32B2450A95d2dcbf161C24E',
  vWBTC_Core: '0x8716554364f20BCA783cb2BAA744d39361fd1D8d',
  vWETH_LiquidStakedETH: '0xc82780Db1257C788F262FBbDA960B3706Dfdcaf2',
};

const bscSupplyAveragesForToken: Record<string, BigNumber> = {
  [bscPrimeMarketsAddresses.vBTCB]: new BigNumber('0.71'),
  [bscPrimeMarketsAddresses.vETH]: new BigNumber('9.86'),
  [bscPrimeMarketsAddresses.vUSDT]: new BigNumber('5003.94'),
  [bscPrimeMarketsAddresses.vUSDC]: new BigNumber('13068.75'),
};

const ethSupplyAveragesForToken: Record<string, BigNumber> = {
  [ethPrimeMarketsAddresses.vUSDC_Core]: new BigNumber('15813.76'),
  [ethPrimeMarketsAddresses.vUSDT_Core]: new BigNumber('21430.84'),
  [ethPrimeMarketsAddresses.vWBTC_Core]: new BigNumber('2.02'),
  [ethPrimeMarketsAddresses.vWETH_LiquidStakedETH]: new BigNumber('124.77'),
};

const bscBorrowAveragesForToken: Record<string, BigNumber> = {
  [bscPrimeMarketsAddresses.vBTCB]: new BigNumber('0.04'),
  [bscPrimeMarketsAddresses.vETH]: new BigNumber('0.49'),
  [bscPrimeMarketsAddresses.vUSDT]: new BigNumber('10009.21'),
  [bscPrimeMarketsAddresses.vUSDC]: new BigNumber('2405.43'),
};

const ethBorrowAveragesForToken: Record<string, BigNumber> = {
  [ethPrimeMarketsAddresses.vUSDC_Core]: new BigNumber('11615.36'),
  [ethPrimeMarketsAddresses.vUSDT_Core]: new BigNumber('3095.78'),
  [ethPrimeMarketsAddresses.vWBTC_Core]: new BigNumber('1.48'),
  [ethPrimeMarketsAddresses.vWETH_LiquidStakedETH]: new BigNumber('11.16'),
};

const bscXvsStakedAveragesForToken: Record<string, BigNumber> = {
  [bscPrimeMarketsAddresses.vBTCB]: new BigNumber('4124.59'),
  [bscPrimeMarketsAddresses.vETH]: new BigNumber('4788.05'),
  [bscPrimeMarketsAddresses.vUSDT]: new BigNumber('3731.33'),
  [bscPrimeMarketsAddresses.vUSDC]: new BigNumber('3265.30'),
};

const ethXvsStakedAveragesForToken: Record<string, BigNumber> = {
  [ethPrimeMarketsAddresses.vUSDC_Core]: new BigNumber('7890.50'),
  [ethPrimeMarketsAddresses.vUSDT_Core]: new BigNumber('6006.66'),
  [ethPrimeMarketsAddresses.vWBTC_Core]: new BigNumber('6341.15'),
  [ethPrimeMarketsAddresses.vWETH_LiquidStakedETH]: new BigNumber('7943.09'),
};

const bscPrimeAverages = {
  supply: bscSupplyAveragesForToken,
  borrow: bscBorrowAveragesForToken,
  xvs: bscXvsStakedAveragesForToken,
};

const ethereumPrimeAverages = {
  supply: ethSupplyAveragesForToken,
  borrow: ethBorrowAveragesForToken,
  xvs: ethXvsStakedAveragesForToken,
};

export const primeAveragesForNetwork: Record<
  ChainId,
  | {
      supply: Record<string, BigNumber>;
      borrow: Record<string, BigNumber>;
      xvs: Record<string, BigNumber>;
    }
  | undefined
> = {
  [ChainId.BSC_MAINNET]: bscPrimeAverages,
  [ChainId.BSC_TESTNET]: bscPrimeAverages,
  [ChainId.ETHEREUM]: ethereumPrimeAverages,
  [ChainId.SEPOLIA]: ethereumPrimeAverages,
  [ChainId.OPBNB_MAINNET]: undefined,
  [ChainId.OPBNB_TESTNET]: undefined,
  [ChainId.ARBITRUM_ONE]: undefined,
  [ChainId.ARBITRUM_SEPOLIA]: undefined,
};
