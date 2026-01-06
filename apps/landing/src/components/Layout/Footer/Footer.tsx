import { cn } from '@venusprotocol/ui';
import Container from 'components/Container/Container';
import { DOC_URL } from 'constants/production';
import { useDAppUrl } from 'hooks/useDAppUrl';
import Logo from '../assets/logo.svg?react';
import { NavLinkList } from './NavLink/NavLink';
import IconDiscord from './assets/discord.svg?react';
import IconGithub from './assets/github.svg?react';
import LogoMobile from './assets/logoSmall.svg?react';
import IconTelegram from './assets/telegram.svg?react';
import IconX from './assets/x.svg?react';

const socialLinks = [
  {
    Icon: IconTelegram,
    href: 'https://t.me/venusprotocol',
  },
  {
    Icon: IconDiscord,
    href: 'https://discord.gg/venus-protocol-912811548651708448',
  },
  {
    Icon: IconX,
    href: 'https://x.com/VenusProtocol',
  },
  {
    Icon: IconGithub,
    href: 'https://github.com/VenusProtocol/',
  },
];

const legalPages = [
  {
    href: '/privacy-policy',
    text: 'Privacy policy',
  },
  {
    href: '/terms-of-use',
    text: 'Terms of use',
  },
];

interface IFooterProps {
  className?: string;
}

const Footer: React.FC<IFooterProps> = ({ className }) => {
  const { dAppUrl } = useDAppUrl();

  const appPages = [
    {
      href: dAppUrl,
      text: 'App',
    },
    {
      href: DOC_URL,
      text: 'Docs',
    },
    {
      href: 'https://github.com/VenusProtocol/venus-protocol-documentation/tree/main/whitepapers',
      text: 'White paper',
    },
  ];

  return (
    <footer className={cn('bg-cards', className)}>
      <Container className="px-6 max-w-[1280px] mx-auto">
        <div className="flex gap-x-12 py-12 sm:gap-x-6 md:justify-between">
          <NavLinkList links={appPages} />

          <NavLinkList links={legalPages} />
        </div>

        <hr className="border-lightGrey m-0" />

        <div className="flex items-center justify-between py-10">
          <a href="/">
            <Logo key="footerLogo" className="hidden h-12 sm:block" />

            <LogoMobile key="footerLogoMobile" className="w-9 sm:hidden" />
          </a>

          <div className="flex items-center gap-x-6">
            {socialLinks.map(({ href, Icon }) => (
              <a
                href={href}
                key={href}
                className="w-8 h-8 rounded-[4px] bg-lightGrey flex items-center justify-center transition-colors hover:bg-blue active:bg-mediumBlue"
                target="_blank"
                rel="noreferrer"
              >
                <Icon className="w-4 text-white" />
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
