import { Page, Wrapper } from 'components';
// import Background from './Background';
import { Benefits } from './Benefits';
import { Governance } from './Governance';
import { Hero } from './Hero';
import { Markets } from './Markets';
import { Protection } from './Protection';
import { Safety } from './Safety';
import { VenusPrime } from './VenusPrime';
import { Wallets } from './Wallets';

export const Landing: React.FC = () => {
  return (
    <Page indexWithSearchEngines={true}>
      <Hero />

      <Wrapper>
        <Markets className="mb-6 md:mb-10 lg:mb-15" />

        <div className="space-y-6">
          <VenusPrime />
          <Protection />
          <Governance />
        </div>

        <Safety />
        <Benefits />
        <Wallets />
      </Wrapper>
    </Page>
  );
};

export default Landing;
