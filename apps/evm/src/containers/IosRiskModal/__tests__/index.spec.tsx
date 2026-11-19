import { fireEvent, screen } from '@testing-library/react';
import type { Mock } from 'vitest';

import { useIosRiskModal } from 'hooks/useIosRiskModal';
import { IOS_RISK_ACK_STORAGE_KEY, useStore } from 'hooks/useIosRiskModal/store';
import { type UseIsFeatureEnabledInput, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useAnalytics } from 'libs/analytics';
import { en } from 'libs/translations';
import { renderComponent, renderHook } from 'testUtils/render';

import IosRiskModal, { IOS_UPDATE_GUIDE_URL } from '..';

const risk = {
  status: 'affected' as const,
  kit: 'Coruna' as const,
  version: '17.1.2',
  from: '13.0',
  to: '17.2.1',
};

const captureAnalyticEventMock = vi.fn();

const getInput = () => screen.getByPlaceholderText('I understand the risks');
const getContinueButton = () =>
  screen.getByRole('button', { name: en.iosRiskModal.continueButton });

describe('IosRiskModal', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    useStore.setState({ risk, isAcknowledged: false });
    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabledInput) => name === 'iosExploitWarning',
    );
    (useAnalytics as Mock).mockImplementation(() => ({
      captureAnalyticEvent: captureAnalyticEventMock,
    }));
  });

  it('shows the detected version and kit with no way to close it', () => {
    renderComponent(<IosRiskModal />);

    expect(screen.getByText(en.iosRiskModal.title)).toBeInTheDocument();
    expect(screen.getByText('iOS 17.1.2 is affected by Coruna')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
    expect(getContinueButton()).toBeDisabled();
    expect(captureAnalyticEventMock).toHaveBeenCalledWith(
      'ios_risk_popup_shown',
      expect.objectContaining({ kit: 'Coruna', ios_version: '17.1.2', wallet_connected: false }),
    );
  });

  it('does not render when the feature flag is off', () => {
    (useIsFeatureEnabled as Mock).mockImplementation(() => false);

    renderComponent(<IosRiskModal />);

    expect(screen.queryByText(en.iosRiskModal.title)).not.toBeInTheDocument();
  });

  it('does not render once acknowledged in this session', () => {
    useStore.setState({ isAcknowledged: true });

    renderComponent(<IosRiskModal />);

    expect(screen.queryByText(en.iosRiskModal.title)).not.toBeInTheDocument();
  });

  it('shows the mismatch message after leaving the field with wrong text', () => {
    renderComponent(<IosRiskModal />);

    fireEvent.change(getInput(), { target: { value: 'I understand' } });
    fireEvent.blur(getInput());

    expect(
      screen.getByText("Text doesn't match. Type: I understand the risks"),
    ).toBeInTheDocument();
    expect(getContinueButton()).toBeDisabled();
  });

  it('does not show the mismatch message when leaving an empty field', () => {
    renderComponent(<IosRiskModal />);

    fireEvent.blur(getInput());

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('closes and remembers the acknowledgement for the session on Continue', () => {
    renderComponent(<IosRiskModal />);

    fireEvent.change(getInput(), { target: { value: ' i understand the risks. ' } });
    expect(getContinueButton()).toBeEnabled();

    fireEvent.click(getContinueButton());

    expect(screen.queryByText(en.iosRiskModal.title)).not.toBeInTheDocument();
    expect(window.sessionStorage.getItem(IOS_RISK_ACK_STORAGE_KEY)).toBe('17.1.2');
    expect(captureAnalyticEventMock).toHaveBeenCalledWith(
      'ios_risk_acknowledged',
      expect.objectContaining({ kit: 'Coruna', ios_version: '17.1.2' }),
    );
  });

  it('submits with Enter when the text matches', () => {
    renderComponent(<IosRiskModal />);

    fireEvent.change(getInput(), { target: { value: 'I understand the risks' } });
    fireEvent.keyDown(getInput(), { key: 'Enter' });

    expect(screen.queryByText(en.iosRiskModal.title)).not.toBeInTheDocument();
  });

  it('shows the mismatch message on Enter with wrong text', () => {
    renderComponent(<IosRiskModal />);

    fireEvent.change(getInput(), { target: { value: 'nope' } });
    fireEvent.keyDown(getInput(), { key: 'Enter' });

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(en.iosRiskModal.title)).toBeInTheDocument();
  });

  it('links to the Apple update guide in a new tab and stays open', () => {
    renderComponent(<IosRiskModal />);

    const link = screen.getByRole('link', { name: en.iosRiskModal.updateButton });
    expect(link).toHaveAttribute('href', IOS_UPDATE_GUIDE_URL);
    expect(link).toHaveAttribute('target', '_blank');

    fireEvent.click(link);

    expect(captureAnalyticEventMock).toHaveBeenCalledWith('ios_risk_update_clicked', {
      kit: 'Coruna',
      ios_version: '17.1.2',
    });
    expect(screen.getByText(en.iosRiskModal.title)).toBeInTheDocument();
  });

  it('reports an unreadable iOS version without showing the pop-up', () => {
    useStore.setState({ risk: { status: 'unreadable' } });

    renderComponent(<IosRiskModal />);

    expect(screen.queryByText(en.iosRiskModal.title)).not.toBeInTheDocument();
    expect(captureAnalyticEventMock).toHaveBeenCalledWith(
      'ios_risk_detect_failed',
      expect.objectContaining({ user_agent: expect.any(String) }),
    );
  });

  it('keeps other app dialogs closed while it is open', () => {
    const { result } = renderHook(() => useIosRiskModal());

    expect(result.current.isOpen).toBe(true);
  });
});
