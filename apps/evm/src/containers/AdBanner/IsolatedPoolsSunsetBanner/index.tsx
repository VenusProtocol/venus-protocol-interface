import { useGetPools } from 'clients/api';
import config from 'config';
import { routes } from 'constants/routing';
import { useTranslation } from 'libs/translations';
import { ChainId } from 'types';
import { Banner } from '../Banner';
import illustration from './illustration.png';

export const IsolatedPoolsSunsetBanner: React.FC = () => {
  const { t } = useTranslation();
  const { data: getPoolsData } = useGetPools();

  const hasIsolatedPools = (getPoolsData?.pools.length ?? 0) > 1;
  const FALLBACK_CHAIN_ID = config.network === 'testnet' ? ChainId.BSC_TESTNET : ChainId.BSC_MAINNET;

  return (
    <Banner
      className="bg-gradient-to-r from-[#01193A] to-[#0D3CB1]"
      title={<span className="text-white">{t('isolatedPoolsSunsetBanner.title')}</span>}
      description={<span className="text-grey">{t('isolatedPoolsSunsetBanner.description')}</span>}
      illustration={
        <div className="h-10 w-20 sm:h-12 sm:w-[90px] lg:h-14">
          <img
            src={illustration}
            alt={t('isolatedPoolsSunsetBanner.illustrationAltText')}
            className="absolute w-20 -mt-5 -ml-3 sm:-mt-5 sm:w-[98px] lg:-mt-[14px]"
          />
        </div>
      }
      contentContainerClassName="gap-x-1"
      learnMoreUrl={routes.isolatedPools.path}
      learnMoreLinkProps={hasIsolatedPools ? undefined : { chainId: FALLBACK_CHAIN_ID }}
    />
  );
};
