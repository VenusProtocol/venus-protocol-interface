import { useTranslation } from 'libs/translations';
import binanceLogoSrc from './assets/binance.svg';
import braveLogoSrc from './assets/brave.svg';
import foxWalletLogoSrc from './assets/foxWallet.svg';
import gateLogoSrc from './assets/gate.svg';
import infinityWalletLogoSrc from './assets/infinityWallet.svg';
import ledgerLogoSrc from './assets/ledger.svg';
import metaMaskLogoSrc from './assets/metaMask.svg';
import okxLogoSrc from './assets/okx.svg';
import rabbyWalletLogoSrc from './assets/rabbyWallet.svg';
import rivoLogoSrc from './assets/rivo.svg';
import safePalLogoSrc from './assets/safePal.svg';
import trustLogoSrc from './assets/trust.svg';

export interface WalletProps {
  className?: string;
}

interface Wallet {
  logoSrc: string;
  name: string;
}

const wallets: Wallet[] = [
  {
    logoSrc: binanceLogoSrc,
    name: 'Binance Wallet',
  },
  {
    logoSrc: trustLogoSrc,
    name: 'Trust Wallet',
  },
  {
    logoSrc: rabbyWalletLogoSrc,
    name: 'Rabby Wallet',
  },
  {
    logoSrc: metaMaskLogoSrc,
    name: 'MetaMask',
  },
  {
    logoSrc: foxWalletLogoSrc,
    name: 'Fox Wallet',
  },
  {
    logoSrc: safePalLogoSrc,
    name: 'SafePal',
  },
  {
    logoSrc: ledgerLogoSrc,
    name: 'Ledger',
  },
  {
    logoSrc: okxLogoSrc,
    name: 'OKX',
  },
  {
    logoSrc: infinityWalletLogoSrc,
    name: 'Infinity Wallet',
  },
  {
    logoSrc: braveLogoSrc,
    name: 'Brave Wallet',
  },
  {
    logoSrc: gateLogoSrc,
    name: 'Gate.io',
  },
  {
    logoSrc: rivoLogoSrc,
    name: 'Rivo',
  },
];

export const Wallets: React.FC<WalletProps> = ({ className }) => {
  const { t } = useTranslation();

  return (
    <section className={className}>
      <h2 className="text-p2s text-center mx-auto mb-5 sm:text-p1s sm:mb-10 lg:text-h6">
        {t('landing.wallets.title')}
      </h2>

      <div className="grid grid-cols-3 gap-x-1 gap-y-3 sm:grid-cols-4 md:px-6 lg:px-14 lg:gap-6 xl:grid-cols-6">
        {wallets.map(({ logoSrc, name }) => (
          <div className="flex justify-center items-center" key={name}>
            <img loading="lazy" src={logoSrc} className="h-12 sm:h-16" alt={name} />
          </div>
        ))}
      </div>
    </section>
  );
};
