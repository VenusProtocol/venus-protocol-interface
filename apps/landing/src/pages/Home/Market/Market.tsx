import { cn } from '@venusprotocol/ui';
import { useVenusApi } from 'api/hooks/useVenusApi';
import { nFormatter } from 'api/utils';
import Container from 'components/Container/Container';
import Link from 'components/Link/Link';
import { useDAppUrl } from 'hooks/useDAppUrl';
import s from './Market.module.css';

interface IMarketProps {
  className?: string;
}

const loadingState = 'Loading...';

const Market: React.FC<IMarketProps> = ({ className }) => {
  const {
    totalSupplyUsd,
    totalBorrowUsd,
    totalLiquidityUsd,
    topMarkets,
    isLoading,
    errors: { getLegacyPoolMarketsError, getTvlDataError },
    refetch,
  } = useVenusApi();

  const { dAppUrl } = useDAppUrl();

  if (getLegacyPoolMarketsError || getTvlDataError) {
    return (
      <Container className={cn(s.root, className)}>
        {getLegacyPoolMarketsError && <p className="m-0">{getLegacyPoolMarketsError.message}</p>}
        {getTvlDataError && <p className="m-0">{getTvlDataError.message}</p>}
        <button className={cn(s.btn, 'cursor-pointer')} type="button" onClick={() => refetch()}>
          Try again
        </button>
      </Container>
    );
  }

  return (
    <Container className={cn(s.root, className)}>
      <div className={s.totalWrapper}>
        <ul className={s.totalList}>
          <li className={s.totalItem}>
            <div>
              <p className={s.totalTitle}>Market size</p>
              <p className={s.totalSum}>{isLoading ? loadingState : totalSupplyUsd}</p>
            </div>
          </li>
          <span className={cn(s.divider, 'bg-white/10')} />
          <li className={s.totalItem}>
            <div>
              <p className={s.totalTitle}>Total Borrowed</p>
              <p className={s.totalSum}>{isLoading ? loadingState : totalBorrowUsd}</p>
            </div>
          </li>
          <span className={cn(s.divider, 'bg-white/10')} />
          <li className={s.totalItem}>
            <div>
              <p className={s.totalTitle}>Total Liquidity</p>
              <p className={s.totalSum}>{isLoading ? loadingState : totalLiquidityUsd}</p>
            </div>
          </li>
        </ul>
      </div>

      {isLoading ? (
        <p className="m-0">{loadingState}</p>
      ) : (
        <div className={s.marketsWrapper}>
          <div className={s.marketLabelsDesktop}>
            <span className={s.marketLabelDesktopItem}>Assets</span>
            <span className={s.marketLabelDesktopItem}>Market size</span>
            <span className={s.marketLabelDesktopItem}>Supply APY</span>
            <span className={s.marketLabelDesktopItem}>Total borrowed</span>
            <span className={s.marketLabelDesktopItem}>Borrow APY</span>
          </div>

          <ul className={s.marketsList}>
            {topMarkets.map(i => (
              <li className={s.marketItem} key={i.symbol}>
                <div className={s.marketItemSymbol}>
                  <img className={s.icon} src={i.underlyingIconUrl} alt={i.underlyingSymbol} />
                  {i.underlyingSymbol}
                </div>
                <div className={s.marketItemValuesWrapper}>
                  <p className={s.marketItemValue}>
                    <span className={s.marketItemLabel}>Market size</span> $
                    {nFormatter(i.totalSupplyUsd)}
                  </p>
                  <p className={s.marketItemValue}>
                    <span className={s.marketItemLabel}>Supply APY</span>
                    {nFormatter(i.depositApy)}%
                  </p>
                  <p className={s.marketItemValue}>
                    <span className={s.marketItemLabel}>Borrowed</span> $
                    {nFormatter(i.totalBorrowsUsd)}
                  </p>
                  <p className={s.marketItemValue}>
                    <span className={s.marketItemLabel}>Borrow APY</span>
                    {nFormatter(i.borrowApy)}%
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <Link href={dAppUrl} variant="text" className="mx-auto h-auto flex py-7">
            All markets
          </Link>
        </div>
      )}
    </Container>
  );
};

export default Market;
