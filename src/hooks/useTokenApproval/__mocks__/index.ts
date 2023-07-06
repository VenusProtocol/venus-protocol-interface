const isTokenApproved = true;
const isSpendingLimitLoading = false;
const isApproveTokenLoading = false;
const approveToken = vi.fn();

export default vi.fn(() => ({
  isTokenApproved,
  isSpendingLimitLoading,
  isApproveTokenLoading,
  approveToken,
}));
