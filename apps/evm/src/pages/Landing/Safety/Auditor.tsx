import { cn } from 'components';
import { useTranslation } from 'libs/translations';
import Arrow from './assets/arrow.svg?react';

interface ISafetyProps {
  className?: string;
  auditor: {
    audits: number;
    Logo: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    LogoHovered: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    href: string;
  };
}

export const Auditor: React.FC<ISafetyProps> = ({
  auditor: { href, Logo, LogoHovered, audits },
}) => {
  const { t } = useTranslation();
  return (
    <a
      className={cn(
        'relative flex flex-col items-center bg-[#1E2431] no-underline hover:no-underline overflow-hidden p-4 rounded-2xl cursor-pointer',
      )}
      href={href}
    >
      <div className="flex flex-1 justify-center items-center">
        <div className="relative w-full max-w-35.5 flex">
          <Logo className="w-full transition-opacity duration-250 ease-linear" />
          <LogoHovered className="opacity-0 hover:opacity-100 absolute inset-0 w-full transition-opacity duration-250 ease-linear" />
        </div>
      </div>
      <hr className="w-full border-0 h-px bg-[#2D3549] my-4 mx-0" />
      <div className="flex justify-between items-center w-full">
        <p className="m-0 text-[0.8rem] leading-5.25 md:text-[0.875rem] flex items-end flex-1 text-grey no-underline">
          <span className="font-semibold text-white me-2">{audits}</span>{' '}
          {t('landing.safety.audit', { count: audits })}
        </p>
        <Arrow className="shrink-0 text-[#A9ABC7] hover:text-[#3A78FF] transition-colors duration-250 ease-linear" />
      </div>
    </a>
  );
};
