import { Page } from 'components';
import { AdCarousel } from './AdCarousel';
import { TopMarkets } from './TopMarkets';

export const Dashboard: React.FC = () => {
  return (
    <Page indexWithSearchEngines={false}>
      <div className="xl:flex xl:gap-x-6">
        <div className="space-y-6 xl:w-78 xl:order-2">
          <AdCarousel />

          <TopMarkets />
        </div>

        <div className="xl:grow xl:order-1">TODO: add content</div>
      </div>
    </Page>
  );
};

export default Dashboard;
