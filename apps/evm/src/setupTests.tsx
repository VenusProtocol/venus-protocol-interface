// react-testing-library renders your components to document.body,
// this adds jest-dom's custom assertions
import '@testing-library/jest-dom';
import initializeLibraries from 'initializeLibraries';
import type { Mock } from 'vitest';
// Polyfill "window.fetch"
import 'whatwg-fetch';

import { xvs } from '__mocks__/models/tokens';

import type { Config } from 'config';
import { NULL_ADDRESS } from 'constants/address';
import useTokenApproval from 'hooks/useTokenApproval';

// Mock config
vi.mock('config', async () => {
  const actual = await vi.importActual('config');
  const actualConfig = actual.default as Config;

  const fakeConfig: Config = {
    environment: 'ci',
    network: 'testnet',
    apiUrl: 'fakeApiUrl',
    rpcUrls: actualConfig.rpcUrls,
    governanceSubgraphUrls: actualConfig.governanceSubgraphUrls,
    isSafeApp: false,
    sentryDsn: 'fakeSentryDsn',
    posthog: {
      apiKey: 'fakePostHostApiKey',
      hostUrl: 'fakePostHogHostUrl',
    },
    zyFiApiKey: 'fakeZyFiApiKey',
    biconomyApiKey: 'fakeBiconomyApiKey',
    safeApiKey: 'fakeSafeApiKey',
  };

  return {
    default: fakeConfig,
  };
});

vi.mock('hooks/useIsFeatureEnabled');
vi.mock('hooks/useTokenApproval');
vi.mock('hooks/useSendTransaction');
vi.mock('hooks/useGetContractAddress');
vi.mock('hooks/useUserChainSettings');
vi.mock('clients/api');
vi.mock('clients/subgraph');
vi.mock('libs/analytics');
vi.mock('libs/tokens');
vi.mock('libs/wallet');
vi.mock('components/Redirect');
vi.mock('components/Carousel');
vi.mock('hooks/useDebounceValue', () => ({
  default: (value: unknown) => value,
}));

// Mock zustand library (optimized state manager)
vi.mock('zustand');

// Mock React Markdown library
vi.mock('@uiw/react-md-editor', () => ({
  default: ({
    onChange,
    previewOptions: _previewOptions,
    textareaProps: _textareaProps,
    commands: _commands,
    ...otherProps
  }: any) => <input onChange={e => onChange(e.currentTarget.value)} {...otherProps} />,
  commands: {
    title1: '',
    title2: '',
    title3: '',
    title4: '',
    unorderedListCommand: '',
    link: '',
    bold: '',
    italic: '',
  },
}));
vi.mock('@uiw/react-markdown-preview', () => ({
  default: ({ content: _content, ...otherProps }: any) => <p {...otherProps}>content</p>,
}));

// Mock chart library
vi.mock('recharts');

initializeLibraries();

global.fetch = vi.fn();
// @ts-ignore this is work around to fix an issue where certain vitest functions do not work
// properly when using fake timers (see
// https://github.com/testing-library/react-hooks-testing-library/issues/631)
global.jest = vi;

const useTokenApprovalOriginalOutput = useTokenApproval(
  // These aren't used since useTokenApproval is mocked
  {
    token: xvs,
    spenderAddress: NULL_ADDRESS,
    accountAddress: NULL_ADDRESS,
  },
);

afterEach(() => {
  vi.useRealTimers();

  (useTokenApproval as Mock).mockImplementation(() => useTokenApprovalOriginalOutput);
});
