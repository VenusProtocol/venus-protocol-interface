import { useGetAddressDomainName } from 'clients/api';
import { Icon, Tooltip } from 'components';
import EllipseAddress, { type EllipseAddressProps } from 'components/EllipseAddress';
import { useTranslation } from 'libs/translations';
import { useChainId } from 'libs/wallet';
import { ChainId } from 'types';
import { cn, truncateAddress } from 'utilities';
import type { Address } from 'viem';

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
  const { data: domainNames } = useGetAddressDomainName({
    accountAddress: address as Address,
  });

  const chainDomainName = domainNames?.[chainId];
  // Ethereum and Sepolia use ENS, other chains use SpaceID
  const providerIcon =
    chainId === ChainId.ETHEREUM || chainId === ChainId.SEPOLIA ? 'ensLogo' : 'spaceIdLogo';
  const providerText =
    chainId === ChainId.ETHEREUM || chainId === ChainId.SEPOLIA
      ? t('web3DomainNames.providers.ens')
      : t('web3DomainNames.providers.spaceId');

  return (
    <>
      {chainDomainName ? (
        <div className={cn('flex flex-row items-center', className)}>
          {showProvider && (
            <Tooltip title={providerText}>
              <Icon className="mr-1" name={providerIcon} />
            </Tooltip>
          )}
          <span>{chainDomainName}</span>
          {showTooltip && (
            <Tooltip
              title={
                <div className="flex flex-col w-auto">
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
