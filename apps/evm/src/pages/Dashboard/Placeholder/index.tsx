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
    <Card className="flex items-center justify-center h-72">
      <div className="flex flex-col items-center text-center">
        <div className="w-10 h-10 rounded-lg bg-lightGrey flex items-center justify-center mb-4 mx-auto">
          <Icon name={iconName} className="w-6 h-6 text-grey" />
        </div>

        <h2 className="mb-1 font-semibold">{title}</h2>

        {description && <p className="text-grey text-sm">{description}</p>}

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
