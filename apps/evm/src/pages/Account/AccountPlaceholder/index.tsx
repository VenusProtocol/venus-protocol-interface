import { ButtonWrapper } from 'components';
import { routes } from 'constants/routing';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';

const AccountPlaceholder: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <h4 className="text-lg mb-6">{t('accountPlaceholder.assetsWillAppearHere')}</h4>

      <ButtonWrapper asChild>
        <Link to={routes.dashboard.path} className="text-offWhite hover:no-underline">
          {t('accountPlaceholder.letsGetStarted')}
        </Link>
      </ButtonWrapper>
    </div>
  );
};

export default AccountPlaceholder;
