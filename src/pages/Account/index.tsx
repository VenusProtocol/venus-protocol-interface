import PrimeStatusBanner from 'containers/PrimeStatusBanner';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';

import AccountBreakdown from './AccountBreakdown';

const Account: React.FC = () => {
  const isPrimeEnabled = useIsFeatureEnabled({ name: 'prime' });

  return (
    <>
      {isPrimeEnabled && <PrimeStatusBanner className="mb-10 lg:mb-14" />}

      <AccountBreakdown />
    </>
  );
};

export default Account;
