import { type DotLottie, DotLottieReact } from '@lottiefiles/dotlottie-react';
import { ChainId } from '@venusprotocol/chains';
import { cn } from '@venusprotocol/ui';
import config from 'config';
import { useTranslation } from 'libs/translations';
import { useSwitchChain } from 'libs/wallet';
import { useDeferredValue, useEffect, useRef, useState } from 'react';
import backgroundSrc from './background.svg';
import berachainLogoSrc from './berachainLogo.svg';

const BerachainAd: React.FC = () => {
  const { t } = useTranslation();
  const { switchChain } = useSwitchChain();

  const [_isLoaded, setIsLoaded] = useState(false);
  const isLoaded = useDeferredValue(_isLoaded);

  const bearWaveAnimationRef = useRef<DotLottie>();
  const handleBearWaveAnimationRef = (ref: DotLottie | null) => {
    if (ref) {
      bearWaveAnimationRef.current = ref;
      ref.addEventListener('load', () => setIsLoaded(true));
    }
  };

  useEffect(() => {
    return () => {
      if (bearWaveAnimationRef.current) {
        bearWaveAnimationRef.current.removeEventListener('load');
      }
    };
  }, []);

  const setBearWaveAnimation = ({ play }: { play: boolean }) => {
    if (!bearWaveAnimationRef.current) {
      return;
    }

    if (play) {
      bearWaveAnimationRef.current.setMode('forward');
      bearWaveAnimationRef.current.setLoop(true);
      bearWaveAnimationRef.current.play();
    } else {
      bearWaveAnimationRef.current.setMode('reverse');
      bearWaveAnimationRef.current.setLoop(false);
    }
  };

  const handleClick = () =>
    switchChain({
      chainId: config.network === 'testnet' ? ChainId.BERACHAIN_TESTNET : ChainId.BERACHAIN_MAINNET,
    });

  return (
    <div
      className={cn(
        'relative w-full cursor-pointer pt-3 opacity-0 transition-opacity duration-500',
        isLoaded && 'opacity-100',
      )}
      onMouseEnter={() => setBearWaveAnimation({ play: true })}
      onMouseLeave={() => setBearWaveAnimation({ play: false })}
      onClick={handleClick}
    >
      <img
        src={backgroundSrc}
        alt={t('layout.menu.berachainAd.background.alt')}
        className="absolute bottom-0 left-0 right-0"
      />

      <div className="relative flex flex-col items-center gap-2 -mb-10">
        <img src={berachainLogoSrc} alt={t('layout.menu.berachainAdd.logo.alt')} className="h-6" />

        <p className="bg-gradient-to-b from-[#FFE40A] from-25% to-[#F38701] bg-clip-text text-transparent font-semibold">
          {t('layout.menu.berachainAd.title')}
        </p>
      </div>

      <DotLottieReact
        src="/animations/bearWaveAnimation.lottie"
        loop
        dotLottieRefCallback={handleBearWaveAnimationRef}
        className="relative h-52 w-52"
      />
    </div>
  );
};

export default BerachainAd;
