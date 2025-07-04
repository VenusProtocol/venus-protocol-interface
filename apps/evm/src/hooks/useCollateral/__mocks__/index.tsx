const toggleCollateralMock = vi.fn();

export const useCollateral = vi.fn(() => ({
  toggleCollateral: toggleCollateralMock,
}));
