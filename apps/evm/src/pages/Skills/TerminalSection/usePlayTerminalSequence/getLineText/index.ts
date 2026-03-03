import type { SequenceItem } from '../../../types';

export const getLineText = (item: SequenceItem) => {
  switch (item.type) {
    case 'user':
    case 'output':
    case 'header':
    case 'success':
      return item.text || '';

    case 'market':
      return `${item.rank}. ${item.name} — Liquidity: ${item.liquidity} (Supply ${item.supply} | Borrow ${item.borrow})`;

    case 'balance':
      return `•${item.token}: ${item.amount}`;

    case 'position': {
      const changeText = item.change ? ` (${item.change})` : '';
      const statusText = item.status ? ` ${item.status}` : '';

      return `•${item.label}: ${item.value}${changeText}${statusText}`;
    }

    case 'tx':
      return `✓ ${item.label} tx: ${item.hash}`;

    case 'blank':
      return '\u00A0';

    default:
      return '';
  }
};
