import { cn } from '@venusprotocol/ui';
import Container from 'components/Container/Container';
import Link from 'components/Link/Link';
import { DOC_URL } from 'constants/production';
import { useDAppUrl } from 'hooks/useDAppUrl';
import NavigationLinks from '../NavigationLinks/NavigationLinks';
import Logo from '../assets/logo.svg?react';
import s from './Footer.module.css';
import SocialLinks from './SocialLinks';
import LogoMobile from './assets/logoSmall.svg?react';

interface IFooterProps {
  className?: string;
}

const Footer: React.FC<IFooterProps> = ({ className }) => {
  const { dAppUrl } = useDAppUrl();

  const content = [
    {
      href: dAppUrl,
      text: 'App',
    },
    {
      href: DOC_URL,
      text: 'Docs',
    },
  ];

  return (
    <footer className={cn(s.root, className)}>
      <Container className={s.container}>
        <div className={s.logoAndLinks}>
          <Logo key="footerLogo" className={s.logo} />
          <div className={s.links}>
            <LogoMobile key="footerLogoMobile" className={s.logoMobile} />
            <div className={s.navOptions}>
              <NavigationLinks
                content={content}
                classNames={{
                  root: s.footerNavLinksWrapper,
                  link: s.footerLink,
                }}
              />
              <Link
                variant="secondary"
                className={s.btn}
                href="https://github.com/VenusProtocol/venus-protocol-documentation/tree/main/whitepapers"
              >
                White paper
              </Link>
            </div>
            <div className={cn(s.navOptions, s.navOptionsMobile)}>
              <SocialLinks className={s.socialLinksWrapperMobile} />
              <Link
                variant="secondary"
                className={s.btnMobile}
                href="https://github.com/VenusProtocol/venus-protocol-documentation/tree/main/whitepapers"
              >
                White paper
              </Link>
            </div>
          </div>
        </div>
        <hr />
        <div className={s.copyWrapper}>
          <SocialLinks className={s.socialLinksWrapperDesktop} />
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
