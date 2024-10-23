import PrimeStatusBanner from 'containers/PrimeStatusBanner';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';

import { Page } from 'components';
import AccountBreakdown from './AccountBreakdown';
import { Settings } from './Settings';

const Account: React.FC = () => {
  const isPrimeEnabled = useIsFeatureEnabled({ name: 'prime' });

  return (
    <Page indexWithSearchEngines={false}>
      <div className="flex h-full flex-col space-y-10 lg:space-y-14">
        {isPrimeEnabled && <PrimeStatusBanner className="flex-none" />}

        <Settings />

        <AccountBreakdown />
      </div>
    </Page>
  );
};

export default Account;
