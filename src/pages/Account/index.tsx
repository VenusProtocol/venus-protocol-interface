/** @jsxImportSource @emotion/react */
import React from 'react';
import { isFeatureEnabled } from 'utilities';

import PrimeStatusBanner from 'containers/PrimeStatusBanner';

import AccountBreakdown from './AccountBreakdown';

const Account: React.FC = () => (
  <>
    {isFeatureEnabled('prime') && <PrimeStatusBanner className="mb-10 lg:mb-14" />}

    <AccountBreakdown />
  </>
);

export default Account;
