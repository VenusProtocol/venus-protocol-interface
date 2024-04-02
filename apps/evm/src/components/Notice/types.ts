import type { ReactElement } from 'react';

export type NoticeVariant = 'info' | 'loading' | 'error' | 'success' | 'warning';

export interface NoticeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  description: string | ReactElement;
  title?: string | ReactElement;
  variant?: NoticeVariant;
  onClose?: () => void;
}
