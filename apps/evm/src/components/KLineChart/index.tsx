import { cn } from '@venusprotocol/ui';
import { type DataLoader, dispose, init } from 'klinecharts';
import { useEffect, useRef, useState } from 'react';

import { Delimiter } from 'components/Delimiter';
import { Icon } from 'components/Icon';
import { Modal } from 'components/Modal';
import { Select, type SelectOption } from 'components/Select';
import { useTranslation } from 'libs/translations';
import { ApiOhlcInterval } from 'types';
import { applyChartStyles } from './applyChartStyles';
import { convertIntervalToChartPeriod } from './convertIntervalToChartPeriod';

export interface KLineChartProps {
  title: string;
  interval: ApiOhlcInterval;
  onIntervalChange: (newIntervaL: ApiOhlcInterval) => void;
  dataLoader: DataLoader;
  pricePrecision: number;
  className?: string;
}

export const KLineChart: React.FC<KLineChartProps> = ({
  className,
  dataLoader,
  interval,
  onIntervalChange,
  pricePrecision,
  title,
}) => {
  const { t } = useTranslation();

  const [shouldShowDisclaimerModal, setShouldShowDisclaimerModal] = useState(false);
  const [isFullScreenMode, setIsFullScreenMode] = useState(false);
  const showDisclaimerModal = () => setShouldShowDisclaimerModal(true);
  const hideDisclaimerModal = () => setShouldShowDisclaimerModal(false);

  const fullScreenContainerRef = useRef<HTMLDivElement | null>(null);
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<ReturnType<typeof init> | null>(null);

  const intervalOptions = Object.values(ApiOhlcInterval).map<SelectOption<ApiOhlcInterval>>(
    intervalOption => ({
      label: ({ isRenderedInButton }) => (
        <span className={cn(isRenderedInButton && 'text-secondary')}>{intervalOption}</span>
      ),
      value: intervalOption,
    }),
  );

  const isFullScreenAvailable =
    typeof document !== 'undefined' ? document.fullscreenEnabled : false;

  const toggleFullScreenMode = () => {
    if (document?.fullscreenElement) {
      document.exitFullscreen();
    } else {
      fullScreenContainerRef.current?.requestFullscreen();
    }
  };

  useEffect(() => {
    if (typeof document === 'undefined') {
      return undefined;
    }

    const handleFullscreenChange = () => {
      setIsFullScreenMode(document.fullscreenElement === fullScreenContainerRef.current);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    handleFullscreenChange();

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (!chartContainerRef.current) {
      return undefined;
    }

    const chart = init(chartContainerRef.current);

    if (!chart) {
      return undefined;
    }

    chartRef.current = chart;
    applyChartStyles(chart);

    const themeObserver = new MutationObserver(() => applyChartStyles(chart));
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    const resizeObserver = new ResizeObserver(() => {
      chart.resize();
    });

    resizeObserver.observe(chartContainerRef.current);

    return () => {
      chartRef.current = null;
      themeObserver.disconnect();
      resizeObserver?.disconnect();
      dispose(chart);
    };
  }, []);

  useEffect(() => {
    chartRef.current?.setSymbol({ ticker: title, pricePrecision });
  }, [title, pricePrecision]);

  useEffect(() => {
    const period = convertIntervalToChartPeriod(interval);
    chartRef.current?.setPeriod(period);
  }, [interval]);

  useEffect(() => {
    chartRef.current?.setDataLoader(dataLoader);
  }, [dataLoader]);

  return (
    <>
      <div
        className="bg-surface-3 w-full h-full min-h-0 flex flex-col"
        ref={fullScreenContainerRef}
      >
        <div className="relative z-10 flex items-center justify-between px-3 py-1">
          <div className="flex items-center gap-x-3">
            <Select
              options={intervalOptions}
              value={interval}
              onChange={newInterval => onIntervalChange(newInterval as ApiOhlcInterval)}
              size="small"
              buttonClassName="py-0 px-2 h-7 bg-surface-4"
              modalPortalContainer={isFullScreenMode ? fullScreenContainerRef.current : undefined}
            />

            <Delimiter vertical className="h-4.5 self-center" />

            <button
              type="button"
              onClick={showDisclaimerModal}
              className="cursor-pointer transition-colors text-b1r text-secondary hover:text-brand"
            >
              {t('kLineChart.disclaimer.buttonLabel')}
            </button>
          </div>

          {isFullScreenAvailable && (
            <button
              type="button"
              onClick={toggleFullScreenMode}
              className="cursor-pointer text-secondary hover:text-brand"
            >
              <Icon name="fullScreen" className="size-6 transition-colors text-inherit" />
            </button>
          )}
        </div>

        <div
          className={cn('relative z-0 grow min-h-0 min-w-0', className)}
          ref={chartContainerRef}
        />
      </div>

      <Modal
        isOpen={shouldShowDisclaimerModal}
        handleClose={hideDisclaimerModal}
        title={t('kLineChart.disclaimer.title')}
      >
        <p>{t('kLineChart.disclaimer.description')}</p>
      </Modal>
    </>
  );
};
