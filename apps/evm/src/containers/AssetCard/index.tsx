import { cn } from '@venusprotocol/ui';
import type { Address } from 'viem';

import { Apy, type ApyProps, Card, TokenIconWithSymbol } from 'components';
import { Link } from 'containers/Link';
import { useMarketPageTo } from 'hooks/useMarketPageTo';
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
  const { formatMarketPageTo } = useMarketPageTo();
  const to = formatMarketPageTo({
    poolComptrollerContractAddress,
    vTokenAddress: asset.vToken.address,
    tabId: type,
  });

  return (
    <Card
      className={cn(
        'flex items-center justify-between text-white gap-x-3 hover:no-underline hover:text-white hover:bg-dark-blue-hover active:text-white',
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
