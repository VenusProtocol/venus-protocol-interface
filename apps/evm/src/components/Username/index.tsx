import { useGetAddressDomainName } from 'clients/api';
import { InfoIcon } from 'components';
import EllipseAddress, { type EllipseAddressProps } from 'components/EllipseAddress';
import { CopyAddressButton } from 'containers/CopyAddressButton';
import { useTranslation } from 'libs/translations';
import { useChainId } from 'libs/wallet';
import { ChainId } from 'types';
import { truncateAddress } from 'utilities';
import UsernameSpan from './UsernameSpan';

type UsernameProps = {
  showProvider?: boolean;
  showTooltip?: boolean;
  showCopyAddress?: boolean;
  shouldEllipseAddress?: boolean;
  children?: (props: { innerContent: React.ReactNode }) => React.ReactNode;
} & EllipseAddressProps;

export const Username: React.FC<UsernameProps> = ({
  address,
  children,
  className,
  showCopyAddress = false,
  showProvider = true,
  showTooltip = true,
  shouldEllipseAddress = true,
  ...ellipseAddressProps
}) => {
  const { t } = useTranslation();
  const { chainId } = useChainId();
  const { data: domainNames, isLoading: isGetAddressDomainNameLoading } = useGetAddressDomainName(
    {
      accountAddress: address,
      chainId,
    },
    {
      enabled: !!address,
    },
  );

  const chainDomainName = domainNames?.[chainId];
  // Ethereum and Sepolia use ENS, other chains use SpaceID
  const providerIcon =
    chainId === ChainId.ETHEREUM || chainId === ChainId.SEPOLIA ? 'ensLogo' : 'spaceIdLogo';
  const providerText =
    chainId === ChainId.ETHEREUM || chainId === ChainId.SEPOLIA
      ? t('web3DomainNames.providers.ens')
      : t('web3DomainNames.providers.spaceId');

  const addressComponent = shouldEllipseAddress ? (
    <EllipseAddress className={className} address={address} {...ellipseAddressProps} />
  ) : (
    <UsernameSpan className={className} username={address} />
  );

  let dom = children ? children({ innerContent: addressComponent }) : addressComponent;

  if (!isGetAddressDomainNameLoading && chainDomainName) {
    const chainDomainNameSpan = <UsernameSpan className={className} username={chainDomainName} />;
    const domainNameComponent = children
      ? children({ innerContent: chainDomainNameSpan })
      : chainDomainNameSpan;
    dom = (
      <div className="flex flex-row items-center text-nowrap space-x-1 mr-1">
        {showProvider && (
          <InfoIcon iconName={providerIcon} iconClassName="cursor-pointer" tooltip={providerText} />
        )}
        {domainNameComponent}
        {showTooltip && (
          <InfoIcon
            tooltip={
              <div className="flex flex-col text-center">
                <span className="text-center">{chainDomainName}</span>
                <span className="md:hidden">
                  {t('web3DomainNames.tooltip.address', { address: truncateAddress(address) })}
                </span>
                <span className="hidden md:block">
                  {t('web3DomainNames.tooltip.address', { address })}
                </span>
              </div>
            }
            className="inline-flex"
            iconClassName="cursor-pointer"
          />
        )}
      </div>
    );
  }

  return (
    <>
      {dom}
      {showCopyAddress && (
        <CopyAddressButton className="shrink-0" address={address} showTooltip={!!chainDomainName} />
      )}
    </>
  );
};

export default Username;
