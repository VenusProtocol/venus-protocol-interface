import { cn } from '@venusprotocol/ui';
import { formatDate } from 'date-fns';

import { Icon, Wrapper } from 'components';

export interface LegalProps {
  title: string;
  lastUpdatedAt: Date;
  children: React.ReactNode;
}

export const Legal: React.FC<LegalProps> = ({ children, title, lastUpdatedAt }) => {
  const handleGoBack = () => window.history.back();

  const readableLastUpatedAt = formatDate(new Date(lastUpdatedAt), 'MMMM d, y');

  return (
    <Wrapper className="pt-15 pb-16 sm:pt-2">
      <div className="py-10 mb-10 border-b border-b-lightGrey space-y-1 sm:space-y-0 sm:flex sm:items-end sm:justify-between sm:py-16 sm:mb-16">
        <div className="flex items-center gap-x-3">
          <button type="button" onClick={handleGoBack} className="cursor-pointer">
            <Icon className="w-6 h-6 rotate-180" name="chevronRight" />
          </button>

          <h1 className="text-[2rem] font-semibold m-0">{title}</h1>
        </div>

        <p className="text-grey text-base m-0 ml-9 sm:pb-1.5">
          Last updated: <span className="text-white">{readableLastUpatedAt}</span>
        </p>
      </div>

      <div
        className={cn(
          'text-grey',
          '[&_h2]:text-white [&_h2]:mt-10 [&_h2]:text-h7 [&_h2]:font-bold',
          '[&_h3]:text-white [&_h3]:mt-5 [&_h3]:text-p2s',
          '[&_p,&_li]:text-p3r [&_p,&_li]:mt-5',
          '[&_a]:text-white [&_a]:underline',
          '[&_ul]:list-disc [&_ul]:ms-4',
          '[&_li]:text-inherit [&_li::marker]:text-white [&_li_&_span]:text-white [&_li_&_span]:font-semibold',
          'max-w-169.25',
        )}
      >
        {children}
      </div>
    </Wrapper>
  );
};
