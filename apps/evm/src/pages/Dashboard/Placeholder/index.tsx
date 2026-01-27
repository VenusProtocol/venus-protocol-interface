import { ButtonWrapper, Card, Icon, type IconName } from 'components';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';

export interface PlaceholderProps {
  iconName: IconName;
  title: string;
  to?: string;
}

export const Placeholder: React.FC<PlaceholderProps> = ({ iconName, title, to }) => {
  const { t } = useTranslation();

  return (
    <Card className="flex items-center justify-center py-10">
      <div className="text-center">
        <div className="w-10 h-10 rounded-lg bg-lightGrey flex items-center justify-center mb-4 mx-auto">
          <Icon name={iconName} className="w-6 h-6 text-grey" />
        </div>

        <h2 className="mb-1 font-semibold">{title}</h2>

        {!!to && (
          <ButtonWrapper className="mt-5 text-white hover:no-underline" size="xs" asChild>
            <Link to={to}>{t('dashboard.placeholder.buttonLabel')}</Link>
          </ButtonWrapper>
        )}
      </div>
    </Card>
  );
};
