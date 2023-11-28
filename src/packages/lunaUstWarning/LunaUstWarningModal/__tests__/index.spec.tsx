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
      openLunaUstWarningModal: openLunaUstWarningModalMock,
      isLunaUstWarningModalOpen: false,
      closeLunaUstWarningModal: vi.fn(),
    }));

    rerender(<LunaUstWarningModal />);

    expect(openLunaUstWarningModalMock).toHaveBeenCalledTimes(1);
  });
});
