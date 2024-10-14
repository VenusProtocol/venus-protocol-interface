import PrimeStatusBanner from 'containers/PrimeStatusBanner';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';

import { Page } from 'components';
import AccountBreakdown from './AccountBreakdown';

const Account: React.FC = () => {
  const isPrimeEnabled = useIsFeatureEnabled({ name: 'prime' });

  return (
    <Page indexWithSearchEngines={false}>
      <div className="flex h-full flex-col">
        {isPrimeEnabled && <PrimeStatusBanner className="mb-10 flex-none lg:mb-14" />}

        <div className="flex-auto">
          <AccountBreakdown />
        </div>
      </div>
    </Page>
  );
};

export default Account;
