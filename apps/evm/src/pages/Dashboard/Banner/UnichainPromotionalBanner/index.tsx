import { ChainId } from '@venusprotocol/chains';
import { Button } from 'components';
import config from 'config';
import { useTranslation } from 'libs/translations';
import { useSwitchChain } from 'libs/wallet';
import { Template } from '../Template';
import background from './background.svg';
import logo from './logo.svg';

export const UnichainPromotionalBanner: React.FC = () => {
  const { t } = useTranslation();
  const { switchChain } = useSwitchChain();

  const handleButtonClick = () =>
    switchChain({
      chainId: config.network === 'testnet' ? ChainId.UNICHAIN_SEPOLIA : ChainId.UNICHAIN_MAINNET,
    });

  return (
    <Template className="unichain-theme border-[#84408C] bg-[#321B35] flex-col p-0 sm:flex sm:flex-row sm:p-0 md:justify-between">
      <div className="relative overflow-hidden flex justify-center items-center py-4 sm:order-2 sm:mb-0 sm:w-42 md:basis-1/3">
        <img
          src={background}
          className="absolute h-90 max-w-none -top-11 sm:left-0 sm:-top-17"
          alt={t('dashboard.unichainPromotionalBanner.background.alt')}
        />

        <img
          src={logo}
          className="h-31 relative max-w-none sm:ml-12 sm:h-43 md:ml-0"
          alt={t('dashboard.unichainPromotionalBanner.logo.alt')}
        />
      </div>

      <div className="flex flex-col grow px-4 pt-4 pb-6 sm:order-1 sm:p-6 sm:flex-1">
        <div className="grow">
          <p className="mb-2 text-lg">{t('dashboard.unichainPromotionalBanner.title')}</p>

          <p className="text-sm xl:text-base">
            {t('dashboard.unichainPromotionalBanner.description')}
          </p>
        </div>

        <Button className="w-full sm:w-auto sm:self-start" onClick={handleButtonClick}>
          {t('dashboard.unichainPromotionalBanner.buttonLabel')}
        </Button>
      </div>
    </Template>
  );
};
