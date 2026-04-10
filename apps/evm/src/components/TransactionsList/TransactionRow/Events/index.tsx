import { MARKET_TX_TYPES } from 'constants/marketTxTypes';
import { useTranslation } from 'libs/translations';
import type { MarketTx, Tx, YieldPlusTx } from 'types';
import { Event, type EventProps } from './Event';
import { formatToMarketTxEvents } from './formatToMarketTxEvents';
import { formatToYieldPlusTxEvents } from './formatToYieldPlusTxEvents';

export interface EventsProps {
  transaction: Tx;
}

export const Events: React.FC<EventsProps> = ({ transaction }) => {
  const { Trans } = useTranslation();

  const events: EventProps[] = MARKET_TX_TYPES.some(t => t === transaction.txType)
    ? formatToMarketTxEvents({ Trans, transaction: transaction as MarketTx })
    : formatToYieldPlusTxEvents({
        transaction: transaction as YieldPlusTx,
      });

  return (
    <div className="grid grid-cols-2 gap-4 w-full sm:grid-cols-3">
      {events.map(event => (
        <Event key={`${event.title}-${event.description}-${event.token?.address}`} {...event} />
      ))}
    </div>
  );
};
