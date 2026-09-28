import { screen } from '@testing-library/react';

import { spokePools } from '__mocks__/models/spokePools';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';

import { Content } from '..';

const spokePool = spokePools[0];
const loanAsset = spokePool.assets.find(({ isBorrowable }) => isBorrowable)!;

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
});
