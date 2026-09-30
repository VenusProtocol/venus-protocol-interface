import type { Mock } from 'vitest';

import { en } from 'libs/translations';

import { displayServiceIssueNotification } from '..';
import { displayNotification } from '../../utilities';

vi.mock('../../utilities', () => ({
  displayNotification: vi.fn(),
}));

describe('displayServiceIssueNotification', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows the service issue toast at most once per minute', () => {
    displayServiceIssueNotification();
    displayServiceIssueNotification();

    expect(displayNotification).toHaveBeenCalledTimes(1);
    expect(displayNotification).toHaveBeenCalledWith({
      variant: 'error',
      description: en.errors.serviceIssue,
    });

    vi.advanceTimersByTime(59000);
    displayServiceIssueNotification();

    expect(displayNotification).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(1000);
    displayServiceIssueNotification();

    expect((displayNotification as Mock).mock.calls).toHaveLength(2);
  });
});
