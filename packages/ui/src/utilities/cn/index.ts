import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            'b3r',
            'b3s',
            'b2r',
            'b2s',
            'b1r',
            'b1s',
            'p3r',
            'p3s',
            'p2r',
            'p2s',
            'p1r',
            'p1s',
            'h7',
            'h6',
            'h5',
            'h4',
            'h3',
            'h2',
          ],
        },
      ],
    },
  },
});

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
