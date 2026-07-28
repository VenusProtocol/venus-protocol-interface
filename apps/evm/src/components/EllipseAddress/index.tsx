import { truncateAddress } from 'utilities';

import type { Address } from 'viem';

export interface EllipseAddressProps {
  address: Address;
  className?: string;
}

export const EllipseAddress: React.FC<EllipseAddressProps> = ({ className, address }) => (
  <span className={className}>{truncateAddress(address)}</span>
);

export default EllipseAddress;
