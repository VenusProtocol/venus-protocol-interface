import React from 'react';
import noop from 'noop-ts';
import { fireEvent } from '@testing-library/react';
import BigNumber from 'bignumber.js';

import renderComponent from 'testUtils/renderComponent';
import { TokenTextField } from '.';

const oneXvsInWei = new BigNumber(10).pow(18);
const oneWeiInXvs = new BigNumber(1).dividedBy(oneXvsInWei);

const testId = 'token-text-field-input';

describe('components/TokenTextField', () => {
  it('renders without crashing', async () => {
    renderComponent(<TokenTextField tokenSymbol="xvs" onChange={noop} value="" />);
  });

  it('converts passed wei value into readable value expressed in coins', async () => {
    const onChangeMock = jest.fn();
    const { getByTestId } = renderComponent(
      <TokenTextField
        tokenSymbol="xvs"
        onChange={onChangeMock}
        value={oneXvsInWei}
        data-testid={testId}
      />,
    );

    const input = getByTestId(testId) as HTMLInputElement;

    expect(input.value).toBe('1');
  });

  it('lets user enter a value and calls onChange callback with correct value', async () => {
    const onChangeMock = jest.fn();
    const { getByTestId } = renderComponent(
      <TokenTextField tokenSymbol="xvs" onChange={onChangeMock} value="" data-testid={testId} />,
    );

    const input = getByTestId(testId) as HTMLInputElement;

    // Update input value
    const valueXvs = '10';
    fireEvent.change(input, { target: { value: valueXvs } });

    // Check value passed to onChange callback was converted into wei
    const valueWei = new BigNumber(valueXvs).multipliedBy(new BigNumber(10).pow(18));
    expect(onChangeMock).toHaveBeenCalledWith(valueWei);
  });

  it('passes the correct max and step values down to the TextField component', async () => {
    const onChangeMock = jest.fn();
    const { getByTestId } = renderComponent(
      <TokenTextField
        tokenSymbol="xvs"
        onChange={onChangeMock}
        value=""
        data-testid={testId}
        maxWei={oneXvsInWei}
      />,
    );

    const input = getByTestId(testId) as HTMLInputElement;

    expect(input.max).toBe('1');
    expect(input.step).toBe(oneWeiInXvs.toString());
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
        maxWei={oneXvsInWei}
        rightMaxButtonLabel={rightMaxButtonLabel}
      />,
    );

    const rightMaxButton = getByText(rightMaxButtonLabel) as HTMLButtonElement;

    fireEvent.click(rightMaxButton);

    // Check onChange callback was called with maxWei
    expect(onChangeMock).toHaveBeenCalledWith(oneXvsInWei);
  });
});
