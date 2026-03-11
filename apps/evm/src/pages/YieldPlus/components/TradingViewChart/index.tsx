import { cn } from '@venusprotocol/ui';
import type { Chart } from 'klinecharts';
import { dispose, init } from 'klinecharts';
import { useEffect, useRef } from 'react';

import type { OhlcvCandle } from 'clients/api/queries/yieldPlus/types';

export interface TradingViewChartProps {
  candles: OhlcvCandle[];
  symbol?: string;
  className?: string;
}

export const TradingViewChart: React.FC<TradingViewChartProps> = ({
  candles,
  symbol,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const candlesRef = useRef<OhlcvCandle[]>(candles);
  candlesRef.current = candles;

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = init(containerRef.current, {
      styles: {
        grid: {
          show: true,
          horizontal: { show: true, size: 1, color: 'rgba(255,255,255,0.06)', style: 'dashed' },
          vertical: { show: false },
        },
        candle: {
          type: 'candle_solid',
          bar: {
            upColor: '#2DC24E',
            downColor: '#E93D66',
            noChangeColor: '#888E9E',
            upBorderColor: '#2DC24E',
            downBorderColor: '#E93D66',
            noChangeBorderColor: '#888E9E',
            upWickColor: '#2DC24E',
            downWickColor: '#E93D66',
            noChangeWickColor: '#888E9E',
          },
          priceMark: {
            show: true,
            high: { show: true, color: '#888E9E', textSize: 10 },
            low: { show: true, color: '#888E9E', textSize: 10 },
            last: {
              show: true,
              upColor: '#2DC24E',
              downColor: '#E93D66',
              noChangeColor: '#888E9E',
              line: { show: true, style: 'dashed', dashedValue: [4, 4], size: 1 },
            },
          },
          tooltip: {
            showRule: 'always',
            showType: 'standard',
            title: {
              show: true,
              template: '{ticker} · {period}',
              color: '#FFF',
              size: 13,
              weight: 600,
              marginLeft: 8,
              marginTop: 6,
              marginRight: 0,
              marginBottom: 2,
            },
            legend: {
              color: '#888E9E',
              size: 12,
              weight: 400,
              marginLeft: 8,
              marginTop: 2,
              marginRight: 6,
              marginBottom: 0,
            },
          },
        },
        xAxis: {
          axisLine: { show: false },
          tickLine: { show: false },
          tickText: { show: true, color: '#888E9E', size: 11 },
        },
        yAxis: {
          axisLine: { show: false },
          tickLine: { show: false },
          tickText: { show: true, color: '#888E9E', size: 11 },
        },
        crosshair: {
          show: true,
          horizontal: {
            show: true,
            line: { show: true, style: 'dashed', dashedValue: [4, 2], size: 1, color: '#555' },
            text: { show: true, size: 11, color: '#FFF', backgroundColor: '#2B3139' },
          },
          vertical: {
            show: true,
            line: { show: true, style: 'dashed', dashedValue: [4, 2], size: 1, color: '#555' },
            text: { show: true, size: 11, color: '#FFF', backgroundColor: '#2B3139' },
          },
        },
        separator: { size: 0, color: 'transparent' },
      },
    });

    if (chart) {
      chartRef.current = chart;

      chart.setDataLoader({
        getBars: ({ callback }) => {
          const data = candlesRef.current.map(c => ({
            timestamp: c.time * 1000,
            open: c.open,
            high: c.high,
            low: c.low,
            close: c.close,
            volume: c.volume,
          }));
          callback(data, { forward: false, backward: false });
        },
      });

      chart.setSymbol({
        ticker: symbol || '',
        pricePrecision: 2,
        volumePrecision: 0,
      });
      chart.setPeriod({ type: 'day', span: 1 });
    }

    return () => {
      if (containerRef.current) {
        dispose(containerRef.current);
      }
      chartRef.current = null;
    };
  }, [symbol]);

  useEffect(() => {
    if (!chartRef.current || candles.length === 0) return;
    chartRef.current.resetData();
  }, [candles]);

  return (
    <div className={cn('w-full rounded-xl overflow-hidden bg-dark-blue px-2 pt-1', className)}>
      <div ref={containerRef} className="w-full" style={{ height: 400 }} />
    </div>
  );
};
