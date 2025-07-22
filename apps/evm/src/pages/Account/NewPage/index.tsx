import { Page } from 'components';
import { PerformanceGraph } from './PerformanceGraph';
import { Summary } from './Summary';

export const NewPage: React.FC = () => {
  return (
    <Page indexWithSearchEngines={false}>
      <div className="space-y-4">
        <PerformanceGraph />

        <Summary />
      </div>
    </Page>
  );
};
