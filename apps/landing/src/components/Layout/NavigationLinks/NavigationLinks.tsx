import { cn } from '@venusprotocol/ui';
import Link from 'components/Link/Link';
import s from './NavigationLinks.module.css';

interface INavigationLinksProps {
  content: Array<{
    href: string;
    text: string;
  }>;
  showLegalPages?: boolean;
  classNames?: { root?: string; link?: string };
}

const NavigationLinks: React.FC<INavigationLinksProps> = ({ classNames, content }) => (
  <div className={cn(s.root, classNames?.root)}>
    {content.map(({ href, text }) => (
      <Link className={cn('text-white', classNames?.link)} key={text} variant="text" href={href}>
        {text}
      </Link>
    ))}
  </div>
);

export default NavigationLinks;
