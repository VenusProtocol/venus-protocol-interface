import BigNumber from 'bignumber.js';
import { ChainId } from 'types';

const bscTestnetPrimeMarketsAddresses = {
  vBTCB: '0xb6e9322C49FD75a367Fcb17B0Fcd62C5070EbCBe',
  vUSDT: '0xb7526572FFE56AB9D7489838Bf2E18e3323b441A',
  vUSDC: '0xD5C4C2e2facBEB59D0216D0595d63FcDc6F9A1a7',
  vETH: '0x162D005F0Fff510E54958Cfc5CF32A3180A84aab',
};

const bscMainnetPrimeMarketsAddresses = {
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

const bscTestnetSupplyAveragesForToken: Record<string, BigNumber> = {
  [bscTestnetPrimeMarketsAddresses.vBTCB]: new BigNumber('0.71'),
  [bscTestnetPrimeMarketsAddresses.vETH]: new BigNumber('9.86'),
  [bscTestnetPrimeMarketsAddresses.vUSDT]: new BigNumber('5003.94'),
  [bscTestnetPrimeMarketsAddresses.vUSDC]: new BigNumber('13068.75'),
};

const bscMainnetSupplyAveragesForToken: Record<string, BigNumber> = {
  [bscMainnetPrimeMarketsAddresses.vBTCB]: new BigNumber('0.71'),
  [bscMainnetPrimeMarketsAddresses.vETH]: new BigNumber('9.86'),
  [bscMainnetPrimeMarketsAddresses.vUSDT]: new BigNumber('5003.94'),
  [bscMainnetPrimeMarketsAddresses.vUSDC]: new BigNumber('13068.75'),
};

const ethSupplyAveragesForToken: Record<string, BigNumber> = {
  [ethPrimeMarketsAddresses.vUSDC_Core]: new BigNumber('15813.76'),
  [ethPrimeMarketsAddresses.vUSDT_Core]: new BigNumber('21430.84'),
  [ethPrimeMarketsAddresses.vWBTC_Core]: new BigNumber('2.02'),
  [ethPrimeMarketsAddresses.vWETH_LiquidStakedETH]: new BigNumber('124.77'),
};

const bscTestnetBorrowAveragesForToken: Record<string, BigNumber> = {
  [bscTestnetPrimeMarketsAddresses.vBTCB]: new BigNumber('0.04'),
  [bscTestnetPrimeMarketsAddresses.vETH]: new BigNumber('0.49'),
  [bscTestnetPrimeMarketsAddresses.vUSDT]: new BigNumber('10009.21'),
  [bscTestnetPrimeMarketsAddresses.vUSDC]: new BigNumber('2405.43'),
};

const bscMainnetBorrowAveragesForToken: Record<string, BigNumber> = {
  [bscMainnetPrimeMarketsAddresses.vBTCB]: new BigNumber('0.04'),
  [bscMainnetPrimeMarketsAddresses.vETH]: new BigNumber('0.49'),
  [bscMainnetPrimeMarketsAddresses.vUSDT]: new BigNumber('10009.21'),
  [bscMainnetPrimeMarketsAddresses.vUSDC]: new BigNumber('2405.43'),
};

const ethBorrowAveragesForToken: Record<string, BigNumber> = {
  [ethPrimeMarketsAddresses.vUSDC_Core]: new BigNumber('11615.36'),
  [ethPrimeMarketsAddresses.vUSDT_Core]: new BigNumber('3095.78'),
  [ethPrimeMarketsAddresses.vWBTC_Core]: new BigNumber('1.48'),
  [ethPrimeMarketsAddresses.vWETH_LiquidStakedETH]: new BigNumber('11.16'),
};

const bscTestnetXvsStakedAveragesForToken: Record<string, BigNumber> = {
  [bscTestnetPrimeMarketsAddresses.vBTCB]: new BigNumber('4124.59'),
  [bscTestnetPrimeMarketsAddresses.vETH]: new BigNumber('4788.05'),
  [bscTestnetPrimeMarketsAddresses.vUSDT]: new BigNumber('3731.33'),
  [bscTestnetPrimeMarketsAddresses.vUSDC]: new BigNumber('3265.30'),
};

const bscMainnetXvsStakedAveragesForToken: Record<string, BigNumber> = {
  [bscMainnetPrimeMarketsAddresses.vBTCB]: new BigNumber('4124.59'),
  [bscMainnetPrimeMarketsAddresses.vETH]: new BigNumber('4788.05'),
  [bscMainnetPrimeMarketsAddresses.vUSDT]: new BigNumber('3731.33'),
  [bscMainnetPrimeMarketsAddresses.vUSDC]: new BigNumber('3265.30'),
};

const ethXvsStakedAveragesForToken: Record<string, BigNumber> = {
  [ethPrimeMarketsAddresses.vUSDC_Core]: new BigNumber('7890.50'),
  [ethPrimeMarketsAddresses.vUSDT_Core]: new BigNumber('6006.66'),
  [ethPrimeMarketsAddresses.vWBTC_Core]: new BigNumber('6341.15'),
  [ethPrimeMarketsAddresses.vWETH_LiquidStakedETH]: new BigNumber('7943.09'),
};

const bscTestnetPrimeAverages = {
  supply: bscTestnetSupplyAveragesForToken,
  borrow: bscTestnetBorrowAveragesForToken,
  xvs: bscTestnetXvsStakedAveragesForToken,
};

const bscMainnetPrimeAverages = {
  supply: bscMainnetSupplyAveragesForToken,
  borrow: bscMainnetBorrowAveragesForToken,
  xvs: bscMainnetXvsStakedAveragesForToken,
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
  [ChainId.BSC_MAINNET]: bscMainnetPrimeAverages,
  [ChainId.BSC_TESTNET]: bscTestnetPrimeAverages,
  [ChainId.ETHEREUM]: ethereumPrimeAverages,
  [ChainId.SEPOLIA]: ethereumPrimeAverages,
  [ChainId.OPBNB_MAINNET]: undefined,
  [ChainId.OPBNB_TESTNET]: undefined,
  [ChainId.ARBITRUM_ONE]: undefined,
  [ChainId.ARBITRUM_SEPOLIA]: undefined,
  [ChainId.ZKSYNC_MAINNET]: undefined,
  [ChainId.ZKSYNC_SEPOLIA]: undefined,
  [ChainId.OPTIMISM_MAINNET]: undefined,
  [ChainId.OPTIMISM_SEPOLIA]: undefined,
  [ChainId.BASE_MAINNET]: undefined,
  [ChainId.BASE_SEPOLIA]: undefined,
  [ChainId.UNICHAIN_MAINNET]: undefined,
  [ChainId.UNICHAIN_SEPOLIA]: undefined,
};
