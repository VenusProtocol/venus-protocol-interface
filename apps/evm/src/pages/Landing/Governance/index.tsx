import { useGetProposalCount } from 'clients/api';
import { Card } from 'components';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { useTranslation } from 'libs/translations';
import { GovernanceForumButton } from './GovernanceForumButton';
import backgroundGradientSrc from './assets/backgroundGradient.svg';
import illustrationSrc from './assets/illustration.png';

export const Governance: React.FC = () => {
  const { t, Trans } = useTranslation();
  const { data: getProposalCountData } = useGetProposalCount();

  const proposalCount = getProposalCountData?.proposalCount;

  return (
    <Card className="relative p-0 bg-[#071B2E] overflow-hidden">
      <img
        loading="lazy"
        className="absolute w-full h-full inset-0 object-cover object-[35%_60%] sm:object-[5%_60%]"
        src={backgroundGradientSrc}
        role="img"
        alt={t('landing.governance.backgroundGradientAlt')}
      />

      <img
        loading="lazy"
        className="absolute h-49 max-w-none w-auto -bottom-2 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:h-62 sm:left-68 sm:right-0 sm:-bottom-5 md:h-60 md:-bottom-2 md:left-79 lg:left-106 lg:h-60 lg:-bottom-3 xl:left-128 xl:h-78 2xl:h-98 2xl:-bottom-11"
        src={illustrationSrc}
        role="img"
        alt={t('landing.venusPrime.illustrationAlt')}
      />

      <div className="relative px-6 pt-6 pb-54 text-center space-y-6 sm:text-left sm:max-w-84 sm:pb-16 md:max-w-130 md:pb-26 lg:px-10 md:pt-10 lg:pb-12 lg:max-w-130">
        <div className="space-y-3">
          <h2 className="text-p2s lg:text-h6">
            <Trans
              i18nKey="landing.governance.title"
              components={{
                br: <br />,
              }}
            />
          </h2>

          <div className="sm:flex sm:gap-x-6 sm:items-center">
            <p className="text-h5 lg:text-h4">{proposalCount ?? PLACEHOLDER_KEY}</p>

            <p className="text-b1r max-w-58 mx-auto sm:max-w-none lg:text-p3r">
              {t('landing.governance.proposalCountLegend')}
            </p>
          </div>

          <p className="text-b1r text-light-grey lg:text-p3r">
            {t('landing.governance.description')}
          </p>
        </div>

        <div>
          <GovernanceForumButton size="sm" className="md:hidden" />
          <GovernanceForumButton size="md" className="hidden md:inline-flex" />
        </div>
      </div>
    </Card>
  );
};
