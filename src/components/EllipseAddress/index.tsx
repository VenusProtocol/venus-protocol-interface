/** @jsxImportSource @emotion/react */
import React from 'react';

import { truncateAddress } from 'utilities';
import { Breakpoint } from './types';
import { useStyles } from './styles';

export * from './types';

interface IAddressProps {
  address: string;
  ellipseBreakpoint?: Breakpoint;
  className?: string;
}

// TODO: add story

export const EllipseAddress: React.FC<IAddressProps> = ({
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
