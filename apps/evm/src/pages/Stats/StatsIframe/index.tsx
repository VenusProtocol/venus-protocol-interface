import { useTranslation } from 'libs/translations';

const STATS_IFRAME_URL =
  'https://app.hex.tech/10609151-106a-4740-8982-17a9a4e59699/app/Venus-032RSn52D8LeH6K6o73Edt/latest?embedded=true';

export const StatsIframe: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="relative">
      <div
        className="overflow-hidden border-t border-dark-blue-hover"
        style={{ height: 'calc(100vh - 200px)' }}
      >
        <iframe
          src={STATS_IFRAME_URL}
          title={t('statsPage.title')}
          sandbox="allow-scripts allow-same-origin"
          referrerPolicy="no-referrer"
          className="w-full border-0 -mt-[120px] md:-mt-[90px]"
          style={{ height: 'calc(100vh - 120px)' }}
        />
      </div>

      <div className="absolute bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 rounded-full border border-dark-blue-hover bg-background px-5 py-3">
        <span className="text-b2s text-white">
          {t('statsPage.poweredBy', { provider: 'allez.xyz' })}
        </span>
      </div>
    </div>
  );
};
