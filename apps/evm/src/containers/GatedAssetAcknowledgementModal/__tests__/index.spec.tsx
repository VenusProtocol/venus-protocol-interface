import { fireEvent, screen } from '@testing-library/react';
import type { Mock } from 'vitest';

import { defaultUserChainSettings, useUserChainSettings } from 'hooks/useUserChainSettings';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import { GatedAssetAcknowledgementModal } from '..';

const mockSetUserChainSettings = vi.fn();

describe('GatedAssetAcknowledgementModal', () => {
  beforeEach(() => {
    (useUserChainSettings as Mock).mockReturnValue([
      defaultUserChainSettings,
      mockSetUserChainSettings,
    ]);
  });

  it('does not render when the notice has already been acknowledged', () => {
    (useUserChainSettings as Mock).mockReturnValue([
      {
        ...defaultUserChainSettings,
        doNotShowGatedAssetModal: true,
      },
      mockSetUserChainSettings,
    ]);

    renderComponent(<GatedAssetAcknowledgementModal />);

    expect(screen.queryByText(en.gatedAssetAcknowledgementModal.title)).not.toBeInTheDocument();
  });

  it('acknowledges the notice and calls onAccept when accepting', () => {
    const onAccept = vi.fn();

    renderComponent(<GatedAssetAcknowledgementModal onAccept={onAccept} />);

    fireEvent.click(
      screen.getByRole('button', {
        name: en.gatedAssetAcknowledgementModal.acceptButtonLabel,
      }),
    );

    expect(mockSetUserChainSettings).toHaveBeenCalledWith({
      doNotShowGatedAssetModal: true,
    });
    expect(onAccept).toHaveBeenCalledTimes(1);
  });

  it('resets the acknowledgement and calls onReject when rejecting', () => {
    const onReject = vi.fn();

    renderComponent(<GatedAssetAcknowledgementModal onReject={onReject} />);

    fireEvent.click(
      screen.getByRole('button', {
        name: en.gatedAssetAcknowledgementModal.rejectButtonLabel,
      }),
    );

    expect(mockSetUserChainSettings).toHaveBeenCalledWith({
      doNotShowGatedAssetModal: false,
    });
    expect(onReject).toHaveBeenCalledTimes(1);
  });
});
