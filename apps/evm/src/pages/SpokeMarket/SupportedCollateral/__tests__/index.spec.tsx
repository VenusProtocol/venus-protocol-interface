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

describe('SupportedCollateral', () => {
  it('marks a protected collateral', () => {
    renderComponent(
      <SupportedCollateral
        collaterals={[{ ...collateral, isProtectionModeEnabled: true }]}
        onRowClick={vi.fn()}
      />,
    );

    expect(
      screen.getAllByText(`protected-${collateral.vToken.underlyingToken.symbol}`).length,
    ).toBeGreaterThan(0);
  });

  it('does not mark a collateral that is not protected', () => {
    renderComponent(<SupportedCollateral collaterals={collaterals} onRowClick={vi.fn()} />);

    expect(screen.queryByText(/^protected-/)).not.toBeInTheDocument();
  });
});
