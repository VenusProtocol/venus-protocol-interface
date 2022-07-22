export interface GetVoterDetailsResponse {
  balance: string;
  delegateCount: number;
  delegates: string;
  votes: string;
  txs: (
    | {
        amount: string;
        blockNumber: number;
        blockTimestamp: number;
        createdAt: string;
        from: string;
        to: string;
        transactionHash: string;
        transactionIndex: number;
        type: 'transfer';
        updatedAt: string;
      }
    | {
        amount: string;
        blockNumber: number;
        blockTimestamp: number;
        createdAt: string;
        from: string;
        to: string;
        transactionHash: string;
        transactionIndex: number;
        type: 'vote';
        updatedAt: string;
        support: 0 | 1 | 2;
      }
  )[];
}
