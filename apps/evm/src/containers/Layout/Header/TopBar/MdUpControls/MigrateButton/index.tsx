import { createMeeClient, toMultichainNexusAccount } from '@biconomy/abstractjs';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@venusprotocol/ui';
import config from 'config';
import { NULL_ADDRESS } from 'constants/address';
import { vBep20Abi } from 'libs/contracts';
import { useAccountAddress } from 'libs/wallet';
import { http, encodeFunctionData, erc20Abi } from 'viem';
import { sepolia } from 'viem/chains';
import { useWalletClient } from 'wagmi';

const vTokenAddress = '0xF87bceab8DD37489015B426bA931e08A4D787616';
const tokenAddress = '0x772d68929655ce7234C8C94256526ddA66Ef641E';
const chain = sepolia; // TODO: get current chain

const transport = http(config.rpcUrls[chain.id][0]);

export const MigrateButton: React.FC = () => {
  const { accountAddress } = useAccountAddress();
  const { data: walletClient } = useWalletClient({ account: accountAddress });

  const { data: client, error } = useQuery({
    queryKey: [
      'bundlerClient',
      {
        accountAddress,
      },
    ],
    queryFn: async () => {
      const acc = await toMultichainNexusAccount({
        chains: [chain],
        transports: [transport],
        signer: walletClient!,
      });

      const cli = createMeeClient({
        account: acc,
      });

      return cli;
    },
    enabled: !!walletClient,
  });

  if (error) {
    console.log(error);
  }

  const handleMigrate = async () => {
    if (!client) {
      return;
    }

    const amount = 1n;

    const fusionQuote = await client.getFusionQuote({
      trigger: {
        // Pay gas using ETH
        chainId: chain.id,
        tokenAddress: '0x0000000000000000000000000000000000000000',
        amount,
      },
      feeToken: {
        address: '0x0000000000000000000000000000000000000000',
        chainId: chain.id,
      },
      instructions: [
        {
          calls: [
            // Approve token spending by Core pool
            {
              to: tokenAddress,
              data: encodeFunctionData({
                abi: erc20Abi,
                functionName: 'approve',
                args: [vTokenAddress, amount],
              }),
            },
            // Supply tokens to Core pool
            {
              to: vTokenAddress,
              data: encodeFunctionData({
                abi: vBep20Abi,
                functionName: 'mint',
                args: [amount],
              }),
            },
          ],
          chainId: chain.id,
        },
      ],
    });

    const { hash } = await client.executeFusionQuote({
      fusionQuote,
    });

    console.log(hash);
  };

  if (!client) {
    return undefined;
  }

  return <Button onClick={handleMigrate}>Migrate</Button>;
};
