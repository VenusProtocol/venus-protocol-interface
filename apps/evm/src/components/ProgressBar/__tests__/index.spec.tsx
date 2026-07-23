import { render } from '@testing-library/react';

import { ProgressBar } from '..';

vi.mock('../../Tooltip', () => ({
  Tooltip: ({ children, content }: { children: React.ReactNode; content: React.ReactNode }) => (
    <div>
      <span>{content}</span>
      {children}
    </div>
  ),
}));

describe('ProgressBar', () => {
  it('renders a fill relative to the provided range', () => {
    const { container } = render(
      <ProgressBar progressBars={[{ value: 30 }]} min={10} max={50} className="custom-class" />,
    );

    const rail = container.firstElementChild;
    const fill = rail?.querySelector('div');

    expect(rail).toHaveClass('custom-class', 'bg-lightGrey');
    expect(fill).toHaveClass('bg-green');
    expect(fill).toHaveStyle({ width: '50%' });
  });

  it('renders multiple fills in array order with custom classes', () => {
    const { container } = render(
      <ProgressBar
        progressBars={[
          { value: 75, className: 'bg-yellow' },
          { value: 25, className: 'bg-blue' },
        ]}
        min={0}
        max={100}
      />,
    );

    const fills = container.firstElementChild?.querySelectorAll('div');

    expect(fills).toHaveLength(2);
    expect(fills?.[0]).toHaveClass('bg-yellow');
    expect(fills?.[0]).toHaveStyle({ width: '75%' });
    expect(fills?.[1]).toHaveClass('bg-blue');
    expect(fills?.[1]).toHaveStyle({ width: '25%' });
  });

  it('renders widths without clamping them to the provided range', () => {
    const { container } = render(<ProgressBar progressBars={[{ value: 150 }]} min={0} max={100} />);

    const fills = container.firstElementChild?.querySelectorAll('div');

    expect(fills?.[0]).toHaveStyle({ width: '150%' });
  });

  it('renders positioned marks without changing the fill color', () => {
    const { container } = render(
      <ProgressBar
        progressBars={[{ value: 90, className: 'bg-yellow' }]}
        marks={[{ value: 75 }, { value: 25, className: 'bg-white' }]}
        min={0}
        max={100}
      />,
    );

    const fill = container.firstElementChild?.querySelector('div');
    const marks = container.querySelectorAll('span');

    expect(fill).toHaveClass('bg-yellow');
    expect(marks[0]).toHaveClass('bg-red');
    expect(marks[0]).toHaveStyle({ left: '75%' });
    expect(marks[1]).toHaveClass('bg-white');
    expect(marks[1]).toHaveStyle({ left: '25%' });
  });

  it('wraps the rail in a tooltip when content is provided', () => {
    const { getByText } = render(
      <ProgressBar progressBars={[{ value: 50 }]} min={0} max={100} tooltip="Details" />,
    );

    expect(getByText('Details')).toBeInTheDocument();
  });
});
