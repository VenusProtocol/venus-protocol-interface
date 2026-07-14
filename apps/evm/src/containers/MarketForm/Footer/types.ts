import type { Address } from 'viem';

import type { Token } from 'types';

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
