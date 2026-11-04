import { fireEvent, screen } from '@testing-library/react';

import { eth } from '__mocks__/models/tokens';
import { fakeAsset, fakeWethAsset } from 'containers/MarketForm/SupplyForm/__testUtils__/fakeData';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';

import { CollateralSelect } from '..';

const ethAsset = {
  ...fakeAsset,
  vToken: {
    ...fakeAsset.vToken,
    address: '0x1111111111111111111111111111111111111111' as const,
    underlyingToken: eth,
  },
};

const options = [
  { asset: ethAsset, token: eth },
  { asset: fakeWethAsset, token: fakeWethAsset.vToken.underlyingToken },
  { asset: fakeWethAsset, token: eth },
];

describe('CollateralSelect', () => {
  it('names a row after its market when the token differs from it', () => {
    renderComponent(<CollateralSelect options={options} value={options[2]} onChange={vi.fn()} />);

    const trigger = screen.getByRole('button', { name: en.lite.collateralSelect.ariaLabel });
    expect(trigger).toHaveTextContent('ETH (WETH)');

    fireEvent.click(trigger);

    const rowLabels = new Set(
      screen
        .getAllByRole('button')
        .flatMap(button => button.querySelector('.truncate')?.textContent ?? []),
    );

    expect(rowLabels).toEqual(new Set(['ETH', 'WETH', 'ETH (WETH)']));
  });
});
