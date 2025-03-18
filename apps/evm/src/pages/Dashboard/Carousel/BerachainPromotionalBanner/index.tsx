import { ChainId } from '@venusprotocol/chains';
import { BerachainPromoButton } from '@venusprotocol/ui';
import config from 'config';
import { useTranslation } from 'libs/translations';
import { useSwitchChain } from 'libs/wallet';
import { Template } from '../Template';
import blurredBackground from './blurredBackground.png';
import illustration from './illustration.png';
import illustrationSm from './illustrationSm.png';

export const BerachainPromotionalBanner: React.FC = () => {
  const { t } = useTranslation();
  const { switchChain } = useSwitchChain();

  const handleButtonClick = () =>
    switchChain({
      chainId: config.network === 'testnet' ? ChainId.BERACHAIN_TESTNET : ChainId.BERACHAIN_MAINNET,
    });

  return (
    <Template className="berachain border-blue bg-gradient-to-t from-[#08080A] to-[#AD6501] to-[200%] sm:from-[#AD6501] sm:to-[#08080A] sm:to-[100%] sm:from-[-100%] flex-col p-0 sm:flex sm:flex-row sm:p-0 md:justify-between">
      <img
        className="absolute hidden h-50 bottom-0 left-[440px] sm:block"
        alt={t('dashboard.berachainPromotionalBanner.blurredBackground.alt')}
        src={blurredBackground}
      />

      <div className="relative overflow-hidden flex justify-center items-center py-4 sm:order-2 sm:mb-0 sm:w-42 sm:justify-start md:basis-1/3">
        <img
          src={illustrationSm}
          className="h-29 max-w-none sm:hidden"
          alt={t('dashboard.berachainPromotionalBanner.illustration.alt')}
        />

        <img
          src={illustration}
          className="hidden h-60 max-w-none sm:block lg:h-68"
          alt={t('dashboard.berachainPromotionalBanner.illustration.alt')}
        />
      </div>

      <div className="flex flex-col grow px-4 pt-4 pb-6 sm:order-1 sm:p-6 sm:flex-1">
        <div className="grow">
          <p className="mb-2 text-lg">{t('dashboard.berachainPromotionalBanner.title')}</p>

          <p className="text-sm xl:text-base">
            {t('dashboard.berachainPromotionalBanner.description')}
          </p>
        </div>

        <BerachainPromoButton
          className="w-full min-w-38 sm:w-auto sm:self-start"
          onClick={handleButtonClick}
        >
          {t('dashboard.berachainPromotionalBanner.buttonLabel')}
        </BerachainPromoButton>
      </div>
    </Template>
  );
};
