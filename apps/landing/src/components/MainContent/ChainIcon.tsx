import { MainnetChainId } from '@venusprotocol/chains';
import { motion } from 'motion/react';

import s from './ChainIcon.module.css';
import arbitrumLogoSrc from './assets/arbitrum.svg';
import baseLogoSrc from './assets/base.svg';
import bnbChainLogoSrc from './assets/bnbChain.svg';
import ethereumLogoSrc from './assets/ethereum.svg';
import opBnbLogoSrc from './assets/opBnb.svg';
import optimismLogoSrc from './assets/optimism.svg';
import unichainLogoSrc from './assets/unichain.svg';
import zkSyncLogoSrc from './assets/zkSync.svg';

const chainLogoMap: {
  [chainId in MainnetChainId]: {
    logoSrc: string;
    name: string;
    color: string;
  };
} = {
  [MainnetChainId.ARBITRUM_ONE]: {
    logoSrc: arbitrumLogoSrc,
    name: 'Arbitrum One',
    color: '#2D3C52',
  },
  [MainnetChainId.BASE_MAINNET]: {
    logoSrc: baseLogoSrc,
    name: 'Base',
    color: '#2066FF',
  },
  [MainnetChainId.BSC_MAINNET]: {
    logoSrc: bnbChainLogoSrc,
    name: 'BNB Chain',
    color: '#F0B90B',
  },
  [MainnetChainId.ETHEREUM]: {
    logoSrc: ethereumLogoSrc,
    name: 'Ethereum',
    color: '#3A78FE',
  },
  [MainnetChainId.OPBNB_MAINNET]: {
    logoSrc: opBnbLogoSrc,
    name: 'opBNB',
    color: '#2D3C52',
  },
  [MainnetChainId.OPTIMISM_MAINNET]: {
    logoSrc: optimismLogoSrc,
    name: 'Optimism',
    color: '#E93430',
  },
  [MainnetChainId.UNICHAIN_MAINNET]: {
    logoSrc: unichainLogoSrc,
    name: 'Unichain',
    color: '#E736A1',
  },
  [MainnetChainId.ZKSYNC_MAINNET]: {
    logoSrc: zkSyncLogoSrc,
    name: 'ZKsync',
    color: '#3A78FF',
  },
};

export interface IChainIconProps {
  chainId: MainnetChainId;
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const ChainIcon: React.FC<IChainIconProps> = ({ isOpen, onMouseEnter, onMouseLeave, chainId }) => {
  const chain = chainLogoMap[chainId];

  return (
    <motion.div
      initial="rest"
      animate={isOpen ? 'hover' : 'rest'}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      variants={{
        rest: {
          width: '32px',
        },
        hover: {
          width: 'auto',
        },
      }}
      className={s.root}
      style={{ backgroundColor: chain.color }}
    >
      <div className={s.logoContainer} style={{ backgroundColor: chain.color }}>
        <img src={chain.logoSrc} alt={`${chain.name} logo`} className={s.logo} />
      </div>

      <motion.span
        className={s.name}
        variants={{
          rest: { opacity: 0 },
          hover: { opacity: 1 },
        }}
      >
        {chain.name}
      </motion.span>
    </motion.div>
  );
};

export default ChainIcon;
