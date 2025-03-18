import { type DotLottie, DotLottieReact } from '@lottiefiles/dotlottie-react';
import { cn } from '@venusprotocol/ui';
import { useDeferredValue, useEffect, useRef, useState } from 'react';
import { APP_MAIN_PRODUCTION_URL } from '../../../../constants/production';

const Component: React.FC = () => {
  const [tmpIsLoaded, setIsLoaded] = useState(false);
  const isLoaded = useDeferredValue(tmpIsLoaded);

  const animationRef = useRef<DotLottie>();
  const handleAnimationRef = (ref: DotLottie | null) => {
    if (ref) {
      animationRef.current = ref;
      ref.addEventListener('load', () => setIsLoaded(true));
    }
  };

  useEffect(() => {
    return animationRef.current?.removeEventListener('load');
  }, []);

  return (
    <a
      href={APP_MAIN_PRODUCTION_URL}
      className={cn(
        'h-100 w-60 absolute right-0 top-30 transition-transform translate-x-full duration-500',
        isLoaded && 'translate-x-0',
      )}
    >
      <DotLottieReact
        src="/animations/beeNestBearHandAnimation.lottie"
        loop
        autoplay
        dotLottieRefCallback={handleAnimationRef}
      />
    </a>
  );
};

export default Component;
