import { ButtonWrapper, cn } from '@venusprotocol/ui';

import type { ButtonProps } from 'components';
import { routes } from 'constants/routing';
import { Link } from 'containers/Link';
import { useFormatTo } from 'hooks/useFormatTo';
import { TAB_PARAM_KEY } from 'hooks/useTabs';
import { useAnalytics } from 'libs/analytics';

export interface EModeButtonProps extends ButtonProps {
  poolComptrollerContractAddress: string;
  analyticVariant: string;
}

export const EModeButton: React.FC<EModeButtonProps> = ({
  poolComptrollerContractAddress,
  children,
  className,
  analyticVariant,
  ...otherProps
}) => {
  const { captureAnalyticEvent } = useAnalytics();

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

  const handleClick = () => captureAnalyticEvent('e_mode_navigation', { variant: analyticVariant });

  return (
    <ButtonWrapper
      asChild
      className={cn('text-white no-underline hover:no-underline whitespace-nowrap', className)}
      {...otherProps}
    >
      <Link to={to} onClick={handleClick}>
        {children}
      </Link>
    </ButtonWrapper>
  );
};
