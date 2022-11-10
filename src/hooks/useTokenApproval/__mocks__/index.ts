const isTokenApproved = true;
const isTokenApprovalStatusLoading = false;
const isApproveTokenLoading = false;
const approveToken = jest.fn();

export default jest.fn(() => ({
  isTokenApproved,
  isTokenApprovalStatusLoading,
  isApproveTokenLoading,
  approveToken,
}));
