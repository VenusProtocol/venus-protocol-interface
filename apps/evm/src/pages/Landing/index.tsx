import { Page, Wrapper } from 'components';
// import Background from './Background';
import { Benefits } from './Benefits';
import { Governance } from './Governance';
import { Hero } from './Hero';
import { Protection } from './Protection';
import { Safety } from './Safety';
import { VenusPrime } from './VenusPrime';
import { Wallets } from './Wallets';

export const Landing: React.FC = () => {
  return (
    <Page indexWithSearchEngines={true}>
      <Hero />
      <Wrapper>
        <VenusPrime />
        <Protection />
        <Governance />
        <Safety />
        <Benefits />
        <Wallets />
      </Wrapper>
    </Page>
  );
};

export default Landing;
