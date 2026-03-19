import { useEffect, useRef } from 'react';

import config from 'config';
import { useChainId } from 'libs/wallet';
import { ChainId } from 'types';
import { DexKlineWsClient, buildKlineChannel } from './DexKlineWsClient';
import type { DexKlineCandle, DexKlineCandleInterval } from './types';

const PLATFORM_ID_BY_CHAIN_ID = new Map<ChainId, number>([
  [ChainId.ETHEREUM, 1],
  [ChainId.SEPOLIA, 1],
  [ChainId.BSC_MAINNET, 14],
  [ChainId.BSC_TESTNET, 14],
  [ChainId.BASE_MAINNET, 199],
  [ChainId.BASE_SEPOLIA, 199],
]);

let sharedClient: DexKlineWsClient | null = null;

const getSharedClient = (): DexKlineWsClient | null => {
  if (!config.dexWsUrl) return null;
  if (!sharedClient) sharedClient = new DexKlineWsClient(config.dexWsUrl);
  return sharedClient;
};

export interface UseDexKlineWebSocketInput {
  address: string;
  interval: DexKlineCandleInterval;
  onCandle: (candle: DexKlineCandle) => void;
  enabled?: boolean;
}

export const useDexKlineWebSocket = ({
  address,
  interval,
  onCandle,
  enabled = true,
}: UseDexKlineWebSocketInput): void => {
  const { chainId } = useChainId();
  const onCandleRef = useRef(onCandle);
  onCandleRef.current = onCandle;

  useEffect(() => {
    const platformId = PLATFORM_ID_BY_CHAIN_ID.get(chainId);
    const client = getSharedClient();

    if (!client || !platformId || !enabled || !address) return;

    const channel = buildKlineChannel(platformId, address, interval);
    const callback = (candle: DexKlineCandle) => onCandleRef.current(candle);

    client.subscribe(channel, callback);
    return () => client.unsubscribe(channel, callback);
  }, [chainId, address, interval, enabled]);
};
