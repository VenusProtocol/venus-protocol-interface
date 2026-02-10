import { Page } from 'components';
import { AdCarousel } from './AdCarousel';
import { Guide } from './Guide';
import { Overview } from './Overview';
import { TopMarkets } from './TopMarkets';

export const Dashboard: React.FC = () => (
  <Page indexWithSearchEngines={false}>
    <div className="space-y-12 xl:flex xl:gap-x-6">
      <div className="space-y-6 xl:w-78 xl:order-2 xl:shrink-0">
        <AdCarousel />

        <TopMarkets />
      </div>

      <div className="xl:grow xl:order-1">
        <div className="space-y-6 sm:space-y-12">
          <Overview />

          <Guide />
        </div>
      </div>
    </div>
  </Page>
);

export default Dashboard;
