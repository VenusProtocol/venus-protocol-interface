// react-testing-library renders your components to document.body,
// this adds jest-dom's custom assertions
import '@testing-library/jest-dom';
import initializeLibraries from 'initializeLibraries';
import React from 'react';
import Vi from 'vitest';
// Polyfill "window.fetch"
import 'whatwg-fetch';

import { SWAP_TOKENS } from 'constants/tokens';
import useTokenApproval from 'hooks/useTokenApproval';

vi.mock('utilities/isFeatureEnabled');
vi.mock('hooks/useTokenApproval');
vi.mock('clients/api');
vi.mock('clients/web3/Web3Wrapper');

// Mock Lottie
vi.mock('@lottiefiles/react-lottie-player', () => ({
  Player: () => <></>,
}));

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
    token: SWAP_TOKENS.cake,
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
