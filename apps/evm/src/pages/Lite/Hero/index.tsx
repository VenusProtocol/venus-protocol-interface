import { useTranslation } from 'libs/translations';

export const Hero: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="lite-enter flex flex-col items-center text-center">
      <h1 className="lite-hero-title text-h7 font-medium leading-[1.2] tracking-[-0.6px] text-balance md:text-h3">
        {t('lite.title')}
      </h1>

      <p className="lite-enter lite-enter--subtitle mt-1 text-b1r text-light-grey text-balance">
        {t('lite.description')}
      </p>
    </div>
  );
};
