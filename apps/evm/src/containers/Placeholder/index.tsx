import { ButtonWrapper, cn } from '@venusprotocol/ui';
import type { To } from 'react-router';

import { Card } from 'components/Card';
import { Icon, type IconName } from 'components/Icon';
import { ConnectWallet } from 'containers/ConnectWallet';
import { Link } from 'containers/Link';
import { useAccountAddress } from 'libs/wallet';

export interface PlaceholderProps {
  iconName: IconName;
  title: string;
  description?: string;
  buttonLabel?: string;
  to?: To;
  className?: string;
}

export const Placeholder: React.FC<PlaceholderProps> = ({
  title,
  iconName,
  description,
  className,
  to,
  buttonLabel,
}) => {
  const { accountAddress } = useAccountAddress();

  return (
    <Card className={cn('flex items-center justify-center py-10', className)}>
      <div className="text-center flex flex-col gap-y-3">
        <div className="size-10 rounded-lg bg-lightGrey flex items-center justify-center mx-auto">
          <Icon name={iconName} className="size-5 text-grey" />
        </div>

        <div className="flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-2">
            <h2 className="text-b1s">{title}</h2>

            {!!description && <p className="text-b1r text-light-grey">{description}</p>}
          </div>

          {!!accountAddress && !!to && !!buttonLabel && (
            <ButtonWrapper className="text-white hover:no-underline" size="xs" asChild>
              <Link to={to}>{buttonLabel}</Link>
            </ButtonWrapper>
          )}

          {!accountAddress && <ConnectWallet buttonSize="sm" />}
        </div>
      </div>
    </Card>
  );
};
