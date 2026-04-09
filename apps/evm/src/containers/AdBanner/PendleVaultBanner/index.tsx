import { ButtonWrapper } from '@venusprotocol/ui';
import { routes } from 'constants/routing';
import { Link } from 'containers/Link';
import { useBreakpointUp } from 'hooks/responsive';
import { useTranslation } from 'libs/translations';
import vaultIllustration from './vault.png';

export const PendleVaultBanner: React.FC = () => {
  const { t, Trans } = useTranslation();
  const isSmOrUp = useBreakpointUp('sm');

  return (
    <div className="relative rounded-lg h-26.25 px-4 pt-2 pb-3 flex flex-col gap-y-3 bg-linear-to-r from-[#01193A] to-[#0D3CB1] sm:h-18 sm:flex-row sm:items-center sm:justify-between sm:py-3 sm:pl-46">
      <div className="flex flex-col gap-y-3 sm:flex-row sm:justify-between sm:gap-x-4 sm:items-center sm:grow">
        <div className="flex flex-col gap-y-0.5">
          <p className="font-semibold text-sm lg:text-base">{t('pendleVaultBanner.title')}</p>

          <p className="text-xs text-grey lg:text-sm">
            {
              <Trans
                i18nKey="pendleVaultBanner.description"
                components={{
                  White: <span className="text-white" />,
                }}
              />
            }
          </p>
        </div>

        <ButtonWrapper size={isSmOrUp ? 'md' : 'xs'} className="px-5 self-start md:px-6" asChild>
          <Link to={routes.vaults.path} noStyle>
            {t('adBanner.startNow')}
          </Link>
        </ButtonWrapper>
      </div>

      <img
        src={vaultIllustration}
        className="absolute -right-3.5 bottom-0 h-18 sm:left-4 sm:h-22"
        alt={t('pendleVaultBanner.illustrationAltText')}
      />
    </div>
  );
};
