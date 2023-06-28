import { fireEvent } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';
import React from 'react';

import { TOKENS } from 'constants/tokens';
import renderComponent from 'testUtils/renderComponent';

import { TokenTextField } from '.';

const ONE_XVS = '1';
const testId = 'token-text-field-input';

describe('components/TokenTextField', () => {
  it('renders without crashing', async () => {
    renderComponent(<TokenTextField token={TOKENS.xvs} onChange={noop} value="" />);
  });

  it('does not let user enter value with more decimal places than token associated to tokenSymbol provided has', async () => {
    const onChangeMock = vi.fn();
    const { getByTestId } = renderComponent(
      <TokenTextField token={TOKENS.xvs} onChange={onChangeMock} value="" data-testid={testId} />,
    );

    const input = getByTestId(testId) as HTMLInputElement;

    const oneWeiInXvs = new BigNumber(ONE_XVS)
      .dividedBy(new BigNumber(10).pow(TOKENS.xvs.decimals))
      .toFixed();

    // Update input value
    fireEvent.change(input, { target: { value: oneWeiInXvs } });

    // Check value passed to onChange callback was correct
    expect(onChangeMock).toHaveBeenCalledTimes(1);
    expect(onChangeMock).toHaveBeenCalledWith(oneWeiInXvs);

    // Update input value
    const invalidValue = new BigNumber(ONE_XVS)
      .dividedBy(new BigNumber(10).pow(TOKENS.xvs.decimals + 1))
      .toFixed();
    fireEvent.change(input, { target: { value: invalidValue } });

    // Check onChange callback wasn't called again
    expect(onChangeMock).toHaveBeenCalledTimes(1);
  });

  it('passes the correct max and step values down to the TextField component', async () => {
    const oneWeiInXvs = new BigNumber(ONE_XVS).dividedBy(new BigNumber(10).pow(18));

    const onChangeMock = vi.fn();
    const { getByTestId } = renderComponent(
      <TokenTextField
        token={TOKENS.xvs}
        onChange={onChangeMock}
        value=""
        data-testid={testId}
        max={ONE_XVS}
      />,
    );

    const input = getByTestId(testId) as HTMLInputElement;

    expect(input.max).toBe(ONE_XVS);
    expect(input.step).toBe(oneWeiInXvs.toFixed());
  });

  it('renders max button and updates value to provided value when pressing on it', async () => {
    const onMaxButtonClickMock = vi.fn();
    const rightMaxButton = {
      label: 'Test max button label',
      onClick: onMaxButtonClickMock,
    };

    const { getByText } = renderComponent(
      <TokenTextField
        token={TOKENS.xvs}
        onChange={noop}
        value=""
        data-testid={testId}
        max={ONE_XVS}
        rightMaxButton={rightMaxButton}
      />,
    );

    const rightMaxButtonDom = getByText(rightMaxButton.label) as HTMLButtonElement;
    fireEvent.click(rightMaxButtonDom);

    // Check onClick prop of max button was called
    expect(onMaxButtonClickMock).toHaveBeenCalledTimes(1);
  });
});
