import Container from '../Container/Container';
import s from './Wallets.module.css';

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

const Wallets: React.FC = () => (
  <section className={s.root}>
    <Container>
      <h2 className={s.title}>Trusted by many</h2>

      <div className={s.logos}>
        {wallets.map(({ logoSrc, name }) => (
          <div className={s.logoContainer}>
            <img src={logoSrc} className={s.logo} alt={name} />
          </div>
        ))}
      </div>
    </Container>
  </section>
);

export default Wallets;
