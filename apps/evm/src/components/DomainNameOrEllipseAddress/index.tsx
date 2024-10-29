import { useGetAddressDomainName } from 'clients/api';
import EllipseAddress, { type EllipseAddressProps } from 'components/EllipseAddress';

type DomainNameAddressProps = EllipseAddressProps;

export const DomainNameOrEllipseAddress: React.FC<DomainNameAddressProps> = ({
  address,
  className,
  ...ellipseAddressProps
}) => {
  const { data: domainName } = useGetAddressDomainName({
    accountAddress: address,
  });

  return (
    <>
      {domainName ? (
        <span className={className}>{domainName}</span>
      ) : (
        <EllipseAddress address={address} className={className} {...ellipseAddressProps} />
      )}
    </>
  );
};

export default DomainNameOrEllipseAddress;
