// react-testing-library renders your components to document.body,
// this adds jest-dom's custom assertions
import '@testing-library/jest-dom';
import initializeLibraries from 'initializeLibraries';
import Vi from 'vitest';
// Polyfill "window.fetch"
import 'whatwg-fetch';

import { xvs } from '__mocks__/models/tokens';
import useTokenApproval from 'hooks/useTokenApproval';

vi.mock('utilities/isFeatureEnabled');
vi.mock('hooks/useTokenApproval');
vi.mock('clients/api');
vi.mock('clients/web3/Web3Wrapper');
vi.mock('packages/tokens');

// Mock zustand library (optimized state manager)
vi.mock('zustand');

// Mock React Markdown library
vi.mock('@uiw/react-md-editor', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  default: ({ onChange, previewOptions, textareaProps, commands, ...otherProps }: any) => (
    <input onChange={e => onChange(e.currentTarget.value)} {...otherProps} />
  ),
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  default: ({ content, ...otherProps }: any) => <p {...otherProps}>content</p>,
}));

initializeLibraries();

const useTokenApprovalOriginalOutput = useTokenApproval(
  // These aren't used since useTokenApproval is mocked
  {
    token: xvs,
    spenderAddress: '',
    accountAddress: '',
  },
);

beforeEach(() => {
  vi.restoreAllMocks();
  global.fetch = vi.fn();
});

afterEach(() => {
  (useTokenApproval as Vi.Mock).mockImplementation(() => useTokenApprovalOriginalOutput);
});
