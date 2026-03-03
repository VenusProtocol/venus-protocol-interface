import type { SequenceItem } from '../../../types';

export const renderCompletedLine = (item: SequenceItem) => {
  switch (item.type) {
    case 'market':
      return (
        <>
          <span className="text-blue">{item.rank}.</span>{' '}
          <span className="text-yellow">{item.name}</span> — Liquidity:{' '}
          <span className="text-green">{item.liquidity}</span> (Supply {item.supply} | Borrow{' '}
          {item.borrow})
        </>
      );

    case 'balance':
      return (
        <>
          <span className="mr-2 text-light-grey">•</span>
          <span className="text-blue">{item.token}:</span> {item.amount}
        </>
      );

    case 'position':
      return (
        <>
          <span className="mr-2 text-light-grey">•</span>
          {item.label}: <span className="text-yellow">{item.value}</span>
          {item.change && <span className="text-green"> ({item.change})</span>}
          {item.status && <span className="text-light-grey"> {item.status}</span>}
        </>
      );

    case 'tx':
      return (
        <>
          <span className="text-green">✓</span> {item.label} tx:{' '}
          <span className="text-xs text-light-grey">{item.hash}</span>
        </>
      );

    default:
      return item.text;
  }
};
