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

export const Wallets: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="my-15 md:my-20 xl:my-25">
      <h2 className="text-[2rem] text-center mx-auto mb-10">{t('landing.wallets.title')}</h2>

      <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6 xl:gap-6">
        {wallets.map(({ logoSrc, name }) => (
          <div className="flex justify-center items-center" key={name}>
            <img loading="lazy" src={logoSrc} className="w-full" alt={name} />
          </div>
        ))}
      </div>
    </section>
  );
};
