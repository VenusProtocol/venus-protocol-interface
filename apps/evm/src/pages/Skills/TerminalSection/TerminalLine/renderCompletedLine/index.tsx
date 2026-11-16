import type { SequenceItem } from '../../../types';

export const renderCompletedLine = (item: SequenceItem) => {
  switch (item.type) {
    case 'market':
      return (
        <>
          <span className="text-brand">{item.rank}.</span>{' '}
          <span className="text-warning">{item.name}</span> — Liquidity:{' '}
          <span className="text-success">{item.liquidity}</span> (Supply {item.supply} | Borrow{' '}
          {item.borrow})
        </>
      );

    case 'balance':
      return (
        <>
          <span className="mr-2 text-secondary">•</span>
          <span className="text-brand">{item.token}:</span> {item.amount}
        </>
      );

    case 'position':
      return (
        <>
          <span className="mr-2 text-secondary">•</span>
          {item.label}: <span className="text-warning">{item.value}</span>
          {item.change && <span className="text-success"> ({item.change})</span>}
          {item.status && <span className="text-secondary"> {item.status}</span>}
        </>
      );

    case 'tx':
      return (
        <>
          <span className="text-success">✓</span> {item.label} tx:{' '}
          <span className="text-xs text-secondary">{item.hash}</span>
        </>
      );

    default:
      return item.text;
  }
};
