import type { Chart } from 'klinecharts';

import { rgb } from '../rgb';

export const applyChartStyles = (chart: Chart) => {
  const gridColor = rgb('--theme-border-default');
  const axisColor = rgb('--theme-bg-hover-subtle');
  const mutedColor = rgb('--theme-bg-neutral-bold');
  const textColor = rgb('--theme-fg-primary');
  const upColor = rgb('--theme-chart-up');
  const downColor = rgb('--theme-chart-down');

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
