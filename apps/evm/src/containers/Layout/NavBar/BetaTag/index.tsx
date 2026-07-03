import { cn } from '@venusprotocol/ui';

import { useTranslation } from 'libs/translations';

export interface BetaTagProps {
  className?: string;
}

export const BetaTag: React.FC<BetaTagProps> = ({ className }) => {
  const { t } = useTranslation();

  return (
    <span
      className={cn(
        'inline-block rounded-full bg-blue px-1.5 py-0.5 text-b2s text-white',
        className,
      )}
    >
      {t('layout.menu.beta')}
    </span>
  );
};
