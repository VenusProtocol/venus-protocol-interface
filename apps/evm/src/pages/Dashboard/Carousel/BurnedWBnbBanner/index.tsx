import { ButtonWrapper } from 'components';
import { BURNED_WBNB_SNAPSHOT_URL } from 'constants/burnedWBnb';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';

import { Template } from '../Template';
import illustrationSrc from './illustration.jpg';

export const BurnedWBnbBanner: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Template className="flex-col border-lightGrey py-6 sm:p-0 md:p-0 sm:flex sm:flex-row">
      <div className="relative h-50 justify-center sm:h-auto sm:order-2 sm:mb-0 sm:basis-5/12 xl:grow">
        <img
          src={illustrationSrc}
          className="h-80 max-w-none absolute left-1/2 -translate-x-1/2 -top-18 sm:top-1/2 sm:-translate-y-1/2 sm:h-102"
          alt={t('dashboard.burnedWBnbBanner.illustration.alt')}
        />
      </div>

      <div className="flex z-0 flex-col grow xxl:max-w-162 sm:order-1 sm:basis-7/12 sm:p-4 md:p-6">
        <div className="grow">
          <p className="mb-2 text-lg">{t('dashboard.burnedWBnbBanner.title')}</p>

          <p className="text-grey text-sm xl:text-base">
            {t('dashboard.burnedWBnbBanner.description')}
          </p>
        </div>

        <ButtonWrapper variant="secondary" className="w-full sm:w-auto sm:self-start" asChild>
          <Link
            href={BURNED_WBNB_SNAPSHOT_URL}
            className="text-offWhite no-underline hover:no-underline"
          >
            {t('dashboard.burnedWBnbBanner.buttonLabel.snapshotPage')}
          </Link>
        </ButtonWrapper>
      </div>
    </Template>
  );
};
