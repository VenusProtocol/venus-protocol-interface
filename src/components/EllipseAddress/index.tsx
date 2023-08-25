/** @jsxImportSource @emotion/react */
import React from 'react';
import { truncateAddress } from 'utilities';

import { useStyles } from './styles';
import { Breakpoint } from './types';

export * from './types';

interface AddressProps {
  address: string;
  ellipseBreakpoint?: Breakpoint;
  className?: string;
}

export const EllipseAddress: React.FC<AddressProps> = ({
  className,
  address,
  ellipseBreakpoint,
}) => {
  const styles = useStyles();

  const truncatedAddress = truncateAddress(address);

  return (
    <>
      <span className={className} css={styles.getAddress({ ellipseBreakpoint })}>
        {address}
      </span>

      <span className={className} css={styles.getFormattedAddress({ ellipseBreakpoint })}>
        {truncatedAddress}
      </span>
    </>
  );
};

export default EllipseAddress;
