import Vi from 'vitest';

import { renderComponent } from 'testUtils/render';

import { en } from 'packages/translations';

import { LunaUstWarningModal } from '..';
import { useLunaUstWarning } from '../../useLunaUstWarning';

vi.mock('../../useLunaUstWarning');

describe('LunaUstWarningModal', () => {
  beforeEach(() => {
    (useLunaUstWarning as Vi.Mock).mockImplementation(() => ({
      userHasLunaOrUstCollateralEnabled: false,
      isLunaUstWarningModalOpen: false,
      hasLunaUstWarningModalBeenOpened: false,
      closeLunaUstWarningModal: vi.fn(),
      openLunaUstWarningModal: vi.fn(),
    }));
  });

  it('calls openLunaUstWarningModal function when userHasLunaOrUstCollateralEnabled property becomes true', () => {
    const openLunaUstWarningModalMock = vi.fn();

    (useLunaUstWarning as Vi.Mock).mockImplementation(() => ({
      userHasLunaOrUstCollateralEnabled: false,
      openLunaUstWarningModal: openLunaUstWarningModalMock,
      isLunaUstWarningModalOpen: false,
      closeLunaUstWarningModal: vi.fn(),
    }));

    const { queryByText, rerender } = renderComponent(<LunaUstWarningModal />);

    expect(queryByText(en.lunaUstWarningModal.title)).toBeNull();

    // Simulate userHasLunaOrUstCollateralEnabled becoming true
    (useLunaUstWarning as Vi.Mock).mockImplementation(() => ({
      userHasLunaOrUstCollateralEnabled: true,
      hasLunaUstWarningModalBeenOpened: false,
      openLunaUstWarningModal: openLunaUstWarningModalMock,
      isLunaUstWarningModalOpen: false,
      closeLunaUstWarningModal: vi.fn(),
    }));

    rerender(<LunaUstWarningModal />);

    expect(openLunaUstWarningModalMock).toHaveBeenCalledTimes(1);
  });

  it('does nothing when userHasLunaOrUstCollateralEnabled property becomes true but hasLunaUstWarningModalBeenOpened is true', () => {
    const openLunaUstWarningModalMock = vi.fn();

    (useLunaUstWarning as Vi.Mock).mockImplementation(() => ({
      userHasLunaOrUstCollateralEnabled: false,
      hasLunaUstWarningModalBeenOpened: true,
      openLunaUstWarningModal: openLunaUstWarningModalMock,
      isLunaUstWarningModalOpen: false,
      closeLunaUstWarningModal: vi.fn(),
    }));

    const { queryByText, rerender } = renderComponent(<LunaUstWarningModal />);

    expect(queryByText(en.lunaUstWarningModal.title)).toBeNull();

    // Simulate userHasLunaOrUstCollateralEnabled becoming true
    (useLunaUstWarning as Vi.Mock).mockImplementation(() => ({
      userHasLunaOrUstCollateralEnabled: true,
      hasLunaUstWarningModalBeenOpened: true,
      openLunaUstWarningModal: openLunaUstWarningModalMock,
      isLunaUstWarningModalOpen: false,
      closeLunaUstWarningModal: vi.fn(),
    }));

    rerender(<LunaUstWarningModal />);

    expect(openLunaUstWarningModalMock).not.toHaveBeenCalled();
  });
});
