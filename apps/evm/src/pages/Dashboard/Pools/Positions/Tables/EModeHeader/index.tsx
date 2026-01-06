import { cn } from '@venusprotocol/ui';
import type { Address } from 'viem';

import lightningIllustrationSrc from 'assets/img/lightning.svg';
import { routes } from 'constants/routing';
import { Link } from 'containers/Link';
import { useFormatTo } from 'hooks/useFormatTo';
import { TAB_PARAM_KEY } from 'hooks/useTabs';
import { useTranslation } from 'libs/translations';

export interface EModeHeaderProps {
  eModeGroupName: string;
  poolComptrollerContractAddress: Address;
  className?: string;
}

export const EModeHeader: React.FC<EModeHeaderProps> = ({
  eModeGroupName,
  poolComptrollerContractAddress,
  className,
}) => {
  const { t, Trans } = useTranslation();
  const { formatTo } = useFormatTo();
  const to = formatTo({
    to: {
      pathname: routes.markets.path.replace(
        ':poolComptrollerAddress',
        poolComptrollerContractAddress,
      ),
      search: `${TAB_PARAM_KEY}=e-mode`,
    },
  });

  return (
    <Link
      className={cn(
        'flex items-center justify-center rounded-full border border-lightGrey bg-cards h-8 px-2 text-white transition-colors duration-250 hover:no-underline hover:bg-lightGrey',
        className,
      )}
      to={to}
    >
      <div className="flex items-center gap-x-1">
        <div className={cn('w-5 h-5 rounded-full flex items-center justify-center bg-lightGrey')}>
          <img
            src={lightningIllustrationSrc}
            className="h-3"
            alt={t('account.marketBreakdown.tables.eModeHeader.illustrationAltText')}
          />
        </div>

        <p className="text-sm font-semibold">
          <Trans
            i18nKey="account.marketBreakdown.tables.eModeHeader.title"
            values={{
              eModeGroupName,
            }}
            components={{
              UnderlinedText: <span className="underline" />,
            }}
          />
        </p>
      </div>
    </Link>
  );
};
