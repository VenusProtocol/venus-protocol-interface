import { MainnetChainId } from '@venusprotocol/chains';
import { cn, debounce } from '@venusprotocol/ui';
import { useMemo, useState } from 'react';
import { useMediaQuery } from 'usehooks-ts';

import { useVenusApi } from '../../api/hooks/useVenusApi';
import Cell, { type ICellProps } from './Cell';
import ChainIcon from './ChainIcon';
import s from './Market.module.css';

interface IMarketProps {
  className?: string;
}

const loadingState = 'Loading...';

const Market: React.FC<IMarketProps> = ({ className }) => {
  const { data, error: getTvlDataError, refetch } = useVenusApi();
  const [openChainId, setOpenChainId] = useState<MainnetChainId | undefined>();

  const isMdUp = useMediaQuery('(min-width: 840px)');

  const debouncedSetOpenChainId = useMemo(
    () =>
      debounce({
        fn: setOpenChainId,
        delay: 2000,
      }),
    [],
  );

  const openChainIcon = (chainId: MainnetChainId) => {
    setOpenChainId(chainId);

    if (!isMdUp) {
      // Automatically close chain after a small delay on mobile and tablets
      debouncedSetOpenChainId(undefined);
    }
  };

  const cells: ICellProps[] = [
    {
      label: 'Total supply',
      value: data?.totalSupplyUsd || loadingState,
    },
    {
      label: 'Total borrow',
      value: data?.totalBorrowUsd || loadingState,
    },
    {
      label: 'Total XVS buyback',
      value: data?.totalXvsBuyBackTokens || loadingState,
    },
    {
      label: 'Assets',
      value: data?.marketCount || loadingState,
    },
  ];

  const chainIds = [
    MainnetChainId.BSC_MAINNET,
    MainnetChainId.ETHEREUM,
    MainnetChainId.OPBNB_MAINNET,
    MainnetChainId.UNICHAIN_MAINNET,
    MainnetChainId.ARBITRUM_ONE,
    MainnetChainId.ZKSYNC_MAINNET,
    MainnetChainId.OPTIMISM_MAINNET,
    MainnetChainId.BASE_MAINNET,
  ];

  return (
    <div className={cn(s.root, className)}>
      {getTvlDataError ? (
        <>
          <p>{getTvlDataError.message}</p>

          <button className={s.btn} type="button" onClick={() => refetch()}>
            Try again
          </button>
        </>
      ) : (
        <ul className={s.totalList}>
          {cells.map(cell => (
            <Cell {...cell} key={cell.label} />
          ))}
        </ul>
      )}

      <p className={s.chainCountLabel}>
        {data?.chainCount ? `${data.chainCount} chains` : loadingState}
      </p>

      <div className={s.chainList}>
        {chainIds.map(chainId => (
          <ChainIcon
            key={chainId}
            chainId={chainId}
            isOpen={openChainId === chainId}
            onMouseEnter={() => openChainIcon(chainId)}
            onMouseLeave={() => setOpenChainId(undefined)}
          />
        ))}
      </div>
    </div>
  );
};

export default Market;
