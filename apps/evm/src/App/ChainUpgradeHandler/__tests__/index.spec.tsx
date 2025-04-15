import { renderComponent } from 'testUtils/render';
import type { Mock } from 'vitest';

import { useNow } from 'hooks/useNow';

vi.mock('hooks/useNow');

const mockReload = vi.fn();

// Mock window.location.reload
Object.defineProperty(window, 'location', {
  value: { reload: mockReload },
  writable: true,
});

const fakeRuntimeTimestamp = new Date('2023-01-01');
const fakeNowTimestamp = new Date('2023-01-01');

describe('ChainUpgradeHandler', () => {
  beforeEach(() => {
    vi.useFakeTimers().setSystemTime(fakeRuntimeTimestamp);
    (useNow as Mock).mockReturnValue(fakeNowTimestamp);
  });

  afterEach(() => {
    mockReload.mockClear();
    vi.useRealTimers();
  });

  it('renders without crashing', async () => {
    const { ChainUpgradeHandler } = await import('..');

    renderComponent(<ChainUpgradeHandler upgradeTimestamps={[]} />);
  });

  it('does not reload when none of the upgrade timestamps is reached yet', async () => {
    const { ChainUpgradeHandler } = await import('..');

    renderComponent(
      <ChainUpgradeHandler
        upgradeTimestamps={[new Date('2023-01-02'), new Date('2023-01-03'), new Date('2023-01-04')]}
      />,
    );

    expect(mockReload).not.toHaveBeenCalled();
  });

  it('reloads when an upgrade timestamp is reached', async () => {
    const { ChainUpgradeHandler } = await import('..');

    const { rerender } = renderComponent(
      <ChainUpgradeHandler upgradeTimestamps={[new Date('2023-01-02')]} />,
    );

    expect(mockReload).not.toHaveBeenCalled();

    // Fast-forward
    (useNow as Mock).mockReturnValue(new Date('2023-01-03'));

    rerender(<ChainUpgradeHandler upgradeTimestamps={[new Date('2023-01-03')]} />);

    expect(mockReload).toHaveBeenCalledTimes(1);
  });
});
