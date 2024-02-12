export interface GetVoterDetailsResponse {
  balance: string;
  delegateCount: number;
  delegates: string;
  votes: string;
  txs: {
    category: string;
    event: string;
    transactionHash: string;
    logIndex: number;
    from: string;
    to: string;
    tokenAddress: string;
    amountMantissa: string;
    blockNumber: number;
    timestamp: number;
  }[];
}
