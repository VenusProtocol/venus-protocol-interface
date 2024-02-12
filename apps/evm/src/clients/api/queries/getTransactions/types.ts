export interface TransactionResponse {
  amountMantissa: string;
  blockNumber: number;
  category: string;
  event: string;
  from: string;
  logIndex: number;
  timestamp: number;
  to: string;
  tokenAddress: string | null;
  transactionHash: string;
}
