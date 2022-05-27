/* eslint-disable no-underscore-dangle */
import BigNumber from 'bignumber.js';
import { ITransactionResponse, TransactionCategory, TransactionEvent } from 'types';

class Transaction {
  id: number;

  amount: BigNumber;

  blockNumber;

  category: TransactionCategory;

  private _createdAt: string;

  event: TransactionEvent;

  from: string;

  to: string;

  timestamp: string | null;

  transactionHash: string;

  private _updatedAt: string;

  vTokenAddress: string;

  constructor(data: ITransactionResponse) {
    this.id = data.id;
    this.amount = new BigNumber(data.amount);
    this.blockNumber = data.blockNumber;
    this.category = data.category as TransactionCategory;
    this._createdAt = data.createdAt;
    this.event = data.event as TransactionEvent;
    this.from = data.from;
    this.timestamp = data.timestamp;
    this.to = data.to;
    this.transactionHash = data.transactionHash;
    this._updatedAt = data.updatedAt;
    this.vTokenAddress = data.vTokenAddress;
  }

  get createdAt() {
    return new Date(this._createdAt);
  }

  get updatedAt() {
    return new Date(this._updatedAt);
  }
}

export default Transaction;
