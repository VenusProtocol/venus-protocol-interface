import { APP_MAIN_PRODUCTION_URL, DOC_URL, WHITEPAPERS_URL } from '../../constants/production';
import Container from '../Container/Container';
import Link from '../Link';
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
    href: APP_MAIN_PRODUCTION_URL,
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

    <Link className={s.btn} href={APP_MAIN_PRODUCTION_URL}>
      Launch app
    </Link>
  </Container>
);

export default MenuMobile;
