import { useDAppUrl } from 'hooks/useDAppUrl';
import Link, { type ILinkProps } from './Link';

export type ILinkLaunchAppProps = Omit<ILinkProps, 'href' | 'children'>;

const LinkLaunchApp: React.FC<ILinkLaunchAppProps> = props => {
  const { dAppUrl } = useDAppUrl();

  return (
    <Link {...props} href={dAppUrl}>
      Launch app
    </Link>
  );
};

export default LinkLaunchApp;
