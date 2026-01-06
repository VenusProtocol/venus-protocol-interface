import { cn } from '@venusprotocol/ui';
import { formatDate } from 'date-fns';

import Container from 'components/Container/Container';
import IconChevron from './assets/chevron.svg?react';
import s from './index.module.css';

export interface LegalProps {
  title: string;
  lastUpdatedAt: Date;
  children: React.ReactNode;
}

export const Legal: React.FC<LegalProps> = ({ children, title, lastUpdatedAt }) => {
  const handleGoBack = () => window.history.back();

  const readableLastUpatedAt = formatDate(new Date(lastUpdatedAt), 'MMMM d, y');

  return (
    <Container className="pt-15 pb-16 sm:pt-20">
      <div className="py-10 mb-10 border-b border-b-lightGrey space-y-1 sm:space-y-0 sm:flex sm:items-end sm:justify-between sm:py-16 sm:mb-16">
        <div className="flex items-center gap-x-3">
          <button type="button" onClick={handleGoBack} className="cursor-pointer">
            <IconChevron className="w-6 h-6" />
          </button>

          <h1 className="text-[2rem] font-semibold m-0">{title}</h1>
        </div>

        <p className="text-grey text-base m-0 ml-9 sm:pb-[6px]">
          Last updated: <span className="text-white">{readableLastUpatedAt}</span>
        </p>
      </div>

      <div className={cn(s.content, 'max-w-[677px]')}>{children}</div>
    </Container>
  );
};
