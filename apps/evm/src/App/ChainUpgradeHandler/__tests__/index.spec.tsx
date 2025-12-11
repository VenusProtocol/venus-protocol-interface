import { renderComponent } from 'testUtils/render';

import { ChainUpgradeHandler } from 'App/ChainUpgradeHandler';
import type { MockInstance } from 'vitest';

const runtimeTimestamp = new Date().getTime();
const upgradeTimestamps = [new Date(runtimeTimestamp + 2000)];
const fakeNowMs = runtimeTimestamp + 12000;

describe('ChainUpgradeHandler', () => {
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

  it('auto reload after passing hardforks', () => {
    vi.useFakeTimers().setSystemTime(new Date(fakeNowMs));

    renderComponent(<ChainUpgradeHandler upgradeTimestamps={upgradeTimestamps} />);

    expect(reloadSpy).toHaveBeenCalled();
  });
});
