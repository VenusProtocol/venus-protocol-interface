import { Button } from '@venusprotocol/ui';
import { signerToEcdsaValidator } from '@zerodev/ecdsa-validator';
import { createKernelAccount, createKernelAccountClient } from '@zerodev/sdk';
import { KERNEL_V3_1, getEntryPoint } from '@zerodev/sdk/constants';
import { vBep20Abi } from 'libs/contracts';
import { useAccountAddress, usePublicClient } from 'libs/wallet';
import { http, encodeFunctionData, erc20Abi } from 'viem';
import { sepolia } from 'viem/chains';
import { useWalletClient } from 'wagmi';

// TODO: get from env variables
const ZERODEV_RPC =
  'https://rpc.zerodev.app/api/v3/61016d2a-e0df-4350-929c-d5f2110700d1/chain/84532';
const entryPoint = getEntryPoint('0.7');
const kernelVersion = KERNEL_V3_1;

const chain = sepolia; // TODO: get current chain

// Transaction details
const vTokenAddress = '0xF87bceab8DD37489015B426bA931e08A4D787616';
const tokenAddress = '0x772d68929655ce7234C8C94256526ddA66Ef641E';
const amount = 1n;

export const MigrateButton: React.FC = () => {
  const { accountAddress } = useAccountAddress();
  const { data: walletClient } = useWalletClient({ account: accountAddress });
  const { publicClient } = usePublicClient();

  const handleMigrate = async () => {
    if (!walletClient) {
      return;
    }

    // Construct a validator
    const ecdsaValidator = await signerToEcdsaValidator(publicClient, {
      signer: walletClient,
      entryPoint,
      kernelVersion,
    });

    // Associate wallet with smart account (if it doesn't exist)
    const account = await createKernelAccount(publicClient, {
      plugins: {
        sudo: ecdsaValidator,
      },
      entryPoint,
      kernelVersion,
    });

    // Create client
    const kernelClient = createKernelAccountClient({
      account,
      chain,
      bundlerTransport: http(ZERODEV_RPC),
      client: publicClient,
    });

    const accountAddress = kernelClient.account.address;
    console.log('Smart account address', accountAddress);

    // Send transaction
    const hash = await kernelClient.sendTransaction({
      callData: await kernelClient.account.encodeCalls([
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
      ]),
    });

    console.log('hash', hash);

    // Track transaction
    // await kernelClient.waitForUserOperationReceipt({
    //   hash,
    //   timeout: 1000 * 15,
    // });
  };

  if (!walletClient) {
    return undefined;
  }

  return <Button onClick={handleMigrate}>Migrate</Button>;
};
