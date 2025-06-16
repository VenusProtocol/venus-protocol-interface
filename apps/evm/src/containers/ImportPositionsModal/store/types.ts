import type { Address } from 'viem';

export interface StoreState {
  doNotShowAgainFor: Address[];
  hideModal: ({ accountAddress }: { accountAddress: Address }) => void;
}
