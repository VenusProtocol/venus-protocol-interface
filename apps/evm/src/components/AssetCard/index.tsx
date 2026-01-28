import { cn } from '@venusprotocol/ui';
import type { Address } from 'viem';

import { Apy, type ApyProps, Card, TokenIconWithSymbol } from 'components';
import { routes } from 'constants/routing';
import { Link } from 'containers/Link';
import type { Asset } from 'types';

export interface AssetCardProps {
  asset: Asset;
  poolComptrollerContractAddress: Address;
  type: ApyProps['type'];
  className?: string;
}

export const AssetCard: React.FC<AssetCardProps> = ({
  asset,
  poolComptrollerContractAddress,
  type,
  className,
}) => {
  const to = routes.market.path
    .replace(':poolComptrollerAddress', poolComptrollerContractAddress)
    .replace(':vTokenAddress', asset.vToken.address);

  return (
    <Card
      className={cn(
        'flex items-center justify-between text-white hover:no-underline hover:text-white hover:bg-dark-blue-hover active:text-white',
        className,
      )}
      asChild
    >
      <Link to={to} chainId={asset.vToken.chainId}>
        <TokenIconWithSymbol token={asset.vToken.underlyingToken} displayChain />

        <Apy type={type} asset={asset} className="text-sm" />
      </Link>
    </Card>
  );
};
