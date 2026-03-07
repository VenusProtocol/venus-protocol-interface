import type { Address } from 'viem';

import type { BalanceMutation, Pool, SwapQuote, Token } from 'types';

type ApprovalBase = {
  type: 'token' | 'delegate';
};

export type TokenApproval = ApprovalBase & {
  type: 'token';
  spenderAddress: Address;
  token: Token;
};

export type DelegateApproval = ApprovalBase & {
  type: 'delegate';
  delegateeAddress: Address;
  poolComptrollerContractAddress: Address;
};

export type Approval = TokenApproval | DelegateApproval;

export interface TxFormSubmitButtonProps {
  submitButtonLabel: string;
  isFormValid: boolean;
  balanceMutations: BalanceMutation[];
  simulatedPool?: Pool;
  approval?: Approval;
  isRiskyTransaction?: boolean;
  isHighPriceImpactSwap?: boolean;
  isUserAcknowledgingRisk?: boolean;
  setAcknowledgeRisk?: (checked: boolean) => void;
  isUserAcknowledgingHighPriceImpact?: boolean;
  setAcknowledgeHighPriceImpact?: (checked: boolean) => void;
  isLoading?: boolean;
  swapFromToken?: Token;
  swapToToken?: Token;
  swapQuote?: SwapQuote;
  analyticVariant?: string;
  className?: string;
}
