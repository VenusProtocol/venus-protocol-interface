import { TokenIcon, Tooltip } from 'components';
import { useTranslation } from 'libs/translations';
import type { Token } from 'types';
import type { LiteBorrowMarket } from '../../../types';

const VISIBLE_COLLATERAL_COUNT = 3;

export interface CollateralIconsProps {
  market: LiteBorrowMarket;
  onSelect: (input: { market: LiteBorrowMarket; token: Token }) => void;
  className?: string;
}

export const CollateralIcons: React.FC<CollateralIconsProps> = ({
  market,
  onSelect,
  className,
}) => {
  const { t } = useTranslation();

  return (
    <div className={className}>
      <div className="flex items-center -space-x-2">
        {market.collateralTokens.slice(0, VISIBLE_COLLATERAL_COUNT).map(token => (
          <Tooltip key={token.address} content={token.symbol}>
            {market.source.type === 'spoke' ? (
              <button
                type="button"
                aria-label={t('lite.collateralAriaLabel', { symbol: token.symbol })}
                className="cursor-pointer rounded-full focus-visible:outline-2 focus-visible:outline-blue"
                onClick={event => {
                  event.stopPropagation();
                  onSelect({ market, token });
                }}
              >
                <TokenIcon token={token} size="lg" className="shrink-0" />
              </button>
            ) : (
              <TokenIcon token={token} size="lg" className="shrink-0" />
            )}
          </Tooltip>
        ))}
      </div>

      {market.collateralTokens.length > VISIBLE_COLLATERAL_COUNT && (
        <Tooltip
          content={market.collateralTokens
            .slice(VISIBLE_COLLATERAL_COUNT)
            .map(token => token.symbol)
            .join(', ')}
        >
          <span className="text-b2r text-light-grey">
            +{market.collateralTokens.length - VISIBLE_COLLATERAL_COUNT}
          </span>
        </Tooltip>
      )}
    </div>
  );
};
