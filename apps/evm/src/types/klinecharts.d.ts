declare module 'klinecharts' {
  export interface KLineData {
    open: number;
    close: number;
    high: number;
    low: number;
    timestamp: number;
  }

  export interface Period {
    span: number;
    type: 'millisecond' | 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';
  }

  export interface DataLoaderGetBarsResult {
    backward: boolean;
    forward: boolean;
  }

  export interface Symbol {
    ticker: string;
    pricePrecision?: number;
    volumePrecision?: number;
  }

  export interface DataLoaderGetBarsParams {
    callback: (dataList: KLineData[], more?: DataLoaderGetBarsResult) => void;
    timestamp?: number;
    type: 'init' | 'forward' | 'backward' | 'update';
    symbol: Symbol;
    period: Period;
  }

  export interface DataLoaderSubscribeBarParams {
    callback: (data: KLineData) => void;
    symbol: Symbol;
    period: Period;
  }

  export interface DataLoaderUnsubscribeBarParams {
    symbol: Symbol;
    period: Period;
  }

  export interface DataLoader {
    getBars: (params: DataLoaderGetBarsParams) => void | Promise<void>;
    subscribeBar?: (params: DataLoaderSubscribeBarParams) => void;
    unsubscribeBar?: (params: DataLoaderUnsubscribeBarParams) => void;
  }

  export interface KLineChartInstance {
    setStyles: (styles: unknown) => void;
    resize: () => void;
    setSymbol: (symbol: Symbol) => void;
    setPeriod: (period: Period) => void;
    setDataLoader: (dataLoader: DataLoader) => void;
  }

  export const init: (container: HTMLElement) => KLineChartInstance | null;
  export const dispose: (chart: KLineChartInstance) => void;
}
