import { ChainId } from '@venusprotocol/chains';
import cn from 'classnames';
import { APP_MAIN_PRODUCTION_URL } from '../../constants/production';
import s from './Banner.module.css';
import Arrow from './assets/arrow.svg?react';
import Circles from './assets/circles.svg?react';
import Squares from './assets/squares.svg?react';
import UnichainLogo from './assets/unichainLogo.svg?react';

interface IBannerProps {
  className?: string;
}

const Banner: React.FC<IBannerProps> = ({ className }) => {
  return (
    <section className={cn(s.root, className)}>
      <a
        href={`${APP_MAIN_PRODUCTION_URL}/#/?chainId=${ChainId.UNICHAIN_MAINNET}`}
        className={cn(s.banner)}
      >
        <Squares className={cn(s.bgImg, s.leftBgImg)} />
        <Circles className={cn(s.bgImg, s.rightBgImg)} />

        <div className={cn(s.content)}>
          <UnichainLogo className={cn(s.unichainLogo)} />

          <span>
            We are live on Unichain! Enjoy ultra-low fees on the new lightning-fast Layer 2 network.
          </span>
        </div>

        <Arrow className={s.rightIcon} />
      </a>
    </section>
  );
};

export default Banner;
