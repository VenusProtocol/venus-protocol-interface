import { cn } from '@venusprotocol/ui';

import lightningIllustrationSrc from 'assets/img/lightning.svg';
import { Link } from 'containers/Link';
import { useFormatTo } from 'hooks/useFormatTo';
import { useMarketsPagePath } from 'hooks/useMarketsPagePath';
import { TAB_PARAM_KEY } from 'hooks/useTabs';
import { useTranslation } from 'libs/translations';

export interface EModeButtonProps {
  eModeGroupName: string;
  className?: string;
}

export const EModeButton: React.FC<EModeButtonProps> = ({ eModeGroupName, className }) => {
  const { t, Trans } = useTranslation();
  const { formatTo } = useFormatTo();

  const { marketsPagePath } = useMarketsPagePath();

  const to = formatTo({
    to: {
      pathname: marketsPagePath,
      search: `${TAB_PARAM_KEY}=e-mode`,
    },
  });

  return (
    <Link
      className={cn(
        'flex items-center justify-center rounded-full bg-dark-blue-disabled h-8 px-2 text-offWhite transition-colors duration-250 group hover:bg-lightGrey',
        className,
      )}
      to={to}
      noStyle
    >
      <div className="flex items-center gap-x-2">
        <div className="size-5 rounded-full flex items-center justify-center bg-dark-blue-hover">
          <img
            src={lightningIllustrationSrc}
            className="h-3"
            alt={t('dashboard.marketBreakdown.tables.eModeButton.illustrationAltText')}
          />
        </div>

        <p className="text-b1s text-light-grey transition-colors group-hover:text-white">
          <Trans
            i18nKey="dashboard.marketBreakdown.tables.eModeButton.title"
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
