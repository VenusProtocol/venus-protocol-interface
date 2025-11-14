import { fireEvent } from '@testing-library/react';
import type { Mock } from 'vitest';

import { bnb, xvs } from '__mocks__/models/tokens';
import { defaultUserChainSettings, useUserChainSettings } from 'hooks/useUserChainSettings';
import { renderComponent } from 'testUtils/render';
import { formatPercentageToReadableValue } from 'utilities';
import { SwapDetails, type SwapDetailsProps } from '..';

const props: SwapDetailsProps = {
  fromToken: bnb,
  toToken: xvs,
  priceImpactPercentage: 0.871,
};

describe('SwapDetails', () => {
  it('renders correctly', () => {
    const { container } = renderComponent(<SwapDetails {...props} />);

    expect(container.textContent).toMatchSnapshot();
  });

  it('lets user update slippage tolerance using preset', () => {
    const mockSetUserChainSettings = vi.fn();

    (useUserChainSettings as Mock).mockReturnValue([
      defaultUserChainSettings,
      mockSetUserChainSettings,
    ]);

    const { getByRole, getByText } = renderComponent(<SwapDetails {...props} />);

    // Open modal
    fireEvent.click(getByRole('button'));

    const presetValue = '0.1';

    // Click on preset
    fireEvent.click(getByText(formatPercentageToReadableValue(presetValue)));

    expect(mockSetUserChainSettings).toHaveBeenCalledWith({
      slippageTolerancePercentage: presetValue,
    });
  });

  it('lets user update slippage tolerance using input', () => {
    const mockSetUserChainSettings = vi.fn();

    (useUserChainSettings as Mock).mockReturnValue([
      defaultUserChainSettings,
      mockSetUserChainSettings,
    ]);

    const { getByRole } = renderComponent(<SwapDetails {...props} />);

    // Open modal
    fireEvent.click(getByRole('button'));

    // Enter amount in input
    const input = getByRole('spinbutton');

    const value = '0.13';

    fireEvent.change(input, {
      target: { value },
    });

    expect(mockSetUserChainSettings).toHaveBeenCalledWith({
      slippageTolerancePercentage: value,
    });

    // Check decimals are validated
    fireEvent.change(input, { target: { value: '0.1234' } });
    expect(mockSetUserChainSettings).toHaveBeenCalledTimes(1);
  });
});
