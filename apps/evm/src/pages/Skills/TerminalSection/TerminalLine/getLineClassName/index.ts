import { cn } from '@venusprotocol/ui';

import type { SequenceItem } from '../../../types';

export const getLineClassName = (item: SequenceItem) => {
  if (item.type === 'user') {
    return cn('mt-[14px] mb-2 flex items-center italic text-orange');
  }

  if (item.type === 'output') {
    return cn(
      'my-[6px] pl-1',
      item.color === 'gray' && 'text-light-grey',
      item.color === 'green' && 'text-green',
      item.color === 'cyan' && 'text-blue',
      item.color === 'yellow' && 'text-yellow',
      (!item.color || item.color === 'white') && 'text-white',
    );
  }

  if (item.type === 'header') {
    return cn('mt-3 mb-[6px] font-semibold text-blue');
  }

  if (item.type === 'success') {
    return cn('my-[6px] font-semibold text-green');
  }

  return cn('my-[6px] pl-1 text-white');
};
