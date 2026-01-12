import { cn } from 'components';
import { Link } from 'containers/Link';

interface ISafetyProps {
  className?: string;
}

const OtherAuditors: React.FC<ISafetyProps> = () => (
  <Link
    className={cn(
      'h-auto rounded-2xl border-dashed border-lightGrey text-center p-4 sm:col-span-2 md:col-span-1',
    )}
    href="https://docs-v4.venus.io/links/security-and-audits"
  >
    +14 audits with <br />
    Fairyproof, Hacken and HashEx
  </Link>
);

export default OtherAuditors;
