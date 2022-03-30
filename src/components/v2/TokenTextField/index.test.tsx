import React from 'react';
import noop from 'noop-ts';
import { fireEvent } from '@testing-library/react';
import BigNumber from 'bignumber.js';

import renderComponent from 'testUtils/renderComponent';
import { TokenTextField } from '.';

const oneXvsInWei = new BigNumber(10).pow(18);
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

  it('prevents user from entering value higher than max', async () => {
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

    // Update input value
    const valueXvs = '10';
    fireEvent.change(input, { target: { value: valueXvs } });

    // Check onChange callback was not called
    expect(onChangeMock).not.toHaveBeenCalled();
  });
});
