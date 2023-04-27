// react-testing-library renders your components to document.body,
// this adds jest-dom's custom assertions
import '@testing-library/jest-dom';
import 'jest-canvas-mock';

import { SWAP_TOKENS } from 'constants/tokens';
import useTokenApproval from 'hooks/useTokenApproval';

jest.mock('utilities/isFeatureEnabled');
jest.mock('hooks/useTokenApproval');

const useTokenApprovalOriginalOutput = useTokenApproval(
  // These aren't used since useTokenApproval is mocked
  {
    token: SWAP_TOKENS.cake,
    spenderAddress: '',
    accountAddress: '',
  },
);

afterEach(() => {
  (useTokenApproval as jest.Mock).mockImplementation(() => useTokenApprovalOriginalOutput);
});
