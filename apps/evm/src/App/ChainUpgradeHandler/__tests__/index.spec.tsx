import { renderComponent } from 'testUtils/render';

import type { MockInstance } from 'vitest';
import { ChainUpgradeHandler } from '../';

const runtimeTimestamp = new Date().getTime();
const upgradeTimestamps = [new Date(runtimeTimestamp + 2000)];
const fakeNowMs = runtimeTimestamp + 12000;

describe('ChainUpgradeHandler', () => {
  const original = window.location;
  let reloadSpy: MockInstance;

  beforeEach(() => {
    // 1. Redefine the 'reload' property on window.location to be configurable.
    // This is necessary because it is non-configurable by default in jsdom.
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: () => {}, // Provide a dummy function initially
    });

    Object.defineProperty(window.location, 'reload', {
      configurable: true,
      value: () => {}, // Provide a dummy function initially
    });

    // 2. Create the spy on the now-configurable property.
    reloadSpy = vi.spyOn(window.location, 'reload');
  });

  afterAll(() => {
    Object.defineProperty(window, 'location', { configurable: true, value: original });
  });

  it('auto reload after passing hardforks', () => {
    vi.useFakeTimers().setSystemTime(new Date(fakeNowMs));

    renderComponent(<ChainUpgradeHandler upgradeTimestamps={upgradeTimestamps} />);

    expect(reloadSpy).toHaveBeenCalled();
  });
});
