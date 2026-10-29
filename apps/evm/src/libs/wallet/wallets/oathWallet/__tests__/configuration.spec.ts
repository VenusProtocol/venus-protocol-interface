import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { bsc } from 'viem/chains';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({ network: 'mainnet' }));
vi.mock('config', () => ({
  default: {
    get network() {
      return state.network;
    },
    rpcUrls: { 56: [] },
  },
}));
vi.mock('../../../chains', () => ({ chains: [bsc] }));
vi.mock('@rainbow-me/rainbowkit', async importOriginal => ({
  ...(await importOriginal<typeof import('@rainbow-me/rainbowkit')>()),
  connectorsForWallets: vi.fn().mockReturnValue([]),
}));

describe('Venus wallet configuration', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it.each(['mainnet', 'testnet'])('includes Oath only on mainnet (%s)', async network => {
    state.network = network;
    await import('../../../Web3Wrapper/config');
    const [groups, options] = vi.mocked(connectorsForWallets).mock.calls[0];
    const wallets = groups.flatMap(group =>
      group.wallets.map(factory =>
        factory({ projectId: options.projectId, appName: options.appName }),
      ),
    );
    const ids = wallets.map(wallet => wallet.id);
    expect(ids.includes('oath-wallet')).toBe(network === 'mainnet');
    expect(ids).toContain('walletConnect');
    expect(ids).toContain('metaMask');
    expect(new Set(ids).size).toBe(ids.length);
  });
});
