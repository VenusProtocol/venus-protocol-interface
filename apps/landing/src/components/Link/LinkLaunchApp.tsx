import Link, { type ILinkProps } from './Link';

export type ILinkLaunchAppProps = Omit<ILinkProps, 'href' | 'children'>;

const LinkLaunchApp: React.FC<ILinkLaunchAppProps> = props => (
  <Link {...props} href="https://app.venus.io">
    Launch app
  </Link>
);

export default LinkLaunchApp;
