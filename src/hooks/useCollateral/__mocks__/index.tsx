const toggleCollateralMock = vi.fn();

export default () => ({
  toggleCollateral: toggleCollateralMock,
  CollateralModal: () => <></>,
});
