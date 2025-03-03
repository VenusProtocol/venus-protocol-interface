import { ChainId } from '@venusprotocol/chains';
import cn from 'classnames';
import { APP_MAIN_PRODUCTION_URL } from '../../constants/production';
import Container from '../Container/Container';
import s from './Banner.module.css';
import BeraChainLogo from './assets/beraChainLogo.svg?react';
import leftBeeImg from './assets/leftBee.png';
import leftBeeCombImg from './assets/leftBeeComb.png';
import rightBeeImg from './assets/rightBee.png';
import rightBeeCombImg from './assets/rightBeeComb.png';

interface IBannerProps {
  className?: string;
}

const Banner: React.FC<IBannerProps> = ({ className }) => (
  <Container className={cn(s.root, className)}>
    <a
      href={`${APP_MAIN_PRODUCTION_URL}/#/?chainId=${ChainId.UNICHAIN_MAINNET}`}
      className={cn(s.banner)}
    >
      <img src={leftBeeCombImg} alt="Left bee comb" className={cn(s.img, s.leftBgImg)} />
      <img src={rightBeeCombImg} alt="Right bee comb" className={cn(s.img, s.rightBgImg)} />

      <div className={cn(s.content)}>
        <div className={cn(s.sideColumn)}>
          <img
            src={leftBeeImg}
            alt="Left bee"
            className={cn(s.img, s.beeImg, s.leftIllustration)}
          />
        </div>

        <div className={cn(s.textContainer)}>
          <BeraChainLogo className={cn(s.berachainLogo)} />

          <span>Berachain is Live on Venus – Lock your Bera, unlock the Defi future!</span>
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
  </Container>
);

export default Banner;
