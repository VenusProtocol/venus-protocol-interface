import { DAPP_URL } from 'constants/landing';
import { type ILinkProps, Link } from '.';

export type ILinkLaunchAppProps = Omit<ILinkProps, 'href' | 'children'>;

export const LinkLaunchApp: React.FC<ILinkLaunchAppProps> = props => {
  return (
    <Link {...props} href={DAPP_URL}>
      Launch app
    </Link>
  );
};
