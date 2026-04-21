import { cn } from '@venusprotocol/ui';
import { CHART_PERIOD } from 'constants/klineCandles';
import { type DataLoader, dispose, init } from 'klinecharts';
import { PRICE_DECIMALS } from 'pages/YieldPlus/constants';
import { useEffect, useRef } from 'react';
import { rgb } from './rgb';

export interface KLineChartProps {
  title: string;
  dataLoader: DataLoader;
  className?: string;
}

export const KLineChart: React.FC<KLineChartProps> = ({ className, dataLoader, title }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<ReturnType<typeof init> | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const chart = init(containerRef.current);

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

    resizeObserver.observe(containerRef.current);

    return () => {
      chartRef.current = null;
      resizeObserver?.disconnect();
      dispose(chart);
    };
  }, []);

  useEffect(() => {
    chartRef.current?.setSymbol({ ticker: title, pricePrecision: PRICE_DECIMALS });
  }, [title]);

  useEffect(() => {
    chartRef.current?.setPeriod(CHART_PERIOD);
  }, []);

  useEffect(() => {
    chartRef.current?.setDataLoader(dataLoader);
  }, [dataLoader]);

  return <div ref={containerRef} className={cn('w-full h-full bg-dark-blue', className)} />;
};
