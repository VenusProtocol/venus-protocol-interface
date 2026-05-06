import { screen } from '@testing-library/react';

import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import { VaultStatus } from 'types';

import { StatusLabel } from '.';

interface StatusScenario {
  status: VaultStatus;
  expectedClassNames: string[];
  expectedLabel: string;
}

const statusScenarios: StatusScenario[] = [
  {
    status: VaultStatus.Claim,
    expectedClassNames: ['border-green', 'bg-green/10'],
    expectedLabel: en.vault.filter.claim,
  },
  {
    status: VaultStatus.Earning,
    expectedClassNames: ['border-green', 'bg-green/10'],
    expectedLabel: en.vault.filter.earning,
  },
  {
    status: VaultStatus.Refund,
    expectedClassNames: ['border-yellow', 'bg-yellow/10'],
    expectedLabel: en.vault.filter.refund,
  },
  {
    status: VaultStatus.Deposit,
    expectedClassNames: ['border-blue', 'bg-blue/10'],
    expectedLabel: en.vault.filter.deposit,
  },
  {
    status: VaultStatus.Active,
    expectedClassNames: ['border-blue', 'bg-blue/10'],
    expectedLabel: en.vault.filter.active,
  },
  {
    status: VaultStatus.Paused,
    expectedClassNames: ['border-dark-grey-hover', 'bg-dark-grey'],
    expectedLabel: en.vault.filter.paused,
  },
  {
    status: VaultStatus.Pending,
    expectedClassNames: ['border-dark-grey-hover', 'bg-dark-grey'],
    expectedLabel: en.vault.filter.pending,
  },
  {
    status: VaultStatus.Repaying,
    expectedClassNames: ['border-dark-grey-hover', 'bg-dark-grey'],
    expectedLabel: en.vault.filter.repaying,
  },
  {
    status: VaultStatus.Inactive,
    expectedClassNames: ['border-dark-grey-hover', 'bg-dark-grey'],
    expectedLabel: en.vault.filter.inactive,
  },
  {
    status: VaultStatus.Liquidated,
    expectedClassNames: ['border-dark-grey-hover', 'bg-dark-grey'],
    expectedLabel: en.vault.filter.liquidated,
  },
];

describe('StatusLabel', () => {
  it.each(statusScenarios)(
    'renders the correct label and variant for $status vaults',
    ({ status, expectedClassNames, expectedLabel }) => {
      const { container } = renderComponent(<StatusLabel status={status} />);
      const rootElement = container.firstElementChild as HTMLDivElement;

      expect(rootElement).toBeInTheDocument();
      expect(rootElement).toHaveClass(...expectedClassNames);

      expect(screen.getByText(expectedLabel)).toBe(rootElement);
    },
  );

  it('merges custom class names and forwards html attributes', () => {
    const { getByTestId } = renderComponent(
      <StatusLabel
        status={VaultStatus.Active}
        className="custom-class"
        data-testid="status-label"
        id="vault-status-label"
      />,
    );

    const label = getByTestId('status-label');

    expect(label).toHaveClass('custom-class');
    expect(label).toHaveAttribute('id', 'vault-status-label');
    expect(label).toHaveTextContent(en.vault.filter.active);
  });
});
