import { Delimiter, cn } from 'components';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';
import { DarkBlueCard } from '../DarkBlueCard';
import Arrow from '../assets/arrow.svg?react';

export interface AuditorProps {
  className?: string;
  auditsCount: number;
  href: string;
  Logo: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  LogoHovered: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}

export const Auditor: React.FC<AuditorProps> = ({ href, Logo, LogoHovered, auditsCount }) => {
  const { t } = useTranslation();

  return (
    <DarkBlueCard asChild className={cn('relative group flex flex-col items-center')}>
      <Link href={href} noStyle>
        <div className="flex justify-center items-center h-16 shrink-0 mb-2">
          <div className="relative w-full max-w-35.5 flex">
            <Logo className="w-full transition-opacity duration-250 ease-linear" />

            <LogoHovered className="opacity-0 group-hover:opacity-100 absolute inset-0 w-full transition-opacity duration-250 ease-linear" />
          </div>
        </div>

        <Delimiter className="shrink-0 w-full mb-4" />

        <div className="flex justify-between items-center w-full">
          <p className="flex items-end gap-x-2">
            <span className="text-b1s">{auditsCount}</span>

            <span className="text-light-grey text-b1r">
              {t('landing.safety.audit', { count: auditsCount })}
            </span>
          </p>

          <Arrow className="shrink-0 text-white size-3 group-hover:text-blue transition-colors" />
        </div>
      </Link>
    </DarkBlueCard>
  );
};
