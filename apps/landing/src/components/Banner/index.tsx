import { ChainId } from '@venusprotocol/chains';
import cn from 'classnames';
import { APP_MAIN_PRODUCTION_URL } from '../../constants/production';
import s from './Banner.module.css';
import BerachainLogo from './assets/berachainLogo.svg?react';
import honeyCombPatternImg from './assets/honeyCombPattern.png';
import leftBeeImg from './assets/leftBee.png';
import rightBeeImg from './assets/rightBee.png';

interface IBannerProps {
  className?: string;
}

const Banner: React.FC<IBannerProps> = ({ className }) => (
  <div className={cn(s.root, className)}>
    <a
      href={`${APP_MAIN_PRODUCTION_URL}/#/?chainId=${ChainId.UNICHAIN_MAINNET}`}
      className={cn(
        s.banner,
        'bg-repeat bg-center bg-[length:auto_58px] before:absolute before:inset-0 before:bg-[linear-gradient(270deg,rgba(255,228,10,0.5)_0%,#FCD008_25%,#F9B606_49.5%,#F6A003_75%,rgba(243,135,1,0.5)_100%)]',
      )}
      style={{
        backgroundImage: `url(${honeyCombPatternImg})`,
      }}
    >
      <div className={cn(s.content)}>
        <div className={cn(s.sideColumn)}>
          <img
            src={leftBeeImg}
            alt="Left bee"
            className={cn(s.img, s.beeImg, s.leftIllustration)}
          />
        </div>

        <div className={cn(s.textContainer)}>
          <BerachainLogo className={cn(s.berachainLogo)} />

          <span className="text-sm sm:text-base">
            Berachain is Live on Venus – Lock your Bera, unlock the Defi future
          </span>
        </div>

        <div className={cn(s.sideColumn)}>
          <img
            src={rightBeeImg}
            alt="Right bee"
            className={cn(s.img, s.beeImg, s.rightIllustration)}
          />
        </div>
      </div>
    </a>
  </div>
);

export default Banner;
