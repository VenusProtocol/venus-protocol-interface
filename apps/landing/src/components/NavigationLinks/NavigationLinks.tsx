import cn from 'classnames';
import Link from '../Link/Link';
import s from './NavigationLinks.module.css';

interface INavigationLinksProps {
  content: Array<{
    href: string;
    text: string;
  }>;
  classNames?: { root?: string; link?: string };
}

const NavigationLinks: React.FC<INavigationLinksProps> = ({ classNames, content }) => (
  <div className={cn(s.root, classNames?.root)}>
    {content.map(({ href, text }) => (
      <Link className={classNames?.link} key={text} variant="link" href={href}>
        {text}
      </Link>
    ))}
  </div>
);

export default NavigationLinks;
