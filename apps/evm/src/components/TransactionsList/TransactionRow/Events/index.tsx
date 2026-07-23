import { useTranslation } from 'libs/translations';
import type { Tx } from 'types';
import { Event, type EventProps } from './Event';
import { formatToLiquidityHubTxEvents } from './formatToLiquidityHubTxEvents';
import { formatToMarketTxEvents } from './formatToMarketTxEvents';
import { formatToTradeTxEvents } from './formatToTradeTxEvents';

export interface EventsProps {
  transaction: Tx;
}

export const Events: React.FC<EventsProps> = ({ transaction }) => {
  const { t, Trans } = useTranslation();

  let events: EventProps[];

  if ('vhToken' in transaction) {
    events = formatToLiquidityHubTxEvents({
      transaction,
      t,
    });
  } else if ('vToken' in transaction) {
    events = formatToMarketTxEvents({ Trans, transaction });
  } else {
    events = formatToTradeTxEvents({ transaction });
  }

  return (
    <div className="grid grid-cols-2 gap-4 w-full sm:grid-cols-3">
      {events.map(event => (
        <Event key={`${event.title}-${event.description}-${event.token?.address}`} {...event} />
      ))}
    </div>
  );
};
