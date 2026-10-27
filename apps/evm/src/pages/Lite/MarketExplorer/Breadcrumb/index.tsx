import { Icon, TokenIcon } from 'components';
import { useTranslation } from 'libs/translations';
import type { Token } from 'types';

export interface BreadcrumbProps {
  modeLabel: string;
  token?: Token;
  marketName?: string;
  onBackToAssets: () => void;
  onBackToMarkets?: () => void;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  modeLabel,
  token,
  marketName,
  onBackToAssets,
  onBackToMarkets,
}) => {
  const { t } = useTranslation();

  return (
    <nav
      aria-label={modeLabel}
      className="flex flex-wrap items-center gap-2 text-b1r text-light-grey"
    >
      <button
        type="button"
        onClick={onBackToAssets}
        aria-label={t('lite.breadcrumb.backToAssets', { mode: modeLabel })}
        className="inline-flex cursor-pointer items-center gap-2 hover:text-white focus-visible:outline-2 focus-visible:outline-blue"
      >
        <Icon name="chevronLeft" className="size-4 text-inherit" />
        <span>{modeLabel}</span>
      </button>

      {token && (
        <>
          <span aria-hidden="true">/</span>

          <button
            type="button"
            onClick={onBackToMarkets}
            disabled={!onBackToMarkets}
            aria-label={t('lite.breadcrumb.backToMarkets', { symbol: token.symbol })}
            className="inline-flex items-center gap-1.5 enabled:cursor-pointer enabled:hover:text-white focus-visible:outline-2 focus-visible:outline-blue"
          >
            <TokenIcon token={token} size="md" className="size-4 shrink-0" />
            <span>{token.symbol}</span>
          </button>
        </>
      )}

      {marketName && (
        <>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{marketName}</span>
        </>
      )}
    </nav>
  );
};
