/** @jsxImportSource @emotion/react */
import React from 'react';
import { isFeatureEnabled } from 'utilities';

import PrimeStatusBanner from 'containers/PrimeStatusBanner';

import AccountBreakdown from './AccountBreakdown';
import { useStyles } from './styles';

const Account: React.FC = () => {
  const styles = useStyles();

  return (
    <>
      {isFeatureEnabled('prime') && <PrimeStatusBanner css={styles.section} />}

      <AccountBreakdown />
    </>
  );
};

export default Account;
