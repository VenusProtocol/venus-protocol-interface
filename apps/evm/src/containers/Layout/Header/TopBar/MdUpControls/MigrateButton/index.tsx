import {
  createMeeClient,
  greaterThanOrEqualTo,
  runtimeERC20BalanceOf,
  toMultichainNexusAccount,
} from '@biconomy/abstractjs';
import { Button } from '@venusprotocol/ui';
import config from 'config';
import { aaveV3PoolAbi, vBep20Abi } from 'libs/contracts';
import { useAccountAddress } from 'libs/wallet';
import { http } from 'viem';
import { bsc } from 'viem/chains';
import { useWalletClient } from 'wagmi';

const vTokenAddress = '0xfD5840Cd36d94D7229439859C0112a4185BC0255';
const tokenAddress = '0x55d398326f99059fF775485246999027B3197955';

const aTokenAddress = '0xa9251ca9DE909CB71783723713B21E4233fbf1B1';
const aaveV3PoolProxyAddress = '0x6807dc923806fE8Fd134338EABCA509979a7e0cB';

const chain = bsc; // TODO: get current chain

const transport = http(config.rpcUrls[chain.id][0]);

export const MigrateButton: React.FC = () => {
  const { accountAddress } = useAccountAddress();
  const { data: walletClient } = useWalletClient({ account: accountAddress });

  const handleMigrate = async () => {
    const mcNexus = await toMultichainNexusAccount({
      chains: [chain],
      transports: [transport],
      signer: walletClient!,
    });

    const meeClient = await createMeeClient({
      account: mcNexus,
      apiKey: import.meta.env.VITE_BICONOMY_API_KEY, // TODO: remove and keep in backend
    });

    const aTokenAmount = 300000000000000000n; // 0.3 aUSDT
    const underlyingTokenAmount = 100000000000000000n; // 0.1 USDT

    const instructions = await Promise.all([
      // Withdraw Aave position and transfer tokens to companion account
      mcNexus.buildComposable({
        type: 'default',
        data: {
          to: aaveV3PoolProxyAddress,
          abi: aaveV3PoolAbi,
          functionName: 'withdraw',
          args: [tokenAddress, underlyingTokenAmount, mcNexus.addressOn(chain.id)!],
          chainId: chain.id,
          gasLimit: 100000n,
        },
      }),
      // Give approval to Venus pool to spend tokens
      mcNexus.buildComposable({
        type: 'approve',
        data: {
          tokenAddress,
          spender: vTokenAddress,
          amount: runtimeERC20BalanceOf({
            targetAddress: mcNexus.addressOn(chain.id)!,
            tokenAddress,
            constraints: [greaterThanOrEqualTo(100n)],
          }),
          chainId: chain.id,
          gasLimit: 100000n,
        },
      }),
      // Mint tokens from Venus pool with companion account
      mcNexus.buildComposable({
        type: 'default',
        data: {
          to: vTokenAddress,
          abi: vBep20Abi,
          functionName: 'mint',
          args: [
            runtimeERC20BalanceOf({
              targetAddress: mcNexus.addressOn(chain.id)!,
              tokenAddress,
              constraints: [greaterThanOrEqualTo(100n)],
            }),
          ],
          chainId: chain.id,
          gasLimit: 100000n,
        },
      }),
      // Transfer vTokens to EOA
      mcNexus.buildComposable({
        type: 'transfer',
        data: {
          recipient: accountAddress!,
          tokenAddress: vTokenAddress,
          amount: runtimeERC20BalanceOf({
            targetAddress: mcNexus.addressOn(chain.id)!,
            tokenAddress: vTokenAddress,
            constraints: [greaterThanOrEqualTo(100n)],
          }),
          chainId: chain.id,
          gasLimit: 100000n,
        },
      }),
      // Transfer any leftover aTokens to EOA
      mcNexus.buildComposable({
        type: 'transfer',
        data: {
          recipient: accountAddress!,
          tokenAddress: aTokenAddress,
          amount: runtimeERC20BalanceOf({
            targetAddress: mcNexus.addressOn(chain.id)!,
            tokenAddress: aTokenAddress,
            constraints: [greaterThanOrEqualTo(100n)],
          }),
          chainId: chain.id,
          gasLimit: 100000n,
        },
      }),
    ]);

    const fusionQuote = await meeClient.getFusionQuote({
      trigger: {
        // Indicate amount of aTokens that will be transferred from the EOA to the companion account
        chainId: chain.id,
        tokenAddress: aTokenAddress,
        amount: aTokenAmount,
        gasLimit: 300000n,
      },
      instructions,
      sponsorship: true,
    });

    console.log('quote', fusionQuote);

    const { hash } = await meeClient.executeFusionQuote({
      fusionQuote,
    });

    console.log('hash', hash);

    const receipt = await meeClient.waitForSupertransactionReceipt({ hash });

    console.log('receipt', receipt);
  };

  return <Button onClick={handleMigrate}>Migrate</Button>;
};
