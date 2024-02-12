import { ReactElement } from 'react';

export type NoticeVariant = 'info' | 'loading' | 'error' | 'success' | 'warning';

export interface NoticeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  className?: string;
  title?: string | ReactElement;
  description: string | ReactElement;
  variant?: NoticeVariant;
  onClose?: () => void;
}
