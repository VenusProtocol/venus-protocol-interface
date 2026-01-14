import { Page } from 'components';
// import Background from './Background';
import { Benefits } from './Benefits';
import { Governance } from './Governance';
import { Protection } from './Protection';
import { Safety } from './Safety';
import { VenusPrime } from './VenusPrime';
import { Wallets } from './Wallets';

export const Landing: React.FC = () => {
  return (
    <Page indexWithSearchEngines={true}>
      {/* <Background /> */}
      <VenusPrime />
      <Protection />
      <Governance />
      <Safety />
      <Benefits />
      <Wallets />
    </Page>
  );
};

export default Landing;
