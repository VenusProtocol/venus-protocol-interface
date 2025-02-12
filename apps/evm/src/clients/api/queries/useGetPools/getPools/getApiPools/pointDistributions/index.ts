import { ChainId } from 'types';

import etherfiPointsLogo from './etherfiPoints.svg';
import kelpMilesLogo from './kelpMiles.svg';
import solvPointsLogo from './solvPoints.svg';

// TODO: remove once the API returns those

export interface ApiPointDistribution {
  action: 'supply' | 'borrow';
  title: string;
  incentive?: string;
  description?: string;
  logoUrl?: string;
  extraInfoUrl?: string;
  startDate?: Date;
  endDate?: Date;
}

export const pointDistributions: {
  [chainId in ChainId]: {
    [vTokenAddress: string]: ApiPointDistribution[];
  };
} = {
  [ChainId.BSC_MAINNET]: {
    '0xf841cb62c19fCd4fF5CD0AaB5939f3140BaaC3Ea': [
      {
        title: 'Solv Points',
        incentive: '3x points',
        logoUrl: solvPointsLogo,
        extraInfoUrl: 'https://app.solv.finance/defi',
        action: 'supply',
      },
    ],
    '0xc5b24f347254bD8cF8988913d1fd0F795274900F': [
      {
        title: 'ether.fi Points',
        incentive: '2x points',
        logoUrl: etherfiPointsLogo,
        extraInfoUrl: 'https://app.ether.fi/defi',
        action: 'supply',
      },
    ],
  },
  [ChainId.BSC_TESTNET]: {},
  [ChainId.OPBNB_MAINNET]: {},
  [ChainId.OPBNB_TESTNET]: {},
  [ChainId.ETHEREUM]: {
    '0xb4933AF59868986316Ed37fa865C829Eba2df0C7': [
      {
        title: 'ether.fi Points',
        incentive: '2x points',
        logoUrl: etherfiPointsLogo,
        extraInfoUrl: 'https://app.ether.fi/defi',
        action: 'supply',
      },
    ],
    '0xEF26C64bC06A8dE4CA5D31f119835f9A1d9433b9': [
      {
        title: 'ether.fi Points',
        incentive: '2x points',
        logoUrl: etherfiPointsLogo,
        extraInfoUrl: 'https://app.ether.fi/defi',
        action: 'supply',
      },
    ],
    '0x325cEB02fe1C2fF816A83a5770eA0E88e2faEcF2': [
      {
        title: 'ether.fi Points',
        incentive: '2x points',
        logoUrl: etherfiPointsLogo,
        extraInfoUrl: 'https://app.ether.fi/defi',
        action: 'supply',
      },
    ],
    '0x25C20e6e110A1cE3FEbaCC8b7E48368c7b2F0C91': [
      {
        title: 'Lux Points',
        incentive: '3x points',
        logoUrl: etherfiPointsLogo,
        action: 'supply',
      },
    ],
    '0xDB6C345f864883a8F4cae87852Ac342589E76D1B': [
      {
        title: 'Kelp Miles',
        incentive: '2x points',
        logoUrl: kelpMilesLogo,
        extraInfoUrl: 'https://kelpdao.xyz/defi',
        action: 'supply',
      },
    ],
  },
  [ChainId.SEPOLIA]: {},
  [ChainId.ARBITRUM_ONE]: {},
  [ChainId.ARBITRUM_SEPOLIA]: {},
  [ChainId.ZKSYNC_MAINNET]: {},
  [ChainId.ZKSYNC_SEPOLIA]: {},
  [ChainId.OPTIMISM_MAINNET]: {},
  [ChainId.OPTIMISM_SEPOLIA]: {},
  [ChainId.BASE_MAINNET]: {},
  [ChainId.BASE_SEPOLIA]: {},
  [ChainId.UNICHAIN_MAINNET]: {},
  [ChainId.UNICHAIN_SEPOLIA]: {},
};
