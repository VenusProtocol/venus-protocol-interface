import { getWalletConnectConnector } from '@rainbow-me/rainbowkit';
import { createEmitter } from '@wagmi/core/internal';
import { arbitrum, base, bsc, mainnet, zkSync } from 'viem/chains';
import { describe, expect, it, vi } from 'vitest';

import { OATH_WALLET_ID, oathWallet } from '..';

vi.mock('@rainbow-me/rainbowkit', async importOriginal => ({
  ...(await importOriginal<typeof import('@rainbow-me/rainbowkit')>()),
  getWalletConnectConnector: vi.fn(),
}));

const projectId = 'test-project';
const uri = 'wc:test-topic@2?relay-protocol=irn&symKey=test-only';

describe('Oath Wallet', () => {
  it('uses the native RainbowKit QR route and iOS download metadata', () => {
    const wallet = oathWallet({ projectId });
    expect(wallet.id).toBe(OATH_WALLET_ID);
    expect(wallet.name).toBe('Oath Wallet');
    expect(wallet.qrCode?.getUri(uri)).toBe(uri);
    expect(wallet.qrCode?.instructions?.steps.map(({ step }) => step)).toEqual([
      'install',
      'scan',
      'connect',
    ]);
    expect(wallet.downloadUrls?.ios).toBe('https://apps.apple.com/app/id6780187283');
    expect(wallet.downloadUrls?.android).toBeUndefined();
    expect(wallet.extension).toBeUndefined();
  });

  it('encodes the complete pairing URI exactly once for the iOS handoff', () => {
    const link = new URL(oathWallet({ projectId }).mobile?.getUri?.(uri) ?? '');
    expect(link.protocol).toBe('oathwallet:');
    expect(link.hostname).toBe('wc');
    expect(link.searchParams.get('uri')).toBe(uri);
    expect([...link.searchParams.keys()]).toEqual(['uri']);
  });

  it.each([
    ['Mozilla/5.0 (iPhone; CPU iPhone OS 18_2 like Mac OS X)', false],
    ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', false],
    ['Mozilla/5.0 (Linux; Android 14)', true],
  ])('sets visibility for %s', (userAgent, hidden) => {
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(userAgent);
    expect(oathWallet({ projectId }).hidden?.()).toBe(hidden);
  });

  it('isolates Oath storage while retaining native network negotiation and SDK methods', () => {
    const connect = vi.fn();
    const switchChain = vi.fn();
    const disconnect = vi.fn();
    const createConnector = vi
      .fn()
      .mockReturnValue({ connect, switchChain, disconnect, type: 'walletConnect' });
    const withDetails = vi.fn().mockReturnValue(createConnector);
    vi.mocked(getWalletConnectConnector).mockReturnValue(withDetails);
    const metadata = {
      name: 'Venus',
      description: 'Venus Protocol',
      url: 'https://app.venus.io',
      icons: [],
    };
    const wallet = oathWallet({ projectId, walletConnectParameters: { metadata } });
    const details = {
      rkDetails: {
        ...wallet,
        index: 0,
        groupIndex: 0,
        groupName: 'Recommended',
        isRainbowKitConnector: true,
      },
    };
    const config = {
      chains: [bsc, mainnet, arbitrum, base, zkSync] as const,
      emitter: createEmitter('oath-test'),
    };
    const connector = wallet.createConnector(details)(config);
    expect(getWalletConnectConnector).toHaveBeenCalledWith({
      projectId,
      walletConnectParameters: { customStoragePrefix: 'venus-oath-wallet', metadata },
    });
    expect(withDetails).toHaveBeenCalledWith(details);
    // WalletConnect proposes Venus's optional networks; Oath approves its supported subset.
    expect(createConnector).toHaveBeenCalledWith(config);
    expect(connector.id).toBe(OATH_WALLET_ID);
    expect(connector.name).toBe('Oath Wallet');
    expect(connector.switchChain).toBe(switchChain);
    expect(connector.disconnect).toBe(disconnect);
    expect(connector.connect).toBe(connect);
  });
});
