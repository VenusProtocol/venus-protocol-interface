import { cn } from 'components';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';

interface ISafetyProps {
  className?: string;
}

export const OtherAuditors: React.FC<ISafetyProps> = () => {
  const { Trans } = useTranslation();
  return (
    <Link
      className={cn(
        'h-auto rounded-2xl border-dashed border-lightGrey text-center p-4 sm:col-span-2 md:col-span-1 border flex items-center',
      )}
      href="https://docs-v4.venus.io/links/security-and-audits"
    >
      <Trans
        i18nKey="landing.safety.otherAuditors"
        components={{
          br: <br />,
        }}
      />
    </Link>
  );
};
