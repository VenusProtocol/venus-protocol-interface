import MAX_UINT256 from 'constants/maxUint256';

import type { UseTokenApprovalOutput } from '..';

const output: UseTokenApprovalOutput = {
  isTokenApproved: true,
  isWalletSpendingLimitLoading: false,
  isApproveTokenLoading: false,
  isRevokeWalletSpendingLimitLoading: false,
  walletSpendingLimitTokens: MAX_UINT256,
  approveToken: vi.fn(),
  revokeWalletSpendingLimit: vi.fn(),
};

export default vi.fn(() => output);
