import { screen } from '@testing-library/react';
import type { Mock } from 'vitest';

import { spokePools } from '__mocks__/models/spokePools';
import { defaultUserChainSettings, useUserChainSettings } from 'hooks/useUserChainSettings';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';

import { SpokeFormModal } from '..';

const spokePool = spokePools[0];
const loanAsset = spokePool.assets.find(({ isBorrowable }) => isBorrowable)!;

const gatedPool = {
  ...spokePool,
  assets: spokePool.assets.map(asset => (asset.isBorrowable ? asset : { ...asset, isGated: true })),
};

describe('SpokeFormModal', () => {
  it('asks for the gated asset acknowledgement before showing the form', () => {
    renderComponent(
      <SpokeFormModal spokePool={gatedPool} asset={loanAsset} handleClose={vi.fn()} />,
    );

    expect(screen.getByText(en.gatedAssetAcknowledgementModal.title)).toBeInTheDocument();
    expect(screen.queryByText(en.spokeForm.loanTabTitle)).not.toBeInTheDocument();
  });

  it('shows the form once the gated asset acknowledgement was accepted', () => {
    (useUserChainSettings as Mock).mockImplementation(() => [
      { ...defaultUserChainSettings, doNotShowGatedAssetModal: true },
      vi.fn(),
    ]);

    renderComponent(
      <SpokeFormModal spokePool={gatedPool} asset={loanAsset} handleClose={vi.fn()} />,
    );

    expect(screen.queryByText(en.gatedAssetAcknowledgementModal.title)).not.toBeInTheDocument();
    expect(screen.getByText(en.spokeForm.loanTabTitle)).toBeInTheDocument();
  });
});
