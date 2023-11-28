// react-testing-library renders your components to document.body,
// this adds jest-dom's custom assertions
import '@testing-library/jest-dom';
import initializeLibraries from 'initializeLibraries';
import Vi from 'vitest';
// Polyfill "window.fetch"
import 'whatwg-fetch';

import { xvs } from '__mocks__/models/tokens';

import useTokenApproval from 'hooks/useTokenApproval';

vi.mock('hooks/useIsFeatureEnabled');
vi.mock('hooks/useTokenApproval');
vi.mock('clients/api');
vi.mock('packages/tokens');
vi.mock('packages/wallet');

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

initializeLibraries();

global.fetch = vi.fn();

// eslint-disable-next-line react-hooks/rules-of-hooks
const useTokenApprovalOriginalOutput = useTokenApproval(
  // These aren't used since useTokenApproval is mocked
  {
    token: xvs,
    spenderAddress: '',
    accountAddress: '',
  },
);

afterEach(() => {
  (useTokenApproval as Vi.Mock).mockImplementation(() => useTokenApprovalOriginalOutput);
});
