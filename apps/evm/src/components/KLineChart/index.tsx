import { cn } from '@venusprotocol/ui';
import { type Chart, type DataLoader, dispose, init } from 'klinecharts';
import { useEffect, useRef, useState } from 'react';

import { Delimiter } from 'components/Delimiter';
import { Icon } from 'components/Icon';
import { Modal } from 'components/Modal';
import { Select, type SelectOption } from 'components/Select';
import { useTranslation } from 'libs/translations';
import { ApiOhlcInterval } from 'types';
import { convertIntervalToChartPeriod } from './convertIntervalToChartPeriod';
import { rgb } from './rgb';

export interface KLineChartProps {
  title: string;
  interval: ApiOhlcInterval;
  onIntervalChange: (newIntervaL: ApiOhlcInterval) => void;
  dataLoader: DataLoader;
  pricePrecision: number;
  className?: string;
}

const applyChartStyles = (chart: Chart) => {
  const gridColor = rgb('--theme-border-default');
  const axisColor = rgb('--theme-bg-hover-subtle');
  const mutedColor = rgb('--theme-bg-neutral-bold');
  const textColor = rgb('--theme-fg-primary');
  const upColor = rgb('--theme-bg-success');
  const downColor = rgb('--theme-bg-danger');

  chart.setStyles({
    grid: {
      horizontal: { color: gridColor, dashedValue: [3, 3] },
      vertical: { color: gridColor, dashedValue: [3, 3] },
    },
    candle: {
      bar: {
        upColor,
        downColor,
        upBorderColor: upColor,
        downBorderColor: downColor,
        upWickColor: upColor,
        downWickColor: downColor,
        noChangeColor: mutedColor,
        noChangeBorderColor: mutedColor,
        noChangeWickColor: mutedColor,
      },
      tooltip: {
        rect: {
          color: gridColor,
          borderColor: axisColor,
        },
        title: { color: textColor },
        legend: {
          color: mutedColor,
          template: [
            { title: 'time', value: '{time}' },
            { title: 'open', value: '{open}' },
            { title: 'high', value: '{high}' },
            { title: 'low', value: '{low}' },
            { title: 'close', value: '{close}' },
          ],
        },
      },
    },
    xAxis: {
      axisLine: { color: axisColor },
      tickLine: { color: axisColor },
      tickText: { color: mutedColor },
    },
    yAxis: {
      axisLine: { color: axisColor },
      tickLine: { color: axisColor },
      tickText: { color: mutedColor },
    },
    crosshair: {
      horizontal: {
        line: { color: mutedColor },
        text: {
          color: textColor,
          borderColor: axisColor,
          backgroundColor: gridColor,
        },
      },
      vertical: {
        line: { color: mutedColor },
        text: {
          color: textColor,
          borderColor: axisColor,
          backgroundColor: gridColor,
        },
      },
    },
    separator: {
      color: axisColor,
      activeBackgroundColor: gridColor,
    },
  });
};

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
