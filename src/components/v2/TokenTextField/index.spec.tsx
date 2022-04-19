import React from 'react';
import noop from 'noop-ts';
import BigNumber from 'bignumber.js';
import { fireEvent } from '@testing-library/react';

import renderComponent from 'testUtils/renderComponent';
import { TokenTextField } from '.';

const ONE_XVS = '1';
const XVS_DECIMALS = 18;
const testId = 'token-text-field-input';

describe('components/TokenTextField', () => {
  it('renders without crashing', async () => {
    renderComponent(<TokenTextField tokenSymbol="xvs" onChange={noop} value="" />);
  });

  it('does not let user enter value with more decimal places than token associated to tokenSymbol provided has', async () => {
    const onChangeMock = jest.fn();
    const { getByTestId } = renderComponent(
      <TokenTextField tokenSymbol="xvs" onChange={onChangeMock} value="" data-testid={testId} />,
    );

    const input = getByTestId(testId) as HTMLInputElement;

    const oneWeiInXvs = new BigNumber(ONE_XVS)
      .dividedBy(new BigNumber(10).pow(XVS_DECIMALS))
      .toFixed();

    // Update input value
    fireEvent.change(input, { target: { value: oneWeiInXvs } });

    // Check value passed to onChange callback was correct
    expect(onChangeMock).toHaveBeenCalledTimes(1);
    expect(onChangeMock).toHaveBeenCalledWith(oneWeiInXvs);

    // Update input value
    const invalidValue = new BigNumber(ONE_XVS)
      .dividedBy(new BigNumber(10).pow(XVS_DECIMALS + 1))
      .toFixed();
    fireEvent.change(input, { target: { value: invalidValue } });

    // Check onChange callback wasn't called again
    expect(onChangeMock).toHaveBeenCalledTimes(1);
  });

  it('renders max button and updates value to maxWei when pressing on it', async () => {
    const onChangeMock = jest.fn();
    const rightMaxButtonLabel = 'Test max button label';

    const { getByText } = renderComponent(
      <TokenTextField
        tokenSymbol="xvs"
        onChange={onChangeMock}
        value=""
        data-testid={testId}
        max={ONE_XVS}
        rightMaxButtonLabel={rightMaxButtonLabel}
      />,
    );

    const rightMaxButton = getByText(rightMaxButtonLabel) as HTMLButtonElement;

    fireEvent.click(rightMaxButton);

    // Check onChange callback was called with maxWei
    expect(onChangeMock).toHaveBeenCalledWith(ONE_XVS);
  });
});
