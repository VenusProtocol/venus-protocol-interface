import Container from 'components/Container/Container';
import LinkLaunchApp from 'components/Link/LinkLaunchApp';
import { DAPP_URL, DOC_URL, WHITEPAPERS_URL } from 'constants/production';
import NavigationLinks from '../NavigationLinks/NavigationLinks';
import s from './MenuMobile.module.css';

const content = [
  {
    href: WHITEPAPERS_URL,
    text: 'Whitepapers',
  },
  {
    href: DOC_URL,
    text: 'Docs',
  },
  {
    href: DAPP_URL,
    text: 'Markets',
  },
];

interface IMenuMobileProps {
  className?: string;
}

const MenuMobile: React.FC<IMenuMobileProps> = ({ className }) => (
  <Container className={className}>
    <NavigationLinks
      content={content}
      classNames={{ root: s.headerNavLinksWrapper, link: s.headerLink }}
    />

    <LinkLaunchApp variant="secondary" className={s.btn} />
  </Container>
);

export default MenuMobile;
