import { cn } from '@venusprotocol/ui';
import { type DataLoader, dispose, init } from 'klinecharts';
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
  const showDisclaimerModal = () => setShouldShowDisclaimerModal(true);
  const hideDisclaimerModal = () => setShouldShowDisclaimerModal(false);

  const fullScreenContainerRef = useRef<HTMLDivElement | null>(null);
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<ReturnType<typeof init> | null>(null);

  const intervalOptions = Object.values(ApiOhlcInterval).map<SelectOption<ApiOhlcInterval>>(
    intervalOption => ({
      label: ({ isRenderedInButton }) => (
        <span className={cn(isRenderedInButton && 'text-light-grey')}>{intervalOption}</span>
      ),
      value: intervalOption,
    }),
  );

  const isFullScreenAvailable = document?.fullscreenEnabled || false;

  const toggleFullScreenMode = () => {
    if (document?.fullscreenElement) {
      document.exitFullscreen();
    } else {
      fullScreenContainerRef.current?.requestFullscreen();
    }
  };

  useEffect(() => {
    if (!chartContainerRef.current) {
      return undefined;
    }

    const chart = init(chartContainerRef.current);

    if (!chart) {
      return undefined;
    }

    chartRef.current = chart;

    const darkBlueHover = rgb('--color-dark-blue-hover-rgb');
    const darkBlueActive = rgb('--color-dark-blue-active-rgb');
    const grey = rgb('--color-grey-rgb');
    const white = rgb('--color-white-rgb');
    const green = rgb('--color-green-rgb');
    const red = rgb('--color-red-rgb');

    chart.setStyles({
      grid: {
        horizontal: { color: darkBlueHover, dashedValue: [3, 3] },
        vertical: { color: darkBlueHover, dashedValue: [3, 3] },
      },
      candle: {
        bar: {
          upColor: green,
          downColor: red,
          upBorderColor: green,
          downBorderColor: red,
          upWickColor: green,
          downWickColor: red,
          noChangeColor: grey,
          noChangeBorderColor: grey,
          noChangeWickColor: grey,
        },
        tooltip: {
          rect: {
            color: darkBlueHover,
            borderColor: darkBlueActive,
          },
          title: { color: white },
          legend: {
            color: grey,
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
        axisLine: { color: darkBlueActive },
        tickLine: { color: darkBlueActive },
        tickText: { color: grey },
      },
      yAxis: {
        axisLine: { color: darkBlueActive },
        tickLine: { color: darkBlueActive },
        tickText: { color: grey },
      },
      crosshair: {
        horizontal: {
          line: { color: grey },
          text: {
            color: white,
            borderColor: darkBlueActive,
            backgroundColor: darkBlueHover,
          },
        },
        vertical: {
          line: { color: grey },
          text: {
            color: white,
            borderColor: darkBlueActive,
            backgroundColor: darkBlueHover,
          },
        },
      },
      separator: {
        color: darkBlueActive,
        activeBackgroundColor: darkBlueHover,
      },
    });

    const resizeObserver = new ResizeObserver(() => {
      chart.resize();
    });

    resizeObserver.observe(chartContainerRef.current);

    return () => {
      chartRef.current = null;
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
      <div className="bg-dark-blue w-full h-full flex flex-col" ref={fullScreenContainerRef}>
        <div className="flex items-center justify-between px-3 py-1">
          <div className="flex items-center gap-x-3">
            <Select
              options={intervalOptions}
              value={interval}
              onChange={newInterval => onIntervalChange(newInterval as ApiOhlcInterval)}
              size="small"
              buttonClassName="py-0 px-2 h-7 bg-dark-blue-active"
            />

            <Delimiter vertical className="h-4.5 self-center" />

            <button
              type="button"
              onClick={showDisclaimerModal}
              className="cursor-pointer transition-colors text-b1r text-light-grey hover:text-blue"
            >
              {t('kLineChart.disclaimer.buttonLabel')}
            </button>
          </div>

          {isFullScreenAvailable && (
            <button
              type="button"
              onClick={toggleFullScreenMode}
              className="cursor-pointer text-light-grey hover:text-blue"
            >
              <Icon name="fullScreen" className="size-6 transition-colors text-inherit" />
            </button>
          )}
        </div>

        <div className={cn('grow', className)} ref={chartContainerRef} />
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
