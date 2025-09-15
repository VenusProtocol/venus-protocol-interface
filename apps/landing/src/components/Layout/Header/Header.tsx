import { cn } from '@venusprotocol/ui';
import { useEffect } from 'react';
import ScrollLock from 'react-scrolllock';

import LinkLaunchApp from 'components/Link/LinkLaunchApp';
import { DOC_URL, WHITEPAPERS_URL } from 'constants/production';
import { useAppStateContext } from 'context';
import NavigationLinks from '../NavigationLinks/NavigationLinks';
import Logo from '../assets/logo.svg?react';
import s from './Header.module.css';
import MenuMobile from './MenuMobile';

const content = [
  {
    href: WHITEPAPERS_URL,
    text: 'Whitepapers',
  },
  {
    href: DOC_URL,
    text: 'Docs',
  },
];

interface IHeaderProps {
  className?: string;
}

const HEADER_ID = 'header-id';

const scrollEvent = () => {
  const header = document.getElementById(HEADER_ID);
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (header) {
    if (scrollTop > 100) {
      header.classList.add(s.headerAfterScroll);
    } else {
      header.classList.remove(s.headerAfterScroll);
    }
  }
};

const Header: React.FC<IHeaderProps> = ({ className }) => {
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useAppStateContext();

  useEffect(() => {
    window.addEventListener('scroll', scrollEvent);

    return () => {
      window.removeEventListener('scroll', scrollEvent);
    };
  }, []);

  return (
    <>
      <header
        id={HEADER_ID}
        className={cn(s.root, isMobileMenuOpen && s.headerAfterScroll, className)}
      >
        <Logo key="headerLogo" className={s.logo} />

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          type="button"
          className={s.menuMobileBtn}
        >
          {isMobileMenuOpen ? (
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.3334 2.54663L17.4534 0.666626L10.0001 8.11996L2.54675 0.666626L0.666748 2.54663L8.12008 9.99996L0.666748 17.4533L2.54675 19.3333L10.0001 11.88L17.4534 19.3333L19.3334 17.4533L11.8801 9.99996L19.3334 2.54663Z"
                fill="white"
              />
            </svg>
          ) : (
            <svg
              width="24"
              height="16"
              viewBox="0 0 24 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 16H24V13.3333H0V16ZM0 9.33333H24V6.66667H0V9.33333ZM0 0V2.66667H24V0H0Z"
                fill="white"
              />
            </svg>
          )}
        </button>

        <MenuMobile className={cn(s.menuMobile, isMobileMenuOpen && s.menuMobileOpened)} />

        <div className={s.menuDesktop}>
          <NavigationLinks
            content={content}
            classNames={{
              root: s.headerNavLinksWrapper,
              link: s.headerLink,
            }}
          />
          <LinkLaunchApp variant="secondary" className={s.btn} />
        </div>
      </header>

      <ScrollLock isActive={isMobileMenuOpen} accountForScrollbars={false} />
    </>
  );
};

export default Header;
