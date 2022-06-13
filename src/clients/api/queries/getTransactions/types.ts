export interface ITransactionResponse {
  amount: number;
  blockNumber: number;
  category: string;
  createdAt: string;
  event: string;
  from: string;
  id: number;
  timestamp: string | null;
  to: string;
  transactionHash: string;
  updatedAt: string;
  vTokenAddress: string;
}
