import { useGetAddressDomainName } from 'clients/api';
import { Icon, Tooltip } from 'components';
import EllipseAddress, { type EllipseAddressProps } from 'components/EllipseAddress';
import { useTranslation } from 'libs/translations';
import { useChainId } from 'libs/wallet';
import { ChainId } from 'types';
import { cn, truncateAddress } from 'utilities';

type DomainNameAddressProps = {
  showProvider?: boolean;
  showTooltip?: boolean;
  shouldEllipseAddress?: boolean;
} & EllipseAddressProps;

export const DomainNameOrEllipseAddress: React.FC<DomainNameAddressProps> = ({
  address,
  className,
  showProvider = true,
  showTooltip = true,
  shouldEllipseAddress = true,
  ...ellipseAddressProps
}) => {
  const { t } = useTranslation();
  const { chainId } = useChainId();
  const { data: domainName } = useGetAddressDomainName({
    accountAddress: address,
  });
  // Ethereum and Sepolia use ENS, other chains use SpaceID
  const providerIcon =
    chainId === ChainId.ETHEREUM || chainId === ChainId.SEPOLIA ? 'ensLogo' : 'spaceIdLogo';
  const providerText =
    chainId === ChainId.ETHEREUM || chainId === ChainId.SEPOLIA
      ? t('web3DomainNames.providers.ens')
      : t('web3DomainNames.providers.spaceId');

  return (
    <>
      {domainName ? (
        <div className={cn('flex flex-row items-center', className)}>
          {showProvider && (
            <Tooltip title={providerText}>
              <Icon className="mr-1" name={providerIcon} />
            </Tooltip>
          )}
          <span>{domainName}</span>
          {showTooltip && (
            <Tooltip
              title={
                <div className="flex flex-col">
                  <span>{t('web3DomainNames.tooltip.publicTag', { domainName })}</span>
                  <span className="md:hidden">
                    {t('web3DomainNames.tooltip.address', { address: truncateAddress(address) })}
                  </span>
                  <span className="hidden md:block">
                    {t('web3DomainNames.tooltip.address', { address })}
                  </span>
                </div>
              }
              className="inline-flex"
            >
              <Icon className="ml-1" name="info" />
            </Tooltip>
          )}
        </div>
      ) : shouldEllipseAddress ? (
        <EllipseAddress className={className} address={address} {...ellipseAddressProps} />
      ) : (
        <span className={className}>{address}</span>
      )}
    </>
  );
};

export default DomainNameOrEllipseAddress;
