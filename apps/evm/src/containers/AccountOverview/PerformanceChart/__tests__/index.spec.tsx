import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';

import { PerformanceChart } from '..';

describe('PerformanceChart', () => {
  it('shows a spinner while the history is loading', () => {
    const { queryByText } = renderComponent(
      <PerformanceChart accountPerformanceHistory={[]} onRefetch={() => {}} isLoading />,
    );

    expect(queryByText(en.dashboard.overview.performanceChart.placeholderText)).toBeInTheDocument();
    expect(queryByText(en.dashboard.overview.performanceChart.emptyState)).not.toBeInTheDocument();
  });

  it('shows an empty state when the request succeeded with no data point', () => {
    const { queryByText } = renderComponent(
      <PerformanceChart accountPerformanceHistory={[]} onRefetch={() => {}} isLoading={false} />,
    );

    // The request is done, so the chart must stop pretending it is still loading
    expect(queryByText(en.dashboard.overview.performanceChart.emptyState)).toBeInTheDocument();
    expect(
      queryByText(en.dashboard.overview.performanceChart.placeholderText),
    ).not.toBeInTheDocument();
  });

  it('shows the error state with a retry when the request failed', () => {
    const { queryByText } = renderComponent(
      <PerformanceChart
        accountPerformanceHistory={[]}
        onRefetch={() => {}}
        error={new Error('Boom')}
      />,
    );

    expect(
      queryByText(en.dashboard.overview.performanceChart.errorState.failedToFetchMessage),
    ).toBeInTheDocument();
    expect(queryByText(en.dashboard.overview.performanceChart.emptyState)).not.toBeInTheDocument();
  });
});
