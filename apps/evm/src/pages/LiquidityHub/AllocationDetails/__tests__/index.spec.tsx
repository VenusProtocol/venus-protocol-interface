import BigNumber from 'bignumber.js';

import { liquidityHubs } from '__mocks__/models/liquidityHubs';
import { renderComponent } from 'testUtils/render';
import { AllocationDetails } from '..';

vi.mock('components/Tooltip', () => ({
  Tooltip: ({ children, content }: { children: React.ReactNode; content: React.ReactNode }) => (
    <div>
      <div>{content}</div>
      {children}
    </div>
  ),
}));

vi.mock('motion/react', () => ({
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
}));

describe('AllocationDetails', () => {
  it('renders allocation bars relative to total supply and shows the unallocated tooltip row', () => {
    const liquidityHub = {
      ...liquidityHubs[0],
      supplyBalanceCents: new BigNumber(1000),
      yieldGroups: [
        {
          ...liquidityHubs[0].yieldGroups[0],
          allocationCents: new BigNumber(600),
        },
        {
          ...liquidityHubs[0].yieldGroups[1],
          allocationCents: new BigNumber(50),
        },
      ],
    };

    const { container } = renderComponent(<AllocationDetails liquidityHub={liquidityHub} />);

    expect(container.textContent).toMatchSnapshot();
  });

  it('renders zero allocation percentages when total supply is zero', () => {
    const liquidityHub = {
      ...liquidityHubs[0],
      supplyBalanceCents: new BigNumber(0),
      yieldGroups: [
        {
          ...liquidityHubs[0].yieldGroups[0],
          allocationCents: new BigNumber(600),
        },
        {
          ...liquidityHubs[0].yieldGroups[1],
          allocationCents: new BigNumber(50),
        },
      ],
    };

    const { container } = renderComponent(<AllocationDetails liquidityHub={liquidityHub} />);

    expect(container.textContent).toMatchSnapshot();
  });
});
