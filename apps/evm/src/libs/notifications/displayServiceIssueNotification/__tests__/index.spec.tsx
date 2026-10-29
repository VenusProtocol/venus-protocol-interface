import type { Mock } from 'vitest';

import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';

import { displayServiceIssueNotification } from '..';
import { useStore } from '../../store';
import { displayNotification } from '../../utilities';

vi.mock('../../utilities', () => ({
  displayNotification: vi.fn(),
}));

const details = {
  method: 'GET' as const,
  endpoint: '/pools',
  status: 503,
  error: 'Upstream timeout',
};

let testIndex = 0;

describe('displayServiceIssueNotification', () => {
  beforeEach(() => {
    testIndex += 1;
    window.location.hash = `#/page-${testIndex}`;
    useStore.setState({ notifications: [] });
    (displayNotification as Mock).mockClear();
  });

  it('shows the service issue toast at most once per page, however long the API keeps failing', () => {
    vi.useFakeTimers();

    displayServiceIssueNotification(details);
    vi.advanceTimersByTime(3600000);
    displayServiceIssueNotification(details);

    expect(displayNotification).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  it('shows the service issue toast again after navigating to another page', () => {
    displayServiceIssueNotification(details);

    window.location.hash = `#/page-${testIndex}-other`;
    displayServiceIssueNotification(details);

    expect(displayNotification).toHaveBeenCalledTimes(2);
  });

  it('treats a search parameter change as the same page', () => {
    window.location.hash = `#/page-${testIndex}?chainId=56`;
    displayServiceIssueNotification(details);

    window.location.hash = `#/page-${testIndex}?chainId=56&tab=supply`;
    displayServiceIssueNotification(details);

    expect(displayNotification).toHaveBeenCalledTimes(1);
  });

  it('titles the toast and keeps the request details in a collapsed section', () => {
    displayServiceIssueNotification(details);

    const [{ variant, title, description }] = (displayNotification as Mock).mock.calls[0];
    const { container, getByText } = renderComponent(description);

    expect(variant).toBe('error');
    expect(title).toBe(en.errors.serviceIssueTitle);
    expect(getByText(en.errors.serviceIssue)).toBeInTheDocument();
    expect(container.querySelector('details')).not.toHaveAttribute('open');
    expect(getByText(en.errors.serviceIssueDetails)).toBeInTheDocument();
    expect(container.textContent).toContain('GET /pools · 503');
    expect(container.textContent).toContain('Upstream timeout');
  });

  it('shows only the message when there are no request details', () => {
    displayServiceIssueNotification();

    expect(displayNotification).toHaveBeenCalledWith({
      id: 'service-issue',
      variant: 'error',
      title: en.errors.serviceIssueTitle,
      description: en.errors.serviceIssue,
    });
  });

  it('shows one toast when a failing page redirects to another one', () => {
    (displayNotification as Mock).mockImplementation(({ id }) =>
      useStore.getState().addNotification({ id, variant: 'error', description: '' }),
    );

    displayServiceIssueNotification(details);

    window.location.hash = `#/page-${testIndex}-redirected`;
    displayServiceIssueNotification(details);

    expect(displayNotification).toHaveBeenCalledTimes(1);
  });

  it('does not show a second toast on the redirect target once the first one closes', () => {
    (displayNotification as Mock).mockImplementation(({ id }) =>
      useStore.getState().addNotification({ id, variant: 'error', description: '' }),
    );

    displayServiceIssueNotification(details);

    window.location.hash = `#/page-${testIndex}-redirected`;
    displayServiceIssueNotification(details);

    useStore.setState({ notifications: [] });
    displayServiceIssueNotification(details);

    expect(displayNotification).toHaveBeenCalledTimes(1);
  });

  it('shows the toast again on another page once the previous one is gone', () => {
    (displayNotification as Mock).mockImplementation(({ id }) =>
      useStore.getState().addNotification({ id, variant: 'error', description: '' }),
    );

    displayServiceIssueNotification(details);
    useStore.setState({ notifications: [] });

    window.location.hash = `#/page-${testIndex}-later`;
    displayServiceIssueNotification(details);

    expect(displayNotification).toHaveBeenCalledTimes(2);
  });
});
