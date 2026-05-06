import BigNumber from 'bignumber.js';

import { usdc } from '__mocks__/models/tokens';
import { renderComponent } from 'testUtils/render';

import { Progress } from '..';

const getProgressFill = (container: HTMLElement) => {
  const progressFill = container.querySelector('.w-25 > div');

  expect(progressFill).toBeInTheDocument();

  return progressFill as HTMLDivElement;
};

describe('Progress', () => {
  it('renders the amount, max value, and percentage', () => {
    const { getByText } = renderComponent(
      <Progress token={usdc} amountTokens={new BigNumber('50')} maxTokens={new BigNumber('100')} />,
    );

    expect(getByText('50 USDC / 100 USDC')).toBeInTheDocument();
    expect(getByText('50%')).toBeInTheDocument();
  });

  it('uses a blue progress bar below 80 percent', () => {
    const { container } = renderComponent(
      <Progress token={usdc} amountTokens={new BigNumber('50')} maxTokens={new BigNumber('100')} />,
    );

    const progressFill = getProgressFill(container);

    expect(progressFill).toHaveClass('bg-blue');
    expect(progressFill).toHaveStyle({ width: '50%' });
  });

  it('uses a green progress bar at or above 80 percent', () => {
    const { container, getByText } = renderComponent(
      <Progress token={usdc} amountTokens={new BigNumber('80')} maxTokens={new BigNumber('100')} />,
    );

    const progressFill = getProgressFill(container);

    expect(getByText('80%')).toBeInTheDocument();
    expect(progressFill).toHaveClass('bg-green');
    expect(progressFill).toHaveStyle({ width: '80%' });
  });

  it('caps the displayed percentage and width at 100 percent', () => {
    const { container, getByText } = renderComponent(
      <Progress
        token={usdc}
        amountTokens={new BigNumber('150')}
        maxTokens={new BigNumber('100')}
      />,
    );

    const progressFill = getProgressFill(container);

    expect(getByText('150 USDC / 100 USDC')).toBeInTheDocument();
    expect(getByText('100%')).toBeInTheDocument();
    expect(progressFill).toHaveStyle({ width: '100%' });
  });

  it('applies the custom progress bar override class', () => {
    const { container } = renderComponent(
      <Progress
        token={usdc}
        amountTokens={new BigNumber('50')}
        maxTokens={new BigNumber('100')}
        progressBarClassName="bg-yellow"
      />,
    );

    expect(getProgressFill(container)).toHaveClass('bg-yellow');
  });
});
