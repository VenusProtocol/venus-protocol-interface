import MAX_UINT256 from 'constants/maxUint256';

import { UseTokenApprovalOutput } from '..';

const output: UseTokenApprovalOutput = {
  isTokenApproved: true,
  isSpendingLimitLoading: false,
  isApproveTokenLoading: false,
  isRevokeSpendingLimitLoading: false,
  spendingLimitTokens: MAX_UINT256,
  approveToken: vi.fn(),
  revokeSpendingLimit: vi.fn(),
};

export default vi.fn(() => output);
