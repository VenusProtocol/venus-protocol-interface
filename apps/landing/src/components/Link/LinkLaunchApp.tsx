import Link from './Link';

interface ILinkLaunchAppProps {
  className?: string;
  variant?: 'button' | 'buttonTransparent' | 'link';
}

const LinkLaunchApp: React.FC<ILinkLaunchAppProps> = ({ className, variant }) => (
  <Link variant={variant} className={className} href="https://app.venus.io">
    Launch app
  </Link>
);

export default LinkLaunchApp;
