import type { Address } from 'viem';

export interface MarketFormModalRequest {
  underlyingSymbol: string;
  poolComptrollerAddress: Address;
  initialActiveTabId?: string;
}

export interface StoreState {
  request?: MarketFormModalRequest;
  openModal: (request: MarketFormModalRequest) => void;
  closeModal: () => void;
}
