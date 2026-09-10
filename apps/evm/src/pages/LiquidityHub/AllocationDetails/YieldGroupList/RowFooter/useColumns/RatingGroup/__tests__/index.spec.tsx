import { fireEvent, screen, within } from '@testing-library/react';

import placeholderIconSrc from 'assets/img/placeholderIcon.svg';
import { renderComponent } from 'testUtils/render';
import type { LiquidityHubSourceRating } from 'types';
import { RatingGroup } from '..';

// Renders the popover content inline so the agency rows can be asserted without driving Radix hover
vi.mock('components/Tooltip', () => ({
  Tooltip: ({ children, content }: { children: React.ReactNode; content: React.ReactNode }) => (
    <div>
      <div>{content}</div>
      {children}
    </div>
  ),
}));

const moodysRating: LiquidityHubSourceRating = {
  agencyName: "Moody's Ratings",
  agencyIconSrc: placeholderIconSrc,
  value: 'Aa-bf',
  reportUrl: 'https://www.moodys.com/research/report',
};

const spGlobalRating: LiquidityHubSourceRating = {
  agencyName: 'S&P Global Ratings',
  agencyIconSrc: placeholderIconSrc,
  value: 'AAAf/S1+',
  reportUrl: 'https://www.spglobal.com/ratings/report',
};

// The popover renders a table and a card list of the same rows, so assertions are scoped to the table
const renderRatingGroup = (ratings: LiquidityHubSourceRating[]) => {
  const view = renderComponent(<RatingGroup ratings={ratings} />);
  const table = view.container.querySelector('table');

  return { ...view, table };
};

describe('RatingGroup', () => {
  it('renders one row per agency, with names and rating strings verbatim', () => {
    const { table } = renderRatingGroup([moodysRating, spGlobalRating]);

    expect(within(table!).getByText("Moody's Ratings")).toBeInTheDocument();
    expect(within(table!).getByText('S&P Global Ratings')).toBeInTheDocument();

    // Agency notation is opaque: it must reach the DOM exactly as the API returned it
    expect(within(table!).getByText('Aa-bf')).toBeInTheDocument();
    expect(within(table!).getByText('AAAf/S1+')).toBeInTheDocument();
  });

  it('renders the agency rows in the order the API returned them', () => {
    const { table } = renderRatingGroup([spGlobalRating, moodysRating]);

    const rowNames = Array.from(within(table!).getAllByRole('row'))
      .map(row => row.textContent)
      .filter(text => !!text?.includes('Ratings'));

    expect(rowNames[0]).toContain('S&P Global Ratings');
    expect(rowNames[1]).toContain("Moody's Ratings");
  });

  it('renders an icon per agency in the trigger stack', () => {
    const { container } = renderRatingGroup([moodysRating, spGlobalRating]);

    // the mocked Tooltip renders the popover content first and the trigger last
    const triggerStack = container.firstElementChild?.lastElementChild;

    expect(triggerStack?.querySelectorAll('img')).toHaveLength(2);
  });

  it('renders the placeholder and no popover when the fund has no agency coverage', () => {
    renderRatingGroup([]);

    expect(screen.getByText('-')).toBeInTheDocument();
    expect(screen.queryByText('Agency')).not.toBeInTheDocument();
    expect(screen.queryByText('Rating')).not.toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('still lists an agency whose rating is unavailable, with a placeholder rating', () => {
    const { table } = renderRatingGroup([{ ...moodysRating, value: undefined }, spGlobalRating]);

    expect(within(table!).getByText("Moody's Ratings")).toBeInTheDocument();
    expect(within(table!).getByText('-')).toBeInTheDocument();
    expect(within(table!).getByText('AAAf/S1+')).toBeInTheDocument();
  });

  it('opens the report in a new tab when an agency row is clicked', () => {
    const openSpy = vi.spyOn(window, 'open').mockReturnValue(null);

    const { table } = renderRatingGroup([moodysRating, spGlobalRating]);

    fireEvent.click(within(table!).getByText("Moody's Ratings").closest('tr')!);

    expect(openSpy).toHaveBeenCalledWith(
      'https://www.moodys.com/research/report',
      '_blank',
      'noopener,noreferrer',
    );
  });

  it('does not open anything when the clicked agency has no report url', () => {
    const openSpy = vi.spyOn(window, 'open').mockReturnValue(null);

    const { table } = renderRatingGroup([
      moodysRating,
      { ...spGlobalRating, reportUrl: undefined },
    ]);

    fireEvent.click(within(table!).getByText('S&P Global Ratings').closest('tr')!);

    expect(openSpy).not.toHaveBeenCalled();
  });

  it('renders rows for agencies the FE does not know about', () => {
    const { table } = renderRatingGroup([
      { agencyName: 'Brand New Agency', agencyIconSrc: placeholderIconSrc, value: 'AA' },
    ]);

    expect(within(table!).getByText('Brand New Agency')).toBeInTheDocument();
    expect(within(table!).getByText('AA')).toBeInTheDocument();
  });
});
