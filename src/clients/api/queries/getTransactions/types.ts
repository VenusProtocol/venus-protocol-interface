export interface TransactionResponse {
  amount: number;
  blockNumber: number;
  category: string;
  event: string;
  from: string;
  timestamp: number;
  to: string;
  transactionHash: string;
  vTokenAddress: string;
}
