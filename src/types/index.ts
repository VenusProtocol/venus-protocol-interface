import BigNumber from 'bignumber.js';

export interface Asset {
  id: string;
  name: string;
  tokenPrice: string;
  symbol: string;
  borrowBalance: BigNumber;
  decimals: number;
  walletBalance: BigNumber;
  isEnabled: boolean;
  vtokenAddress: string;
  borrowApy: BigNumber;
  xvsBorrowApy: BigNumber;
  img: string;
  borrowCaps: BigNumber;
  totalBorrows: BigNumber;
  liquidity: BigNumber;
}

export interface Setting {
  withXVS?: boolean;
  pendingInfo: {
    type: string;
    status: boolean;
    symbol: string;
    amount: string;
  };
}

export interface Proposal {
  forVotes: number;
  againstVotes: number;
  description: string;
  id: string;
  state: string;
  createdAt: string;
}
