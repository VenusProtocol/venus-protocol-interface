import { ButtonWrapper, type ButtonWrapperProps, Card, Icon, type IconName } from 'components';
import { ConnectWallet } from 'containers/ConnectWallet';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';

export interface PlaceholderProps {
  iconName: IconName;
  title: string;
  description?: string;
  to?: string;
  buttonSize?: ButtonWrapperProps['size'];
}

export const Placeholder: React.FC<PlaceholderProps> = ({
  iconName,
  title,
  description,
  to,
  buttonSize = 'xs',
}) => {
  const { t } = useTranslation();

  return (
    <Card className="flex h-72 items-center justify-center">
      <div className="flex flex-col items-center text-center">
        <div className="mx-auto mb-4 flex size-10 items-center justify-center rounded-lg bg-lightGrey">
          <Icon name={iconName} className="size-6 text-grey" />
        </div>

        <h2 className="mb-1 text-p3s">{title}</h2>

        {description && <p className="text-b1r text-grey">{description}</p>}

        {!!to && (
          <ConnectWallet buttonSize={buttonSize} className="mt-5 w-fit">
            <ButtonWrapper className="text-white hover:no-underline" size={buttonSize} asChild>
              <Link to={to}>{t('account.placeholder.buttonLabel')}</Link>
            </ButtonWrapper>
          </ConnectWallet>
        )}
      </div>
    </Card>
  );
};
