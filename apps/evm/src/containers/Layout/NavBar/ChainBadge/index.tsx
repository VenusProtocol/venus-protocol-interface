import { chains as chainMetadata } from '@venusprotocol/chains';
import { Tooltip } from 'components';
import { useChainId } from 'libs/wallet';

export const ChainBadge: React.FC = () => {
  const { chainId } = useChainId();
  const metadata = chainMetadata[chainId];

  return (
    <Tooltip content={metadata.name} className="h-full">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-control/50 bg-surface-3 sm:size-12">
        <img src={metadata.iconSrc} alt={metadata.name} className="size-5 sm:size-6" />
      </div>
    </Tooltip>
  );
};
