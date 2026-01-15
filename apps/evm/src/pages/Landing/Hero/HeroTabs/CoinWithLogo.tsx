import type { Chain, Token } from '@venusprotocol/chains';
import { cn } from 'components';

export type CoinWithLogoProps = React.HTMLAttributes<HTMLDivElement> & {
  asset: Token;
  chain: Chain;
};

export const CoinWithLogo: React.FC<CoinWithLogoProps> = ({
  asset,
  chain,
  className,
  ...restProps
}) => {
  return (
    <div className={cn('flex items-center gap-2', className)} {...restProps}>
      {asset && chain ? (
        <>
          <div className="relative">
            <img className="size-8 sm:size-13" src={asset.iconSrc} alt={asset.symbol} />
            <img
              className={cn('absolute size-3 sm:size-5 end-0 bottom-0 z-10')}
              src={chain.iconSrc}
              alt={chain.name}
            />
          </div>
          <div>
            <div className="">{asset.symbol}</div>
            <div className="flex items-center gap-1">
              <div
                className={cn(
                  'text-light-grey text-[12px] leading-[1.2] sm:text-[14px] sm:leading-normal mt-1 sm:mt-0',
                )}
              >
                {chain.name}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};
