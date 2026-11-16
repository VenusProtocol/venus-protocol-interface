import { cn } from '@venusprotocol/ui';

import { Icon, Wrapper } from 'components';
import { useTranslation } from 'libs/translations';

export interface LegalProps {
  title: string;
  lastUpdatedAt: Date;
  children: React.ReactNode;
}

export const Legal: React.FC<LegalProps> = ({ children, title, lastUpdatedAt }) => {
  const { Trans } = useTranslation();

  const handleGoBack = () => window.history.back();

  return (
    <Wrapper className="pt-15 pb-16 sm:pt-2">
      <div className="py-10 mb-10 border-b border-b-muted space-y-1 sm:space-y-0 sm:flex sm:items-end sm:justify-between sm:py-16 sm:mb-16">
        <div className="flex items-center gap-x-3">
          <button type="button" onClick={handleGoBack} className="cursor-pointer">
            <Icon className="w-6 h-6 rotate-180" name="chevronRight" />
          </button>

          <h1 className="text-[2rem] font-semibold m-0">{title}</h1>
        </div>

        <p className="text-secondary text-base m-0 ml-9 sm:pb-1.5">
          <Trans
            i18nKey="legal.lastUpdatedAt"
            values={{ date: lastUpdatedAt }}
            components={{
              White: <span className="text-primary" />,
            }}
          />
        </p>
      </div>

      <div
        className={cn(
          'text-secondary',
          '[&_h2]:text-primary [&_h2]:mt-10 [&_h2]:text-h7 [&_h2]:font-bold',
          '[&_h3]:text-primary [&_h3]:mt-5 [&_h3]:text-p2s',
          '[&_p,&_li]:text-p3r [&_p,&_li]:mt-5',
          '[&_a]:text-primary [&_a]:underline',
          '[&_ul]:list-disc [&_ul]:ms-4',
          '[&_li]:text-inherit [&_li::marker]:text-primary [&_li_&_span]:text-primary [&_li_&_span]:font-semibold',
          'max-w-169.25',
        )}
      >
        {children}
      </div>
    </Wrapper>
  );
};
