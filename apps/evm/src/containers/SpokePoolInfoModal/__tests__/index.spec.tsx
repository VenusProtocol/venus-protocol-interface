import { screen } from '@testing-library/react';

import { renderComponent } from 'testUtils/render';

import { SpokePoolInfoModal } from '..';

const spokePool = {
  name: 'BPN Loan',
  description: 'Loan to Better Payment Network',
  infoTags: [
    {
      title: { en: 'About BPN Loan' },
      content: { en: 'This pool lends to Better Payment Network (BPN).' },
      url: 'https://docs-v4.venus.io/',
      urlLabel: { en: 'Learn more' },
    },
  ],
};

describe('SpokePoolInfoModal', () => {
  it('renders the pool name, description and info tags', () => {
    renderComponent(<SpokePoolInfoModal spokePool={spokePool} isOpen handleClose={vi.fn()} />);

    expect(screen.getByText('BPN Loan')).toBeInTheDocument();
    expect(screen.getByText('Loan to Better Payment Network')).toBeInTheDocument();
    expect(screen.getByText('About BPN Loan')).toBeInTheDocument();
    expect(
      screen.getByText('This pool lends to Better Payment Network (BPN).'),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Learn more/ })).toHaveAttribute(
      'href',
      'https://docs-v4.venus.io/',
    );
  });

  it('renders nothing when closed', () => {
    renderComponent(
      <SpokePoolInfoModal spokePool={spokePool} isOpen={false} handleClose={vi.fn()} />,
    );

    expect(screen.queryByText('BPN Loan')).not.toBeInTheDocument();
  });
});
