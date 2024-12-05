import { useGetAddressDomainName } from 'clients/api';
import { Icon, Tooltip } from 'components';
import EllipseAddress, { type EllipseAddressProps } from 'components/EllipseAddress';
import { useTranslation } from 'libs/translations';
import { useChainId } from 'libs/wallet';
import { ChainId } from 'types';
import { cn, truncateAddress } from 'utilities';
import type { Address } from 'viem';

type UsernameProps = {
  showProvider?: boolean;
  showTooltip?: boolean;
  shouldEllipseAddress?: boolean;
} & EllipseAddressProps;

export const Username: React.FC<UsernameProps> = ({
  address,
  className,
  showProvider = true,
  showTooltip = true,
  shouldEllipseAddress = true,
  ...ellipseAddressProps
}) => {
  const { t } = useTranslation();
  const { chainId } = useChainId();
  const { data: domainNames, isLoading: isGetAddressDomainNameLoading } = useGetAddressDomainName(
    {
      accountAddress: address as Address,
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

  let dom = shouldEllipseAddress ? (
    <EllipseAddress className={className} address={address} {...ellipseAddressProps} />
  ) : (
    <span className={className}>{address}</span>
  );

  if (!isGetAddressDomainNameLoading && chainDomainName) {
    dom = (
      <div className={cn('flex flex-row items-center space-x-1', className)}>
        {showProvider && (
          <Tooltip title={providerText}>
            <Icon className="cursor-pointer" name={providerIcon} />
          </Tooltip>
        )}
        <span>{chainDomainName}</span>
        {showTooltip && (
          <Tooltip
            title={
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
          >
            <Icon className="cursor-pointer" name="info" />
          </Tooltip>
        )}
      </div>
    );
  }

  return dom;
};

export default Username;
