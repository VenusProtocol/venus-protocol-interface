import { Page } from 'components';
import { Header } from './Header';
import { StatsIframe } from './StatsIframe';

const Stats: React.FC = () => (
  <Page>
    <div className="flex flex-col gap-6">
      <Header />
      <StatsIframe />
    </div>
  </Page>
);

export default Stats;
