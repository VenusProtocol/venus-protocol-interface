import { cn } from 'components';
import { VENUS_DOC_URL } from 'constants/production';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';
import { Auditor, type AuditorProps } from './Auditor';
import { SafetyScore } from './SafetyScore';
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

const SECURITY_DOC_URL = `${VENUS_DOC_URL}/links/security-and-audits`;

interface ISafetyProps {
  className?: string;
}

const auditors: AuditorProps[] = [
  {
    Logo: OpenZeppelinLogoGray,
    LogoHovered: OpenZeppelinLogo,
    auditsCount: 8,
    href: SECURITY_DOC_URL,
  },
  {
    Logo: QuantstampLogoGray,
    LogoHovered: QuantstampLogo,
    auditsCount: 11,
    href: 'https://certificate.quantstamp.com/',
  },
  {
    Logo: PeckShieldLogoGray,
    LogoHovered: PeckShieldLogo,
    auditsCount: 21,
    href: SECURITY_DOC_URL,
  },
  {
    Logo: CertikLogoGray,
    LogoHovered: CertikLogo,
    auditsCount: 24,
    href: 'https://skynet.certik.com/projects/venus',
  },
  {
    Logo: Code4renaLogoGray,
    LogoHovered: Code4renaLogo,
    auditsCount: 2,
    href: 'https://code4rena.com/contests/2023-05-venus-protocol-isolated-pools',
  },
  {
    Logo: CantinaLogoGray,
    LogoHovered: CantinaLogo,
    auditsCount: 1,
    href: 'https://cantina.xyz/competitions/ddf86a5c-6f63-430f-aadc-d8742b4b1bcf',
  },
  {
    Logo: PessimisticLogoGray,
    LogoHovered: PessimisticLogo,
    auditsCount: 2,
    href: 'https://github.com/pessimistic-io/audits',
  },
];

export const Safety: React.FC<ISafetyProps> = ({ className }) => {
  const { t } = useTranslation();

  return (
    <section className={className}>
      <div className="flex flex-col flex-wrap items-center">
        <div className="max-w-136 text-center mb-6 xl:mb-16">
          <h2 className="text-p1s mb-3 md:text-h6 md:mb-4">{t('landing.safety.title')}</h2>

          <p className="text-center text-b1r text-grey md:text-p3r">{t('landing.safety.text')}</p>
        </div>

        <div className="flex flex-col w-full gap-3 sm:gap-6 xl:grid xl:grid-cols-3">
          <SafetyScore className="xl:order-2 xl:col-span-1" />

          <div className="grid grid-cols-2 gap-3 grow sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 xl:order-1 xl:col-span-2">
            {auditors.map(a => (
              <Auditor key={`${a.href}-${a.auditsCount}-${a.Logo.toString()}`} {...a} />
            ))}

            <Link
              className={cn(
                'rounded-lg border flex items-center justify-center border-dashed border-dark-blue-hover text-center p-4 sm:col-span-2 lg:col-span-1',
              )}
              href={SECURITY_DOC_URL}
            >
              <p className="max-w-38 text-b1r">{t('landing.safety.otherAuditors')}</p>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
