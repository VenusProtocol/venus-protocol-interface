import { type DotLottie, DotLottieReact } from '@lottiefiles/dotlottie-react';
import { ChainId } from '@venusprotocol/chains';
import { BerachainPromoButton, VenusLogo, cn } from '@venusprotocol/ui';
import { useDeferredValue, useEffect, useRef, useState } from 'react';
import { APP_MAIN_PRODUCTION_URL } from '../../../constants/production';
import { Anchor } from '../../Anchor';

const SCROLL_THRESHOLD = 150;
const isComponentInBounds = () =>
  window.scrollY < document.body.offsetHeight - window.innerHeight - SCROLL_THRESHOLD;

const Component: React.FC = () => {
  const [loadedAnimationsCount, setLoadedAnimationsCount] = useState(0);
  const [isInBounds, setIsInBounds] = useState(isComponentInBounds());
  const shouldBeDisplayed = useDeferredValue(loadedAnimationsCount === 2 && isInBounds);

  const animationRefs = useRef<DotLottie[]>([]);
  const handleAnimationRef = (ref: DotLottie | null) => {
    if (ref) {
      animationRefs.current.push(ref);
      ref.addEventListener('load', () => setLoadedAnimationsCount(s => s + 1));
    }
  };

  useEffect(() => {
    return animationRefs.current.forEach(ref => ref?.removeEventListener('load'));
  }, []);

  // Automatically hide banner when page is scrolled all the way down (so that the footer is
  // visible) and show it again when the user scrolls back up
  useEffect(() => {
    const handleScroll = () => {
      const tmpIsInBounds = isComponentInBounds();

      if (tmpIsInBounds !== isInBounds) {
        setIsInBounds(tmpIsInBounds);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isInBounds]);

  const setAnimations = ({ play }: { play: boolean }) =>
    animationRefs.current.forEach(ref => {
      if (play) {
        ref.setMode('forward');
        ref.setLoop(true);
        ref.play();
      } else {
        ref.setMode('reverse');
        ref.setLoop(false);
      }
    });

  return (
    <div
      className={cn('berachain fixed bottom-0 left-0 right-0')}
      onMouseEnter={() => setAnimations({ play: true })}
      onMouseLeave={() => setAnimations({ play: false })}
    >
      <div
        className={cn(
          'backdrop-blur-sm h-31 fixed bottom-0 left-0 right-0 transition-opacity duration-500 opacity-0',
          shouldBeDisplayed && 'opacity-100',
        )}
        style={{
          WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 100%)',
          maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 100%)',
        }}
      />

      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 h-31 bg-gradient-to-b from-transparent to-[rgba(243,135,1,0.8)] transition-opacity duration-500 opacity-0',
          shouldBeDisplayed && 'opacity-100',
        )}
        style={{
          WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))',
          maskImage: 'linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))',
        }}
      />

      <div className="flex justify-between h-full gap-x-2 md:gap-x-7">
        <DotLottieReact
          src="/animations/bearWaveAnimation.lottie"
          loop
          dotLottieRefCallback={handleAnimationRef}
          className={cn(
            'h-41 w-41 shrink-0 transition-transform translate-y-full duration-500',
            shouldBeDisplayed && 'translate-y-0',
          )}
        />

        <div
          className={cn(
            'relative flex items-center self-end pb-8 gap-x-4 opacity-0 transition-opacity duration-500 md:gap-x-8 lg:gap-x-10',
            shouldBeDisplayed && 'opacity-100',
          )}
        >
          <div className="flex items-center md:gap-x-6 lg:gap-x-10">
            <div className="hidden shrink-0 items-center md:flex lg:gap-x-4">
              <VenusLogo chainId={ChainId.BERACHAIN_MAINNET} className="w-auto h-10 lg:hidden" />

              <VenusLogo
                chainId={ChainId.BERACHAIN_MAINNET}
                withText
                className="hidden w-auto h-10 lg:block"
              />
            </div>

            <p className="font-semibold bg-gradient-to-b from-[#FFE40A] from-25% to-[#F38701] bg-clip-text text-transparent">
              Venus is live on Berachain – Start eating the honey
            </p>
          </div>

          <BerachainPromoButton
            className="shrink-0"
            component={Anchor}
            href={APP_MAIN_PRODUCTION_URL}
          >
            Launch app
          </BerachainPromoButton>
        </div>

        <DotLottieReact
          src="/animations/beeNestAnimation.lottie"
          loop
          className={cn(
            'h-41 w-41 shrink-0 transition-transform translate-x-full duration-500',
            shouldBeDisplayed && 'translate-x-0',
          )}
          dotLottieRefCallback={handleAnimationRef}
        />
      </div>
    </div>
  );
};

export default Component;
