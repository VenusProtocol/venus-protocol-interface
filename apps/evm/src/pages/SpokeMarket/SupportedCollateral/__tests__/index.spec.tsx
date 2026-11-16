import { screen } from '@testing-library/react';

import { spokePools } from '__mocks__/models/spokePools';
import { renderComponent } from 'testUtils/render';

import { SupportedCollateral } from '..';

vi.mock('components/ProtectionModeIndicator', () => ({
  ProtectionModeIndicator: ({ tokenName }: { tokenName: string }) => (
    <span>{`protected-${tokenName}`}</span>
  ),
}));

const collaterals = spokePools[0].assets.filter(({ isBorrowable }) => !isBorrowable);
const [collateral] = collaterals;
const fakeComptrollerAddress = '0xA73D31939c936d07fA0FD15b3d86C0fe2a72c282';

describe('SupportedCollateral', () => {
  it('marks a protected collateral', () => {
    renderComponent(
      <SupportedCollateral
        collaterals={[{ ...collateral, isProtectionModeEnabled: true }]}
        onRowClick={vi.fn()}
        comptrollerAddress={fakeComptrollerAddress}
      />,
    );

    expect(
      screen.getAllByText(`protected-${collateral.vToken.underlyingToken.symbol}`).length,
    ).toBeGreaterThan(0);
  });

  it('does not mark a collateral that is not protected', () => {
    renderComponent(
      <SupportedCollateral
        collaterals={collaterals}
        onRowClick={vi.fn()}
        comptrollerAddress={fakeComptrollerAddress}
      />,
    );

    expect(screen.queryByText(/^protected-/)).not.toBeInTheDocument();
  });
});
