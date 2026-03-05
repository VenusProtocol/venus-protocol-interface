import { cn } from '@venusprotocol/ui';
import type { Address } from 'viem';

import { Icon } from 'components';
import { routes } from 'constants/routing';
import { Link } from 'containers/Link';
import { useFormatTo } from 'hooks/useFormatTo';
import { TAB_PARAM_KEY } from 'hooks/useTabs';
import { useTranslation } from 'libs/translations';

export interface IsolatedModeHeader {
  groupName: string;
  poolComptrollerContractAddress: Address;
  className?: string;
}

export const IsolatedModeHeader: React.FC<IsolatedModeHeader> = ({
  groupName,
  poolComptrollerContractAddress,
  className,
}) => {
  const { Trans } = useTranslation();
  const { formatTo } = useFormatTo();
  const to = formatTo({
    to: {
      pathname: routes.markets.path.replace(
        ':poolComptrollerAddress',
        poolComptrollerContractAddress,
      ),
      search: `${TAB_PARAM_KEY}=isolation-mode`,
    },
  });

  return (
    <Link
      className={cn(
        'flex items-center justify-center rounded-full border border-none bg-dark-blue-disabled h-8 px-2 text-white transition-colors duration-250 hover:no-underline hover:bg-dark-blue-active',
        className,
      )}
      to={to}
    >
      <div className="flex items-center gap-x-1">
        <Icon name="isolated" className="size-5" />

        <p className="text-sm font-semibold">
          <Trans
            i18nKey="account.marketBreakdown.tables.isolatedModeHeader.title"
            values={{
              groupName,
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
