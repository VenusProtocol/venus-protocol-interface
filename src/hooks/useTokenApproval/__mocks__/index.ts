const isTokenApproved = true;
const isTokenApprovalStatusLoading = false;
const isApproveTokenLoading = false;
const approveToken = vi.fn();

export default vi.fn(() => ({
  isTokenApproved,
  isTokenApprovalStatusLoading,
  isApproveTokenLoading,
  approveToken,
}));
