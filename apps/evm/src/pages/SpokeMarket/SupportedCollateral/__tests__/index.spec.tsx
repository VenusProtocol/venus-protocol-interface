import { screen } from '@testing-library/react';
import BigNumber from 'bignumber.js';

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

  it('lists supplied collaterals first, by supplied value, and keeps the API order for the rest', () => {
    const makeCollateral = (symbol: string, address: `0x${string}`, suppliedCents: number) => ({
      ...collateral,
      vToken: {
        ...collateral.vToken,
        address,
        underlyingToken: { ...collateral.vToken.underlyingToken, symbol },
      },
      userSupplyBalanceTokens: new BigNumber(suppliedCents > 0 ? 1 : 0),
      userSupplyBalanceCents: new BigNumber(suppliedCents),
    });

    const { container } = renderComponent(
      <SupportedCollateral
        collaterals={[
          makeCollateral('AAA', '0x0000000000000000000000000000000000000001', 0),
          makeCollateral('BBB', '0x0000000000000000000000000000000000000002', 100),
          makeCollateral('CCC', '0x0000000000000000000000000000000000000003', 0),
          makeCollateral('DDD', '0x0000000000000000000000000000000000000004', 500),
        ]}
        onRowClick={vi.fn()}
      />,
    );

    const rowSymbols = [...container.querySelectorAll('tbody tr')].map(
      row => row.textContent?.match(/AAA|BBB|CCC|DDD/)?.[0],
    );

    expect(rowSymbols).toEqual(['DDD', 'BBB', 'AAA', 'CCC']);
  });
});
