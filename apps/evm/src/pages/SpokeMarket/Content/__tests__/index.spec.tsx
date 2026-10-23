import { fireEvent, screen, within } from '@testing-library/react';
import type { Mock } from 'vitest';

import { spokePools } from '__mocks__/models/spokePools';
import { useBreakpointUp } from 'hooks/responsive';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';

import { Content } from '..';

const spokePool = spokePools[0];
const loanAsset = spokePool.assets.find(({ isBorrowable }) => isBorrowable)!;
const collateral = spokePool.assets.find(({ isBorrowable }) => !isBorrowable)!;

vi.mock('hooks/responsive', async () => {
  const actual = await vi.importActual<typeof import('hooks/responsive')>('hooks/responsive');

  return {
    ...actual,
    useBreakpointUp: vi.fn(() => false),
  };
});

const clickSupportedCollateralRow = () => {
  const card = screen.getByText(en.spokeMarket.supportedCollateral.title)
    .parentElement as HTMLElement;

  fireEvent.click(within(card).getAllByText(collateral.vToken.underlyingToken.symbol)[0]);
};

describe('SpokeMarket Content', () => {
  it('asks for the gated asset acknowledgement when the pool lists a gated asset', () => {
    const gatedPool = {
      ...spokePool,
      assets: spokePool.assets.map(asset =>
        asset.isBorrowable ? asset : { ...asset, isGated: true },
      ),
    };

    renderComponent(<Content spokePool={gatedPool} asset={loanAsset} />);

    expect(screen.getByText(en.gatedAssetAcknowledgementModal.title)).toBeInTheDocument();
  });

  it('does not ask for an acknowledgement when no asset is gated', () => {
    renderComponent(<Content spokePool={spokePool} asset={loanAsset} />);

    expect(screen.queryByText(en.gatedAssetAcknowledgementModal.title)).not.toBeInTheDocument();
  });

  it('scrolls the form into view when a collateral row is clicked on small screens', () => {
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;

    renderComponent(<Content spokePool={spokePool} asset={loanAsset} />);
    clickSupportedCollateralRow();

    expect(scrollIntoView).toHaveBeenCalledTimes(1);
  });

  it('does not scroll on large screens, where the form is sticky', () => {
    (useBreakpointUp as Mock).mockReturnValue(true);
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;

    renderComponent(<Content spokePool={spokePool} asset={loanAsset} />);
    clickSupportedCollateralRow();

    expect(scrollIntoView).not.toHaveBeenCalled();
  });
});
