import cn from 'classnames';
import Container from '../Container/Container';
import Auditor from './Auditor';
import OtherAuditors from './OtherAuditors';
import s from './Safety.module.css';
import SafetyScore from './SafetyScore';
import CantinaLogo from './assets/cantinaLogo.svg?react';
import CantinaLogoGray from './assets/cantinaLogoGray.svg?react';
import CertikLogo from './assets/certikLogo.svg?react';
import CertikLogoGray from './assets/certikLogoGray.svg?react';
import Code4renaLogo from './assets/code4renaLogo.svg?react';
import Code4renaLogoGray from './assets/code4renaLogoGray.svg?react';
import OpenZeppelinLogo from './assets/openZeppelinLogo.svg?react';
import OpenZeppelinLogoGray from './assets/openZeppelinLogoGray.svg?react';
import PeckShieldLogo from './assets/peckShieldLogo.svg?react';
import PeckShieldLogoGray from './assets/peckShieldLogoGray.svg?react';
import PessimisticLogo from './assets/pessimisticLogo.svg?react';
import PessimisticLogoGray from './assets/pessimisticLogoGray.svg?react';
import QuantstampLogo from './assets/quantstampLogo.svg?react';
import QuantstampLogoGray from './assets/quantstampLogoGray.svg?react';

interface ISafetyProps {
  className?: string;
}

const auditors = [
  {
    Logo: OpenZeppelinLogoGray,
    LogoHovered: OpenZeppelinLogo,
    audits: 8,
    href: 'https://certificate.quantstamp.com/',
  },
  {
    Logo: QuantstampLogoGray,
    LogoHovered: QuantstampLogo,
    audits: 11,
    href: 'https://docs-v4.venus.io/links/security-and-audits',
  },
  {
    Logo: PeckShieldLogoGray,
    LogoHovered: PeckShieldLogo,
    audits: 21,
    href: 'https://docs-v4.venus.io/links/security-and-audits',
  },
  {
    Logo: CertikLogoGray,
    LogoHovered: CertikLogo,
    audits: 24,
    href: 'https://skynet.certik.com/projects/venus',
  },
  {
    Logo: Code4renaLogoGray,
    LogoHovered: Code4renaLogo,
    audits: 2,
    href: 'https://code4rena.com/contests/2023-05-venus-protocol-isolated-pools',
  },
  {
    Logo: CantinaLogoGray,
    LogoHovered: CantinaLogo,
    audits: 1,
    href: 'https://cantina.xyz/competitions/ddf86a5c-6f63-430f-aadc-d8742b4b1bcf',
  },
  {
    Logo: PessimisticLogoGray,
    LogoHovered: PessimisticLogo,
    audits: 2,
    href: 'https://github.com/pessimistic-io/audits',
  },
];

const Safety: React.FC<ISafetyProps> = ({ className }) => (
  <section className={cn(s.root, className)}>
    <Container className={s.container}>
      <h2 className={s.safetyBeforeAll}>Safety before all</h2>
      <p className={s.assetSecurity}>
        Transact with confidence, knowing Venus places nothing before the security of your assets
      </p>
      <div className={s.auditorsAndScore}>
        <SafetyScore className={s.safetyScoreMobile} />
        <div className={s.logos}>
          {auditors.map(a => (
            <Auditor key={`${a.href}-${a.audits}`} auditor={a} />
          ))}
          <OtherAuditors />
        </div>
        <SafetyScore className={s.safetyScoreDesktop} />
      </div>
    </Container>
  </section>
);

export default Safety;
