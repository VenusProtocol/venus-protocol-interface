import { cn } from '@venusprotocol/ui';

import { Icon } from 'components/Icon';
import { Tooltip } from 'components/Tooltip';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';
import { useChainId } from 'libs/wallet';
import { generateExplorerUrl } from 'utilities';
import type { Address } from 'viem';

export interface SpokeWhitelistMarkerProps {
  level: 'pool' | 'asset';
  comptrollerAddress: Address;
  isUserWhitelisted: boolean;
  className?: string;
}

export const SpokeWhitelistMarker: React.FC<SpokeWhitelistMarkerProps> = ({
  level,
  comptrollerAddress,
  isUserWhitelisted,
  className,
}) => {
  const { t } = useTranslation();
  const { chainId } = useChainId();

  const whitelistUrl = `${generateExplorerUrl({
    hash: comptrollerAddress,
    chainId,
  })}#readProxyContract`;

  const tooltipContent = (
    <div className="flex flex-col gap-y-2">
      <p>
        {level === 'pool'
          ? t('spokeWhitelist.pool.description')
          : t('spokeWhitelist.asset.description')}
      </p>

      {isUserWhitelisted && (
        <p className="flex items-center gap-x-1.5 font-semibold text-primary">
          <Icon name="check" className="size-3.5 shrink-0 text-success" />
          <span>
            {level === 'pool'
              ? t('spokeWhitelist.pool.userWhitelisted')
              : t('spokeWhitelist.asset.userWhitelisted')}
          </span>
        </p>
      )}

      <Link
        href={whitelistUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-x-1 font-semibold"
      >
        <span>{t('spokeWhitelist.viewOnChain')}</span>
        <Icon name="open" className="size-3 text-inherit" />
      </Link>
    </div>
  );

  return (
    <Tooltip
      content={tooltipContent}
      contentClassName="max-w-70 text-b2r text-secondary"
      className="inline-flex"
    >
      <button
        type="button"
        className={cn(
          'inline-flex h-5.5 cursor-default items-center gap-x-1 whitespace-nowrap rounded-full border px-2 text-xs font-semibold leading-none',
          isUserWhitelisted
            ? 'border-success bg-success/10 text-success'
            : 'border-warning bg-warning/10 text-warning',
          className,
        )}
      >
        <Icon name={isUserWhitelisted ? 'check' : 'lock'} className="size-3 text-inherit" />
        <span>{t('spokeWhitelist.label')}</span>
      </button>
    </Tooltip>
  );
};
