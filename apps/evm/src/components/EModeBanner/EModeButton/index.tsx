import { ButtonWrapper, cn } from '@venusprotocol/ui';

import type { ButtonProps } from 'components';
import { routes } from 'constants/routing';
import { Link } from 'containers/Link';
import { useFormatTo } from 'hooks/useFormatTo';
import { TAB_PARAM_KEY } from 'hooks/useTabs';

export interface EModeButtonProps extends ButtonProps {
  poolComptrollerContractAddress: string;
}

export const EModeButton: React.FC<EModeButtonProps> = ({
  poolComptrollerContractAddress,
  children,
  className,
  ...otherProps
}) => {
  const { formatTo } = useFormatTo();
  const to = formatTo({
    to: {
      pathname: routes.pool.path.replace(':poolComptrollerAddress', poolComptrollerContractAddress),
      search: `${TAB_PARAM_KEY}=e-mode`,
    },
  });

  return (
    <ButtonWrapper
      asChild
      className={cn('text-offWhite no-underline hover:no-underline whitespace-nowrap', className)}
      {...otherProps}
    >
      <Link to={to}>{children}</Link>
    </ButtonWrapper>
  );
};
