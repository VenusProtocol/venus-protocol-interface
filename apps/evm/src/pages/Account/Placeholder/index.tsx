import { ButtonWrapper, Card, Icon, type IconName } from 'components';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';

export interface PlaceholderProps {
  iconName: IconName;
  title: string;
  description: string;
  to?: string;
}

export const Placeholder: React.FC<PlaceholderProps> = ({ iconName, title, description, to }) => {
  const { t } = useTranslation();

  return (
    <Card className="flex items-center justify-center h-72">
      <div className="text-center">
        <div className="w-10 h-10 rounded-lg bg-lightGrey flex items-center justify-center mb-4 mx-auto">
          <Icon name={iconName} className="w-6 h-6 text-grey" />
        </div>

        <h2 className="mb-1 font-semibold">{title}</h2>

        <p className="text-grey">{description}</p>

        {!!to && (
          <ButtonWrapper className="mt-5 text-offWhite hover:no-underline" small asChild>
            <Link to={to}>{t('account.placeholder.buttonLabel')}</Link>
          </ButtonWrapper>
        )}
      </div>
    </Card>
  );
};
