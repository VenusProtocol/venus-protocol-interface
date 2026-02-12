import { cn } from '@venusprotocol/ui';

import { ButtonWrapper, Card, Icon, type IconName } from 'components';
import { ConnectWallet } from 'containers/ConnectWallet';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';

export interface PlaceholderProps {
  iconName: IconName;
  title: string;
  to?: string;
  className?: string;
}

export const Placeholder: React.FC<PlaceholderProps> = ({ iconName, title, to, className }) => {
  const { t } = useTranslation();
  const { accountAddress } = useAccountAddress();

  return (
    <Card className={cn('flex items-center justify-center py-10', className)}>
      <div className="text-center space-y-3">
        <div className="size-10 rounded-lg bg-lightGrey flex items-center justify-center mx-auto">
          <Icon name={iconName} className="size-5 text-grey" />
        </div>

        <h2 className="font-semibold">{title}</h2>

        {!!accountAddress && !!to && (
          <ButtonWrapper className="text-white hover:no-underline" size="xs" asChild>
            <Link to={to}>{t('dashboard.placeholder.buttonLabel')}</Link>
          </ButtonWrapper>
        )}

        {!accountAddress && <ConnectWallet buttonSize="sm" buttonClassName="w-auto" />}
      </div>
    </Card>
  );
};
