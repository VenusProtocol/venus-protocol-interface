import type { Mock } from 'vitest';

import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';

import { displayServiceIssueNotification } from '..';
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

let testStartMs = new Date('2026-01-01T00:00:00Z').getTime();

describe('displayServiceIssueNotification', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    testStartMs += 3600000;
    vi.setSystemTime(testStartMs);
    (displayNotification as Mock).mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows the service issue toast at most once per minute', () => {
    displayServiceIssueNotification(details);
    displayServiceIssueNotification(details);

    expect(displayNotification).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(59000);
    displayServiceIssueNotification(details);

    expect(displayNotification).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(1000);
    displayServiceIssueNotification(details);

    expect(displayNotification).toHaveBeenCalledTimes(2);
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
      variant: 'error',
      title: en.errors.serviceIssueTitle,
      description: en.errors.serviceIssue,
    });
  });
});
