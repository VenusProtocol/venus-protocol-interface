import { fireEvent, screen, waitFor } from '@testing-library/react';
import type { Mock } from 'vitest';

import { eth } from '__mocks__/models/tokens';
import { fakeAsset, fakeWethAsset } from 'containers/MarketForm/SupplyForm/__testUtils__/fakeData';
import { defaultUserChainSettings, useUserChainSettings } from 'hooks/useUserChainSettings';
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
  it('names a row after its market only in the list when the token differs from it', () => {
    renderComponent(<CollateralSelect options={options} value={options[2]} onChange={vi.fn()} />);

    const trigger = screen.getByRole('button', { name: en.lite.collateralSelect.ariaLabel });
    expect(trigger).toHaveTextContent(/^ETH$/);

    fireEvent.click(trigger);

    const rowLabels = new Set(
      screen
        .getAllByRole('button')
        .flatMap(button => button.querySelector('.truncate')?.textContent ?? []),
    );

    expect(rowLabels).toEqual(new Set(['ETH', 'WETH', 'ETH (WETH market)']));
  });

  describe('when a gated collateral is picked', () => {
    const gatedOption = { asset: { ...fakeWethAsset, isGated: true }, token: eth };
    const gatedOptions = [options[0], gatedOption];

    const pickGatedOption = () => {
      fireEvent.click(screen.getByRole('button', { name: en.lite.collateralSelect.ariaLabel }));
      fireEvent.click(screen.getAllByText('ETH (WETH market)')[0]);
    };

    it('asks for acknowledgement before selecting it', async () => {
      const onChange = vi.fn();
      renderComponent(
        <CollateralSelect options={gatedOptions} value={gatedOptions[0]} onChange={onChange} />,
      );

      pickGatedOption();

      expect(await screen.findByText(en.gatedAssetAcknowledgementModal.title)).toBeInTheDocument();
      expect(onChange).not.toHaveBeenCalled();

      fireEvent.click(
        screen.getByRole('button', { name: en.gatedAssetAcknowledgementModal.acceptButtonLabel }),
      );

      expect(onChange).toHaveBeenCalledWith(gatedOption);
    });

    it('keeps the current collateral when the acknowledgement is rejected', async () => {
      const onChange = vi.fn();
      renderComponent(
        <CollateralSelect options={gatedOptions} value={gatedOptions[0]} onChange={onChange} />,
      );

      pickGatedOption();

      fireEvent.click(
        await screen.findByRole('button', {
          name: en.gatedAssetAcknowledgementModal.rejectButtonLabel,
        }),
      );

      await waitFor(() =>
        expect(screen.queryByText(en.gatedAssetAcknowledgementModal.title)).not.toBeInTheDocument(),
      );
      expect(onChange).not.toHaveBeenCalled();
    });

    it('selects it directly once the acknowledgement was given', () => {
      (useUserChainSettings as Mock).mockReturnValue([
        { ...defaultUserChainSettings, doNotShowGatedAssetModal: true },
        vi.fn(),
      ]);
      const onChange = vi.fn();
      renderComponent(
        <CollateralSelect options={gatedOptions} value={gatedOptions[0]} onChange={onChange} />,
      );

      pickGatedOption();

      expect(onChange).toHaveBeenCalledWith(gatedOption);
      expect(screen.queryByText(en.gatedAssetAcknowledgementModal.title)).not.toBeInTheDocument();
    });
  });
});
