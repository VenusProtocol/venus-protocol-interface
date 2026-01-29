import { Page, Wrapper } from 'components';
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
    <Page>
      <Hero />

      <Wrapper>
        <Markets className="mb-6 md:mb-10 lg:mb-15" />

        <div className="space-y-6 lg:space-y-12 mb-11 sm:mb-18 lg:mb-23 xl:mb-27">
          <VenusPrime />
          <Protection />
          <Governance />
        </div>

        <div className="space-y-3 mb-11 sm:space-y-6 sm:mb-22">
          <Safety />
          <Benefits />
        </div>

        <Wallets className="mb-8" />
      </Wrapper>
    </Page>
  );
};

export default Landing;
