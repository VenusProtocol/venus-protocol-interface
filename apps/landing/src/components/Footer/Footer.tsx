import cn from 'classnames';
import { APP_MAIN_PRODUCTION_URL, DOC_URL } from '../../constants/production';
import Container from '../Container/Container';
import Logo from '../Header/assets/logo.svg?react';
import Link from '../Link/Link';
import NavigationLinks from '../NavigationLinks/NavigationLinks';
import s from './Footer.module.css';
import SocialLinks from './SocialLinks';
import LogoMobile from './assets/logoSmall.svg?react';

const content = [
  {
    href: APP_MAIN_PRODUCTION_URL,
    text: 'App',
  },
  {
    href: DOC_URL,
    text: 'Docs',
  },
];

interface IFooterProps {
  className?: string;
}

const Footer: React.FC<IFooterProps> = ({ className }) => (
  <footer className={cn(s.root, className)}>
    <Container className={s.container}>
      <div className={s.logoAndLinks}>
        <Logo key="footerLogo" className={s.logo} />
        <div className={s.links}>
          <LogoMobile key="footerLogoMobile" className={s.logoMobile} />
          <div className={s.navOptions}>
            <NavigationLinks
              content={content}
              classNames={{ root: s.footerNavLinksWrapper, link: s.footerLink }}
            />
            <Link
              variant="buttonTransparent"
              className={s.btn}
              href="https://github.com/VenusProtocol/venus-protocol-documentation/tree/main/whitepapers"
            >
              White paper
            </Link>
          </div>
          <div className={cn(s.navOptions, s.navOptionsMobile)}>
            <SocialLinks className={s.socialLinksWrapperMobile} />
            <Link
              variant="buttonTransparent"
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

export default Footer;
