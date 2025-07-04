import { defaultUserChainSettings } from '..';

export { defaultUserChainSettings } from '..';

export const useUserChainSettings = vi.fn(() => [defaultUserChainSettings, vi.fn()]);
