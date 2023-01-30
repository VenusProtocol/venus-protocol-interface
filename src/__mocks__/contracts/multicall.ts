import { ContractCallResults } from 'ethereum-multicall';

const pancakeSwapRouter: {
  [key: string]: ContractCallResults;
} = {
  getReserves: {
    results: {
      '0x58C6Fc654b3deE6839b65136f61cB9120d96BCc6': {
        originalContractCallContext: {
          reference: '0x58C6Fc654b3deE6839b65136f61cB9120d96BCc6',
          contractAddress: '0x58C6Fc654b3deE6839b65136f61cB9120d96BCc6',
          abi: [
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: 'address',
                  name: 'owner',
                  type: 'address',
                },
                {
                  indexed: true,
                  internalType: 'address',
                  name: 'spender',
                  type: 'address',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'value',
                  type: 'uint256',
                },
              ],
              name: 'Approval',
              type: 'event',
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: 'address',
                  name: 'sender',
                  type: 'address',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'amount0',
                  type: 'uint256',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'amount1',
                  type: 'uint256',
                },
                {
                  indexed: true,
                  internalType: 'address',
                  name: 'to',
                  type: 'address',
                },
              ],
              name: 'Burn',
              type: 'event',
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: 'address',
                  name: 'sender',
                  type: 'address',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'amount0',
                  type: 'uint256',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'amount1',
                  type: 'uint256',
                },
              ],
              name: 'Mint',
              type: 'event',
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: 'address',
                  name: 'sender',
                  type: 'address',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'amount0In',
                  type: 'uint256',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'amount1In',
                  type: 'uint256',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'amount0Out',
                  type: 'uint256',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'amount1Out',
                  type: 'uint256',
                },
                {
                  indexed: true,
                  internalType: 'address',
                  name: 'to',
                  type: 'address',
                },
              ],
              name: 'Swap',
              type: 'event',
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: 'uint112',
                  name: 'reserve0',
                  type: 'uint112',
                },
                {
                  indexed: false,
                  internalType: 'uint112',
                  name: 'reserve1',
                  type: 'uint112',
                },
              ],
              name: 'Sync',
              type: 'event',
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: 'address',
                  name: 'from',
                  type: 'address',
                },
                {
                  indexed: true,
                  internalType: 'address',
                  name: 'to',
                  type: 'address',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'value',
                  type: 'uint256',
                },
              ],
              name: 'Transfer',
              type: 'event',
            },
            {
              inputs: [],
              name: 'DOMAIN_SEPARATOR',
              outputs: [
                {
                  internalType: 'bytes32',
                  name: '',
                  type: 'bytes32',
                },
              ],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [],
              name: 'MINIMUM_LIQUIDITY',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              stateMutability: 'pure',
              type: 'function',
            },
            {
              inputs: [],
              name: 'PERMIT_TYPEHASH',
              outputs: [
                {
                  internalType: 'bytes32',
                  name: '',
                  type: 'bytes32',
                },
              ],
              stateMutability: 'pure',
              type: 'function',
            },
            {
              inputs: [
                {
                  internalType: 'address',
                  name: 'owner',
                  type: 'address',
                },
                {
                  internalType: 'address',
                  name: 'spender',
                  type: 'address',
                },
              ],
              name: 'allowance',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [
                {
                  internalType: 'address',
                  name: 'spender',
                  type: 'address',
                },
                {
                  internalType: 'uint256',
                  name: 'value',
                  type: 'uint256',
                },
              ],
              name: 'approve',
              outputs: [
                {
                  internalType: 'bool',
                  name: '',
                  type: 'bool',
                },
              ],
              stateMutability: 'nonpayable',
              type: 'function',
            },
            {
              inputs: [
                {
                  internalType: 'address',
                  name: 'owner',
                  type: 'address',
                },
              ],
              name: 'balanceOf',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [
                {
                  internalType: 'address',
                  name: 'to',
                  type: 'address',
                },
              ],
              name: 'burn',
              outputs: [
                {
                  internalType: 'uint256',
                  name: 'amount0',
                  type: 'uint256',
                },
                {
                  internalType: 'uint256',
                  name: 'amount1',
                  type: 'uint256',
                },
              ],
              stateMutability: 'nonpayable',
              type: 'function',
            },
            {
              inputs: [],
              name: 'decimals',
              outputs: [
                {
                  internalType: 'uint8',
                  name: '',
                  type: 'uint8',
                },
              ],
              stateMutability: 'pure',
              type: 'function',
            },
            {
              inputs: [],
              name: 'factory',
              outputs: [
                {
                  internalType: 'address',
                  name: '',
                  type: 'address',
                },
              ],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [],
              name: 'getReserves',
              outputs: [
                {
                  internalType: 'uint112',
                  name: 'reserve0',
                  type: 'uint112',
                },
                {
                  internalType: 'uint112',
                  name: 'reserve1',
                  type: 'uint112',
                },
                {
                  internalType: 'uint32',
                  name: 'blockTimestampLast',
                  type: 'uint32',
                },
              ],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [
                {
                  internalType: 'address',
                  name: '',
                  type: 'address',
                },
                {
                  internalType: 'address',
                  name: '',
                  type: 'address',
                },
              ],
              name: 'initialize',
              outputs: [],
              stateMutability: 'nonpayable',
              type: 'function',
            },
            {
              inputs: [],
              name: 'kLast',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [
                {
                  internalType: 'address',
                  name: 'to',
                  type: 'address',
                },
              ],
              name: 'mint',
              outputs: [
                {
                  internalType: 'uint256',
                  name: 'liquidity',
                  type: 'uint256',
                },
              ],
              stateMutability: 'nonpayable',
              type: 'function',
            },
            {
              inputs: [],
              name: 'name',
              outputs: [
                {
                  internalType: 'string',
                  name: '',
                  type: 'string',
                },
              ],
              stateMutability: 'pure',
              type: 'function',
            },
            {
              inputs: [
                {
                  internalType: 'address',
                  name: 'owner',
                  type: 'address',
                },
              ],
              name: 'nonces',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [
                {
                  internalType: 'address',
                  name: 'owner',
                  type: 'address',
                },
                {
                  internalType: 'address',
                  name: 'spender',
                  type: 'address',
                },
                {
                  internalType: 'uint256',
                  name: 'value',
                  type: 'uint256',
                },
                {
                  internalType: 'uint256',
                  name: 'deadline',
                  type: 'uint256',
                },
                {
                  internalType: 'uint8',
                  name: 'v',
                  type: 'uint8',
                },
                {
                  internalType: 'bytes32',
                  name: 'r',
                  type: 'bytes32',
                },
                {
                  internalType: 'bytes32',
                  name: 's',
                  type: 'bytes32',
                },
              ],
              name: 'permit',
              outputs: [],
              stateMutability: 'nonpayable',
              type: 'function',
            },
            {
              inputs: [],
              name: 'price0CumulativeLast',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [],
              name: 'price1CumulativeLast',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [
                {
                  internalType: 'address',
                  name: 'to',
                  type: 'address',
                },
              ],
              name: 'skim',
              outputs: [],
              stateMutability: 'nonpayable',
              type: 'function',
            },
            {
              inputs: [
                {
                  internalType: 'uint256',
                  name: 'amount0Out',
                  type: 'uint256',
                },
                {
                  internalType: 'uint256',
                  name: 'amount1Out',
                  type: 'uint256',
                },
                {
                  internalType: 'address',
                  name: 'to',
                  type: 'address',
                },
                {
                  internalType: 'bytes',
                  name: 'data',
                  type: 'bytes',
                },
              ],
              name: 'swap',
              outputs: [],
              stateMutability: 'nonpayable',
              type: 'function',
            },
            {
              inputs: [],
              name: 'symbol',
              outputs: [
                {
                  internalType: 'string',
                  name: '',
                  type: 'string',
                },
              ],
              stateMutability: 'pure',
              type: 'function',
            },
            {
              inputs: [],
              name: 'sync',
              outputs: [],
              stateMutability: 'nonpayable',
              type: 'function',
            },
            {
              inputs: [],
              name: 'token0',
              outputs: [
                {
                  internalType: 'address',
                  name: '',
                  type: 'address',
                },
              ],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [],
              name: 'token1',
              outputs: [
                {
                  internalType: 'address',
                  name: '',
                  type: 'address',
                },
              ],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [],
              name: 'totalSupply',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [
                {
                  internalType: 'address',
                  name: 'to',
                  type: 'address',
                },
                {
                  internalType: 'uint256',
                  name: 'value',
                  type: 'uint256',
                },
              ],
              name: 'transfer',
              outputs: [
                {
                  internalType: 'bool',
                  name: '',
                  type: 'bool',
                },
              ],
              stateMutability: 'nonpayable',
              type: 'function',
            },
            {
              inputs: [
                {
                  internalType: 'address',
                  name: 'from',
                  type: 'address',
                },
                {
                  internalType: 'address',
                  name: 'to',
                  type: 'address',
                },
                {
                  internalType: 'uint256',
                  name: 'value',
                  type: 'uint256',
                },
              ],
              name: 'transferFrom',
              outputs: [
                {
                  internalType: 'bool',
                  name: '',
                  type: 'bool',
                },
              ],
              stateMutability: 'nonpayable',
              type: 'function',
            },
          ],
          calls: [
            {
              reference: 'getReserves',
              methodName: 'getReserves()',
              methodParameters: [],
            },
          ],
        },
        callsReturnContext: [
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x02fa1da65f37f4',
              },
              {
                type: 'BigNumber',
                hex: '0xf7eea6d423c2',
              },
              1667816951,
            ],
            decoded: true,
            reference: 'getReserves',
            methodName: 'getReserves()',
            methodParameters: [],
            success: true,
          },
        ],
      },
      '0xa96818CA65B57bEc2155Ba5c81a70151f63300CD': {
        originalContractCallContext: {
          reference: '0xa96818CA65B57bEc2155Ba5c81a70151f63300CD',
          contractAddress: '0xa96818CA65B57bEc2155Ba5c81a70151f63300CD',
          abi: [
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: 'address',
                  name: 'owner',
                  type: 'address',
                },
                {
                  indexed: true,
                  internalType: 'address',
                  name: 'spender',
                  type: 'address',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'value',
                  type: 'uint256',
                },
              ],
              name: 'Approval',
              type: 'event',
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: 'address',
                  name: 'sender',
                  type: 'address',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'amount0',
                  type: 'uint256',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'amount1',
                  type: 'uint256',
                },
                {
                  indexed: true,
                  internalType: 'address',
                  name: 'to',
                  type: 'address',
                },
              ],
              name: 'Burn',
              type: 'event',
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: 'address',
                  name: 'sender',
                  type: 'address',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'amount0',
                  type: 'uint256',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'amount1',
                  type: 'uint256',
                },
              ],
              name: 'Mint',
              type: 'event',
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: 'address',
                  name: 'sender',
                  type: 'address',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'amount0In',
                  type: 'uint256',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'amount1In',
                  type: 'uint256',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'amount0Out',
                  type: 'uint256',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'amount1Out',
                  type: 'uint256',
                },
                {
                  indexed: true,
                  internalType: 'address',
                  name: 'to',
                  type: 'address',
                },
              ],
              name: 'Swap',
              type: 'event',
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: 'uint112',
                  name: 'reserve0',
                  type: 'uint112',
                },
                {
                  indexed: false,
                  internalType: 'uint112',
                  name: 'reserve1',
                  type: 'uint112',
                },
              ],
              name: 'Sync',
              type: 'event',
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: 'address',
                  name: 'from',
                  type: 'address',
                },
                {
                  indexed: true,
                  internalType: 'address',
                  name: 'to',
                  type: 'address',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'value',
                  type: 'uint256',
                },
              ],
              name: 'Transfer',
              type: 'event',
            },
            {
              inputs: [],
              name: 'DOMAIN_SEPARATOR',
              outputs: [
                {
                  internalType: 'bytes32',
                  name: '',
                  type: 'bytes32',
                },
              ],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [],
              name: 'MINIMUM_LIQUIDITY',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              stateMutability: 'pure',
              type: 'function',
            },
            {
              inputs: [],
              name: 'PERMIT_TYPEHASH',
              outputs: [
                {
                  internalType: 'bytes32',
                  name: '',
                  type: 'bytes32',
                },
              ],
              stateMutability: 'pure',
              type: 'function',
            },
            {
              inputs: [
                {
                  internalType: 'address',
                  name: 'owner',
                  type: 'address',
                },
                {
                  internalType: 'address',
                  name: 'spender',
                  type: 'address',
                },
              ],
              name: 'allowance',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [
                {
                  internalType: 'address',
                  name: 'spender',
                  type: 'address',
                },
                {
                  internalType: 'uint256',
                  name: 'value',
                  type: 'uint256',
                },
              ],
              name: 'approve',
              outputs: [
                {
                  internalType: 'bool',
                  name: '',
                  type: 'bool',
                },
              ],
              stateMutability: 'nonpayable',
              type: 'function',
            },
            {
              inputs: [
                {
                  internalType: 'address',
                  name: 'owner',
                  type: 'address',
                },
              ],
              name: 'balanceOf',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [
                {
                  internalType: 'address',
                  name: 'to',
                  type: 'address',
                },
              ],
              name: 'burn',
              outputs: [
                {
                  internalType: 'uint256',
                  name: 'amount0',
                  type: 'uint256',
                },
                {
                  internalType: 'uint256',
                  name: 'amount1',
                  type: 'uint256',
                },
              ],
              stateMutability: 'nonpayable',
              type: 'function',
            },
            {
              inputs: [],
              name: 'decimals',
              outputs: [
                {
                  internalType: 'uint8',
                  name: '',
                  type: 'uint8',
                },
              ],
              stateMutability: 'pure',
              type: 'function',
            },
            {
              inputs: [],
              name: 'factory',
              outputs: [
                {
                  internalType: 'address',
                  name: '',
                  type: 'address',
                },
              ],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [],
              name: 'getReserves',
              outputs: [
                {
                  internalType: 'uint112',
                  name: 'reserve0',
                  type: 'uint112',
                },
                {
                  internalType: 'uint112',
                  name: 'reserve1',
                  type: 'uint112',
                },
                {
                  internalType: 'uint32',
                  name: 'blockTimestampLast',
                  type: 'uint32',
                },
              ],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [
                {
                  internalType: 'address',
                  name: '',
                  type: 'address',
                },
                {
                  internalType: 'address',
                  name: '',
                  type: 'address',
                },
              ],
              name: 'initialize',
              outputs: [],
              stateMutability: 'nonpayable',
              type: 'function',
            },
            {
              inputs: [],
              name: 'kLast',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [
                {
                  internalType: 'address',
                  name: 'to',
                  type: 'address',
                },
              ],
              name: 'mint',
              outputs: [
                {
                  internalType: 'uint256',
                  name: 'liquidity',
                  type: 'uint256',
                },
              ],
              stateMutability: 'nonpayable',
              type: 'function',
            },
            {
              inputs: [],
              name: 'name',
              outputs: [
                {
                  internalType: 'string',
                  name: '',
                  type: 'string',
                },
              ],
              stateMutability: 'pure',
              type: 'function',
            },
            {
              inputs: [
                {
                  internalType: 'address',
                  name: 'owner',
                  type: 'address',
                },
              ],
              name: 'nonces',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [
                {
                  internalType: 'address',
                  name: 'owner',
                  type: 'address',
                },
                {
                  internalType: 'address',
                  name: 'spender',
                  type: 'address',
                },
                {
                  internalType: 'uint256',
                  name: 'value',
                  type: 'uint256',
                },
                {
                  internalType: 'uint256',
                  name: 'deadline',
                  type: 'uint256',
                },
                {
                  internalType: 'uint8',
                  name: 'v',
                  type: 'uint8',
                },
                {
                  internalType: 'bytes32',
                  name: 'r',
                  type: 'bytes32',
                },
                {
                  internalType: 'bytes32',
                  name: 's',
                  type: 'bytes32',
                },
              ],
              name: 'permit',
              outputs: [],
              stateMutability: 'nonpayable',
              type: 'function',
            },
            {
              inputs: [],
              name: 'price0CumulativeLast',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [],
              name: 'price1CumulativeLast',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [
                {
                  internalType: 'address',
                  name: 'to',
                  type: 'address',
                },
              ],
              name: 'skim',
              outputs: [],
              stateMutability: 'nonpayable',
              type: 'function',
            },
            {
              inputs: [
                {
                  internalType: 'uint256',
                  name: 'amount0Out',
                  type: 'uint256',
                },
                {
                  internalType: 'uint256',
                  name: 'amount1Out',
                  type: 'uint256',
                },
                {
                  internalType: 'address',
                  name: 'to',
                  type: 'address',
                },
                {
                  internalType: 'bytes',
                  name: 'data',
                  type: 'bytes',
                },
              ],
              name: 'swap',
              outputs: [],
              stateMutability: 'nonpayable',
              type: 'function',
            },
            {
              inputs: [],
              name: 'symbol',
              outputs: [
                {
                  internalType: 'string',
                  name: '',
                  type: 'string',
                },
              ],
              stateMutability: 'pure',
              type: 'function',
            },
            {
              inputs: [],
              name: 'sync',
              outputs: [],
              stateMutability: 'nonpayable',
              type: 'function',
            },
            {
              inputs: [],
              name: 'token0',
              outputs: [
                {
                  internalType: 'address',
                  name: '',
                  type: 'address',
                },
              ],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [],
              name: 'token1',
              outputs: [
                {
                  internalType: 'address',
                  name: '',
                  type: 'address',
                },
              ],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [],
              name: 'totalSupply',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [
                {
                  internalType: 'address',
                  name: 'to',
                  type: 'address',
                },
                {
                  internalType: 'uint256',
                  name: 'value',
                  type: 'uint256',
                },
              ],
              name: 'transfer',
              outputs: [
                {
                  internalType: 'bool',
                  name: '',
                  type: 'bool',
                },
              ],
              stateMutability: 'nonpayable',
              type: 'function',
            },
            {
              inputs: [
                {
                  internalType: 'address',
                  name: 'from',
                  type: 'address',
                },
                {
                  internalType: 'address',
                  name: 'to',
                  type: 'address',
                },
                {
                  internalType: 'uint256',
                  name: 'value',
                  type: 'uint256',
                },
              ],
              name: 'transferFrom',
              outputs: [
                {
                  internalType: 'bool',
                  name: '',
                  type: 'bool',
                },
              ],
              stateMutability: 'nonpayable',
              type: 'function',
            },
          ],
          calls: [
            {
              reference: 'getReserves',
              methodName: 'getReserves()',
              methodParameters: [],
            },
          ],
        },
        callsReturnContext: [
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0591ead4f637550903',
              },
              {
                type: 'BigNumber',
                hex: '0x179765af8d0005501a1bd5d6c7ef',
              },
              1667818304,
            ],
            decoded: true,
            reference: 'getReserves',
            methodName: 'getReserves()',
            methodParameters: [],
            success: true,
          },
        ],
      },
      '0x209eBd953FA5e3fE1375f7Dd0a848A9621e9eaFc': {
        originalContractCallContext: {
          reference: '0x209eBd953FA5e3fE1375f7Dd0a848A9621e9eaFc',
          contractAddress: '0x209eBd953FA5e3fE1375f7Dd0a848A9621e9eaFc',
          abi: [
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: 'address',
                  name: 'owner',
                  type: 'address',
                },
                {
                  indexed: true,
                  internalType: 'address',
                  name: 'spender',
                  type: 'address',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'value',
                  type: 'uint256',
                },
              ],
              name: 'Approval',
              type: 'event',
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: 'address',
                  name: 'sender',
                  type: 'address',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'amount0',
                  type: 'uint256',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'amount1',
                  type: 'uint256',
                },
                {
                  indexed: true,
                  internalType: 'address',
                  name: 'to',
                  type: 'address',
                },
              ],
              name: 'Burn',
              type: 'event',
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: 'address',
                  name: 'sender',
                  type: 'address',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'amount0',
                  type: 'uint256',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'amount1',
                  type: 'uint256',
                },
              ],
              name: 'Mint',
              type: 'event',
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: 'address',
                  name: 'sender',
                  type: 'address',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'amount0In',
                  type: 'uint256',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'amount1In',
                  type: 'uint256',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'amount0Out',
                  type: 'uint256',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'amount1Out',
                  type: 'uint256',
                },
                {
                  indexed: true,
                  internalType: 'address',
                  name: 'to',
                  type: 'address',
                },
              ],
              name: 'Swap',
              type: 'event',
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: 'uint112',
                  name: 'reserve0',
                  type: 'uint112',
                },
                {
                  indexed: false,
                  internalType: 'uint112',
                  name: 'reserve1',
                  type: 'uint112',
                },
              ],
              name: 'Sync',
              type: 'event',
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: 'address',
                  name: 'from',
                  type: 'address',
                },
                {
                  indexed: true,
                  internalType: 'address',
                  name: 'to',
                  type: 'address',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'value',
                  type: 'uint256',
                },
              ],
              name: 'Transfer',
              type: 'event',
            },
            {
              inputs: [],
              name: 'DOMAIN_SEPARATOR',
              outputs: [
                {
                  internalType: 'bytes32',
                  name: '',
                  type: 'bytes32',
                },
              ],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [],
              name: 'MINIMUM_LIQUIDITY',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              stateMutability: 'pure',
              type: 'function',
            },
            {
              inputs: [],
              name: 'PERMIT_TYPEHASH',
              outputs: [
                {
                  internalType: 'bytes32',
                  name: '',
                  type: 'bytes32',
                },
              ],
              stateMutability: 'pure',
              type: 'function',
            },
            {
              inputs: [
                {
                  internalType: 'address',
                  name: 'owner',
                  type: 'address',
                },
                {
                  internalType: 'address',
                  name: 'spender',
                  type: 'address',
                },
              ],
              name: 'allowance',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [
                {
                  internalType: 'address',
                  name: 'spender',
                  type: 'address',
                },
                {
                  internalType: 'uint256',
                  name: 'value',
                  type: 'uint256',
                },
              ],
              name: 'approve',
              outputs: [
                {
                  internalType: 'bool',
                  name: '',
                  type: 'bool',
                },
              ],
              stateMutability: 'nonpayable',
              type: 'function',
            },
            {
              inputs: [
                {
                  internalType: 'address',
                  name: 'owner',
                  type: 'address',
                },
              ],
              name: 'balanceOf',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [
                {
                  internalType: 'address',
                  name: 'to',
                  type: 'address',
                },
              ],
              name: 'burn',
              outputs: [
                {
                  internalType: 'uint256',
                  name: 'amount0',
                  type: 'uint256',
                },
                {
                  internalType: 'uint256',
                  name: 'amount1',
                  type: 'uint256',
                },
              ],
              stateMutability: 'nonpayable',
              type: 'function',
            },
            {
              inputs: [],
              name: 'decimals',
              outputs: [
                {
                  internalType: 'uint8',
                  name: '',
                  type: 'uint8',
                },
              ],
              stateMutability: 'pure',
              type: 'function',
            },
            {
              inputs: [],
              name: 'factory',
              outputs: [
                {
                  internalType: 'address',
                  name: '',
                  type: 'address',
                },
              ],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [],
              name: 'getReserves',
              outputs: [
                {
                  internalType: 'uint112',
                  name: 'reserve0',
                  type: 'uint112',
                },
                {
                  internalType: 'uint112',
                  name: 'reserve1',
                  type: 'uint112',
                },
                {
                  internalType: 'uint32',
                  name: 'blockTimestampLast',
                  type: 'uint32',
                },
              ],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [
                {
                  internalType: 'address',
                  name: '',
                  type: 'address',
                },
                {
                  internalType: 'address',
                  name: '',
                  type: 'address',
                },
              ],
              name: 'initialize',
              outputs: [],
              stateMutability: 'nonpayable',
              type: 'function',
            },
            {
              inputs: [],
              name: 'kLast',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [
                {
                  internalType: 'address',
                  name: 'to',
                  type: 'address',
                },
              ],
              name: 'mint',
              outputs: [
                {
                  internalType: 'uint256',
                  name: 'liquidity',
                  type: 'uint256',
                },
              ],
              stateMutability: 'nonpayable',
              type: 'function',
            },
            {
              inputs: [],
              name: 'name',
              outputs: [
                {
                  internalType: 'string',
                  name: '',
                  type: 'string',
                },
              ],
              stateMutability: 'pure',
              type: 'function',
            },
            {
              inputs: [
                {
                  internalType: 'address',
                  name: 'owner',
                  type: 'address',
                },
              ],
              name: 'nonces',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [
                {
                  internalType: 'address',
                  name: 'owner',
                  type: 'address',
                },
                {
                  internalType: 'address',
                  name: 'spender',
                  type: 'address',
                },
                {
                  internalType: 'uint256',
                  name: 'value',
                  type: 'uint256',
                },
                {
                  internalType: 'uint256',
                  name: 'deadline',
                  type: 'uint256',
                },
                {
                  internalType: 'uint8',
                  name: 'v',
                  type: 'uint8',
                },
                {
                  internalType: 'bytes32',
                  name: 'r',
                  type: 'bytes32',
                },
                {
                  internalType: 'bytes32',
                  name: 's',
                  type: 'bytes32',
                },
              ],
              name: 'permit',
              outputs: [],
              stateMutability: 'nonpayable',
              type: 'function',
            },
            {
              inputs: [],
              name: 'price0CumulativeLast',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [],
              name: 'price1CumulativeLast',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [
                {
                  internalType: 'address',
                  name: 'to',
                  type: 'address',
                },
              ],
              name: 'skim',
              outputs: [],
              stateMutability: 'nonpayable',
              type: 'function',
            },
            {
              inputs: [
                {
                  internalType: 'uint256',
                  name: 'amount0Out',
                  type: 'uint256',
                },
                {
                  internalType: 'uint256',
                  name: 'amount1Out',
                  type: 'uint256',
                },
                {
                  internalType: 'address',
                  name: 'to',
                  type: 'address',
                },
                {
                  internalType: 'bytes',
                  name: 'data',
                  type: 'bytes',
                },
              ],
              name: 'swap',
              outputs: [],
              stateMutability: 'nonpayable',
              type: 'function',
            },
            {
              inputs: [],
              name: 'symbol',
              outputs: [
                {
                  internalType: 'string',
                  name: '',
                  type: 'string',
                },
              ],
              stateMutability: 'pure',
              type: 'function',
            },
            {
              inputs: [],
              name: 'sync',
              outputs: [],
              stateMutability: 'nonpayable',
              type: 'function',
            },
            {
              inputs: [],
              name: 'token0',
              outputs: [
                {
                  internalType: 'address',
                  name: '',
                  type: 'address',
                },
              ],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [],
              name: 'token1',
              outputs: [
                {
                  internalType: 'address',
                  name: '',
                  type: 'address',
                },
              ],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [],
              name: 'totalSupply',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [
                {
                  internalType: 'address',
                  name: 'to',
                  type: 'address',
                },
                {
                  internalType: 'uint256',
                  name: 'value',
                  type: 'uint256',
                },
              ],
              name: 'transfer',
              outputs: [
                {
                  internalType: 'bool',
                  name: '',
                  type: 'bool',
                },
              ],
              stateMutability: 'nonpayable',
              type: 'function',
            },
            {
              inputs: [
                {
                  internalType: 'address',
                  name: 'from',
                  type: 'address',
                },
                {
                  internalType: 'address',
                  name: 'to',
                  type: 'address',
                },
                {
                  internalType: 'uint256',
                  name: 'value',
                  type: 'uint256',
                },
              ],
              name: 'transferFrom',
              outputs: [
                {
                  internalType: 'bool',
                  name: '',
                  type: 'bool',
                },
              ],
              stateMutability: 'nonpayable',
              type: 'function',
            },
          ],
          calls: [
            {
              reference: 'getReserves',
              methodName: 'getReserves()',
              methodParameters: [],
            },
          ],
        },
        callsReturnContext: [
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x06243b4e36b7e817',
              },
              {
                type: 'BigNumber',
                hex: '0xcf61f251df1765c383508ae091',
              },
              1667817053,
            ],
            decoded: true,
            reference: 'getReserves',
            methodName: 'getReserves()',
            methodParameters: [],
            success: true,
          },
        ],
      },
    },
    blockNumber: 24382358,
  },
};

const interestRateModel: {
  [key: string]: ContractCallResults;
} = {
  getVTokenBalances: {
    results: {
      getVTokenRates: {
        originalContractCallContext: {
          reference: 'getVTokenRates',
          contractAddress: '0xa166Ca91a570747708a318A771F0C9AB84DD984b',
          abi: [
            {
              inputs: [
                {
                  internalType: 'uint256',
                  name: 'baseRatePerYear',
                  type: 'uint256',
                },
                {
                  internalType: 'uint256',
                  name: 'multiplierPerYear',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'constructor',
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'baseRatePerBlock',
                  type: 'uint256',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'multiplierPerBlock',
                  type: 'uint256',
                },
              ],
              name: 'NewInterestParams',
              type: 'event',
            },
            {
              constant: true,
              inputs: [],
              name: 'baseRatePerBlock',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
            },
            {
              constant: true,
              inputs: [],
              name: 'blocksPerYear',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
            },
            {
              constant: true,
              inputs: [
                {
                  internalType: 'uint256',
                  name: 'cash',
                  type: 'uint256',
                },
                {
                  internalType: 'uint256',
                  name: 'borrows',
                  type: 'uint256',
                },
                {
                  internalType: 'uint256',
                  name: 'reserves',
                  type: 'uint256',
                },
              ],
              name: 'getBorrowRate',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
            },
            {
              constant: true,
              inputs: [
                {
                  internalType: 'uint256',
                  name: 'cash',
                  type: 'uint256',
                },
                {
                  internalType: 'uint256',
                  name: 'borrows',
                  type: 'uint256',
                },
                {
                  internalType: 'uint256',
                  name: 'reserves',
                  type: 'uint256',
                },
                {
                  internalType: 'uint256',
                  name: 'reserveFactorMantissa',
                  type: 'uint256',
                },
              ],
              name: 'getSupplyRate',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
            },
            {
              constant: true,
              inputs: [],
              name: 'isInterestRateModel',
              outputs: [
                {
                  internalType: 'bool',
                  name: '',
                  type: 'bool',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
            },
            {
              constant: true,
              inputs: [],
              name: 'multiplierPerBlock',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
            },
            {
              constant: true,
              inputs: [
                {
                  internalType: 'uint256',
                  name: 'cash',
                  type: 'uint256',
                },
                {
                  internalType: 'uint256',
                  name: 'borrows',
                  type: 'uint256',
                },
                {
                  internalType: 'uint256',
                  name: 'reserves',
                  type: 'uint256',
                },
              ],
              name: 'utilizationRate',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'pure',
              type: 'function',
            },
          ],
          calls: [
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['990000', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['990000', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['490000', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['490000', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['323333', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['323333', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['240000', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['240000', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['190000', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['190000', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['156667', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['156667', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['132857', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['132857', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['115000', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['115000', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['101111', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['101111', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['90000', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['90000', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['80909', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['80909', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['73333', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['73333', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['66923', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['66923', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['61429', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['61429', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['56667', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['56667', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['52500', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['52500', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['48824', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['48824', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['45556', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['45556', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['42632', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['42632', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['40000', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['40000', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['37619', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['37619', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['35455', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['35455', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['33478', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['33478', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['31667', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['31667', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['30000', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['30000', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['28462', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['28462', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['27037', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['27037', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['25714', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['25714', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['24483', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['24483', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['23333', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['23333', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['22258', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['22258', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['21250', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['21250', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['20303', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['20303', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['19412', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['19412', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['18571', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['18571', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['17778', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['17778', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['17027', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['17027', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['16316', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['16316', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['15641', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['15641', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['15000', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['15000', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['14390', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['14390', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['13810', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['13810', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['13256', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['13256', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['12727', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['12727', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['12222', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['12222', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['11739', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['11739', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['11277', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['11277', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['10833', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['10833', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['10408', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['10408', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['10000', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['10000', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['9608', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['9608', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['9231', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['9231', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['8868', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['8868', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['8519', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['8519', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['8182', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['8182', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['7857', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['7857', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['7544', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['7544', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['7241', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['7241', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['6949', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['6949', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['6667', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['6667', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['6393', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['6393', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['6129', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['6129', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['5873', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['5873', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['5625', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['5625', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['5385', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['5385', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['5152', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['5152', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['4925', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['4925', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['4706', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['4706', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['4493', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['4493', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['4286', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['4286', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['4085', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['4085', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['3889', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['3889', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['3699', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['3699', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['3514', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['3514', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['3333', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['3333', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['3158', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['3158', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['2987', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['2987', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['2821', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['2821', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['2658', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['2658', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['2500', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['2500', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['2346', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['2346', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['2195', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['2195', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['2048', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['2048', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['1905', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['1905', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['1765', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['1765', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['1628', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['1628', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['1494', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['1494', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['1364', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['1364', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['1236', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['1236', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['1111', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['1111', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['989', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['989', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['870', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['870', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['753', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['753', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['638', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['638', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['526', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['526', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['417', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['417', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['309', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['309', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['204', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['204', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['101', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['101', '10000', '0', '250000000000000000'],
            },
            {
              reference: 'getBorrowRate',
              methodName: 'getBorrowRate',
              methodParameters: ['0', '10000', '0'],
            },
            {
              reference: 'getSupplyRate',
              methodName: 'getSupplyRate',
              methodParameters: ['0', '10000', '0', '250000000000000000'],
            },
          ],
        },
        callsReturnContext: [
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x88156afe',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['990000', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x010547d7',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['990000', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x01102ad5fd',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['490000', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x04151f5e',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['490000', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0198405bbd',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['323333', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x092f87c9',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['323333', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x022055abfb',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['240000', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x10547d7a',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['240000', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x02a86b16fa',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['190000', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1984040f',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['190000', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x03308016f3',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['156667', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x24be10b2',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['156667', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x03b8962b65',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['132857', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x3202c6d5',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['132857', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0440ab57f6',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['115000', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x4151f5ea',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['115000', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x04c8c11339',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['101111', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x52abc613',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['101111', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0550d62df4',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['90000', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x6610103f',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['90000', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x05d8ebfb0d',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['80909', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x7b7f051f',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['80909', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x066102b007',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['73333', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x92f8b65e',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['73333', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x06e916e2e1',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['66923', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0xac7c83fc',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['66923', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x077128eccb',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['61429', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0xc80a63cd',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['61429', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x07f93ea80e',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['56667', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0xe5a38e0e',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['56667', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x088156afed',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['52500', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x010547d7ab',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['52500', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0909675e08',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['48824', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0126f4e52f',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['48824', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x09917c81ae',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['45556', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x014aad9237',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['45556', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0a1991a554',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['42632', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x017070ccca',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['42632', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0aa1ac5be8',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['40000', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x01984040fc',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['40000', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0b29c28230',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['37619', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x01c218fd85',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['37619', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0bb1cf87e0',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['35455', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x01edf94c49',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['35455', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0c39f16ba3',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['33478', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x021beb1d45',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['33478', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0cc1fb5793',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['31667', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x024bdf3cd4',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['31667', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0d4a1772e2',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['30000', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x027de4658a',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['30000', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0dd221ff61',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['28462', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x02b1ed7856',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['28462', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0e5a4339ac',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['27037', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x02e809f6ae',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['27037', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0ee25f819a',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['25714', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x03202f4b8b',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['25714', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0f6a660c72',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['24483', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x035a55effb',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['24483', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0ff28cfd67',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['23333', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0396954637',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['23333', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x107a9a1dcc',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['22258', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x03d4d3b1ba',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['22258', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1102ad5fda',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['21250', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x04151f5eaf',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['21250', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x118ac3f127',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['20303', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0457772e20',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['20303', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1212cebc10',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['19412', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x049bd394bf',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['19412', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x129affeb0f',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['18571', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x04e24e6134',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['18571', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1322f9035c',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['17778', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x052ab648dd',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['17778', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x13ab19c0cf',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['17027', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x05753de779',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['17027', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1433234aa9',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['16316', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x05c1c33329',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['16316', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x14bb44a8a3',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['15641', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x061060a3dc',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['15641', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x154358b7d1',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['15000', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x06610103f1',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['15000', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x15cb7c6b62',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['14390', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x06b3b587fc',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['14390', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1653664a84',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['13810', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0708509aa4',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['13810', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x16db8cfce7',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['13256', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x075f1c29ee',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['13256', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1763c0c8c2',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['12727', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x07b7fb72f1',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['12727', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x17ebd37c1a',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['12222', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0812cfddfd',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['12222', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1873e2d746',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['11739', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x086fac7516',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['11739', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x18fbcf88d2',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['11277', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x08ce7afd77',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['11277', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x19841ed134',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['10833', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x092f99d8aa',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['10833', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1a0c2722ce',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['10408', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x099290d75a',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['10408', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1a942ee5c5',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['10000', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x09f7919629',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['10000', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1b1c361a18',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['9608', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0a5e9c0eae',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['9608', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1ba443fec2',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['9231', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0ac7b5e159',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['9231', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1c2c67c411',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['8868', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0b32eb6e63',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['8868', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1cb453a8ac',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['8519', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0b9ffeb6af',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['8519', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1d3c86d3b0',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['8182', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0c0f561ccd',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['8182', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1dc4bf0335',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['7857', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0c80bd2e2c',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['7857', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1e4cb4effd',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['7544', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0cf3f7331c',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['7544', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1ed506b1d6',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['7241', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0d698abad9',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['7241', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1f5d02286e',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['6949', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0de0de42bc',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['6949', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1fe4db45e2',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['6667', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0e5a1ca950',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['6667', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x206d53dfb0',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['6393', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0ed5f5be66',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['6393', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x20f5343b99',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['6129', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0f534ec6e8',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['6129', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x217d478692',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['5873', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x0fd2e0e9b3',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['5873', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x22055abfb5',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['5625', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x10547d7abc',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['5625', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x228d378eb3',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['5385', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x10d7ef7ce3',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['5385', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x23153c02af',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['5152', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x115d919b6a',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['5152', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x239dd55b5a',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['4925', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x11e5d36a5d',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['4925', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x24259d7821',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['4706', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x126f4e52fc',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['4706', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x24ad9cf99a',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['4493', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x12fb0aced9',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['4493', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x2535aa7c32',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['4286', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1388dfe674',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['4286', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x25bd9a1b47',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['4085', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x14189f7c64',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['4085', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x2645f206b9',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['3889', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x14aad92375',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['3889', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x26cdd6d904',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['3699', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x153ea1513b',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['3699', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x2755d41ff4',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['3514', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x15d48dbec2',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['3514', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x27de87ab09',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['3333', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x166d510ec7',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['3333', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x2866469552',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['3158', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x17070ccca5',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['3158', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x28ee73dd5d',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['2987', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x17a34ffb22',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['2987', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x29761f5892',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['2821', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1841069374',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['2821', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x29fecd8ecd',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['2658', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x18e1f72552',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['2658', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x2a86b16fa2',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['2500', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1984040fc7',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['2500', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x2b0e7d7d03',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['2346', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1a27fd1b0c',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['2346', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x2b96f8d6c4',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['2195', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1aced61ff3',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['2195', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x2c1f1ff46a',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['2048', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1b7753e463',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['2048', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x2ca6cc9509',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['1905', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1c21426a93',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['1905', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x2d2ed27f87',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['1765', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1ccdaa337c',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['1765', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x2db719f9cf',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['1628', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1d7c70a7ba',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['1628', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x2e3f8a0ac1',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['1494', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1e2d78246a',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['1494', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x2ec6faae3f',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['1364', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1edf3bbef5',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['1364', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x2f4f65cba9',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['1236', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x1f945359a4',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['1236', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x2fd7a6f835',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['1111', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x204b3f77f5',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['1111', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x305fa03428',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['989', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x2103d54341',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['989', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x30e7324141',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['870', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x21bde6623e',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['870', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x316f69ea67',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['753', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x227ae52531',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['753', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x31f838fb66',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['638', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x233ac4fa96',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['638', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x328055feb5',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['526', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x23fbb737a5',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['526', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x33079d1b2d',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['417', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x24bd8039ff',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['417', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x339078c86c',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['309', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x25839a3fe9',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['309', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x34184e459d',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['204', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x264a435d69',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['204', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x34a04bd377',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['101', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x2713309f24',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['101', '10000', '0', '250000000000000000'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x35285dcb8b',
              },
            ],
            decoded: true,
            reference: 'getBorrowRate',
            methodName: 'getBorrowRate',
            methodParameters: ['0', '10000', '0'],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x27de4658a8',
              },
            ],
            decoded: true,
            reference: 'getSupplyRate',
            methodName: 'getSupplyRate',
            methodParameters: ['0', '10000', '0', '250000000000000000'],
            success: true,
          },
        ],
      },
    },
    blockNumber: 23050934,
  },
};

const bep20: {
  [key: string]: ContractCallResults;
} = {
  balanceOfTokens: {
    results: {
      '0xFa60D973F7642B748046464e165A65B7323b0DEE': {
        originalContractCallContext: {
          reference: '0xFa60D973F7642B748046464e165A65B7323b0DEE',
          contractAddress: '0xFa60D973F7642B748046464e165A65B7323b0DEE',
          abi: [
            {
              inputs: [],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'constructor',
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: 'address',
                  name: 'owner',
                  type: 'address',
                },
                {
                  indexed: true,
                  internalType: 'address',
                  name: 'spender',
                  type: 'address',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'value',
                  type: 'uint256',
                },
              ],
              name: 'Approval',
              type: 'event',
              signature: '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: 'address',
                  name: 'previousOwner',
                  type: 'address',
                },
                {
                  indexed: true,
                  internalType: 'address',
                  name: 'newOwner',
                  type: 'address',
                },
              ],
              name: 'OwnershipTransferred',
              type: 'event',
              signature: '0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0',
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: 'address',
                  name: 'from',
                  type: 'address',
                },
                {
                  indexed: true,
                  internalType: 'address',
                  name: 'to',
                  type: 'address',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'value',
                  type: 'uint256',
                },
              ],
              name: 'Transfer',
              type: 'event',
              signature: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
            },
            {
              constant: true,
              inputs: [],
              name: '_decimals',
              outputs: [
                {
                  internalType: 'uint8',
                  name: '',
                  type: 'uint8',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x32424aa3',
            },
            {
              constant: true,
              inputs: [],
              name: '_name',
              outputs: [
                {
                  internalType: 'string',
                  name: '',
                  type: 'string',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0xd28d8852',
            },
            {
              constant: true,
              inputs: [],
              name: '_symbol',
              outputs: [
                {
                  internalType: 'string',
                  name: '',
                  type: 'string',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0xb09f1266',
            },
            {
              constant: true,
              inputs: [
                {
                  internalType: 'address',
                  name: 'owner',
                  type: 'address',
                },
                {
                  internalType: 'address',
                  name: 'spender',
                  type: 'address',
                },
              ],
              name: 'allowance',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0xdd62ed3e',
            },
            {
              constant: false,
              inputs: [
                {
                  internalType: 'address',
                  name: 'spender',
                  type: 'address',
                },
                {
                  internalType: 'uint256',
                  name: 'amount',
                  type: 'uint256',
                },
              ],
              name: 'approve',
              outputs: [
                {
                  internalType: 'bool',
                  name: '',
                  type: 'bool',
                },
              ],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
              signature: '0x095ea7b3',
            },
            {
              constant: true,
              inputs: [
                {
                  internalType: 'address',
                  name: 'account',
                  type: 'address',
                },
              ],
              name: 'balanceOf',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x70a08231',
            },
            {
              constant: false,
              inputs: [
                {
                  internalType: 'uint256',
                  name: 'amount',
                  type: 'uint256',
                },
              ],
              name: 'burn',
              outputs: [
                {
                  internalType: 'bool',
                  name: '',
                  type: 'bool',
                },
              ],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
              signature: '0x42966c68',
            },
            {
              constant: true,
              inputs: [],
              name: 'decimals',
              outputs: [
                {
                  internalType: 'uint8',
                  name: '',
                  type: 'uint8',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x313ce567',
            },
            {
              constant: false,
              inputs: [
                {
                  internalType: 'address',
                  name: 'spender',
                  type: 'address',
                },
                {
                  internalType: 'uint256',
                  name: 'subtractedValue',
                  type: 'uint256',
                },
              ],
              name: 'decreaseAllowance',
              outputs: [
                {
                  internalType: 'bool',
                  name: '',
                  type: 'bool',
                },
              ],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
              signature: '0xa457c2d7',
            },
            {
              constant: true,
              inputs: [],
              name: 'getOwner',
              outputs: [
                {
                  internalType: 'address',
                  name: '',
                  type: 'address',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x893d20e8',
            },
            {
              constant: false,
              inputs: [
                {
                  internalType: 'address',
                  name: 'spender',
                  type: 'address',
                },
                {
                  internalType: 'uint256',
                  name: 'addedValue',
                  type: 'uint256',
                },
              ],
              name: 'increaseAllowance',
              outputs: [
                {
                  internalType: 'bool',
                  name: '',
                  type: 'bool',
                },
              ],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
              signature: '0x39509351',
            },
            {
              constant: false,
              inputs: [
                {
                  internalType: 'uint256',
                  name: 'amount',
                  type: 'uint256',
                },
              ],
              name: 'mint',
              outputs: [
                {
                  internalType: 'bool',
                  name: '',
                  type: 'bool',
                },
              ],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
              signature: '0xa0712d68',
            },
            {
              constant: true,
              inputs: [],
              name: 'name',
              outputs: [
                {
                  internalType: 'string',
                  name: '',
                  type: 'string',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x06fdde03',
            },
            {
              constant: true,
              inputs: [],
              name: 'owner',
              outputs: [
                {
                  internalType: 'address',
                  name: '',
                  type: 'address',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x8da5cb5b',
            },
            {
              constant: false,
              inputs: [],
              name: 'renounceOwnership',
              outputs: [],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
              signature: '0x715018a6',
            },
            {
              constant: true,
              inputs: [],
              name: 'symbol',
              outputs: [
                {
                  internalType: 'string',
                  name: '',
                  type: 'string',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x95d89b41',
            },
            {
              constant: true,
              inputs: [],
              name: 'totalSupply',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x18160ddd',
            },
            {
              constant: false,
              inputs: [
                {
                  internalType: 'address',
                  name: 'recipient',
                  type: 'address',
                },
                {
                  internalType: 'uint256',
                  name: 'amount',
                  type: 'uint256',
                },
              ],
              name: 'transfer',
              outputs: [
                {
                  internalType: 'bool',
                  name: '',
                  type: 'bool',
                },
              ],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
              signature: '0xa9059cbb',
            },
            {
              constant: false,
              inputs: [
                {
                  internalType: 'address',
                  name: 'sender',
                  type: 'address',
                },
                {
                  internalType: 'address',
                  name: 'recipient',
                  type: 'address',
                },
                {
                  internalType: 'uint256',
                  name: 'amount',
                  type: 'uint256',
                },
              ],
              name: 'transferFrom',
              outputs: [
                {
                  internalType: 'bool',
                  name: '',
                  type: 'bool',
                },
              ],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
              signature: '0x23b872dd',
            },
            {
              constant: false,
              inputs: [
                {
                  internalType: 'address',
                  name: 'newOwner',
                  type: 'address',
                },
              ],
              name: 'transferOwnership',
              outputs: [],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
              signature: '0xf2fde38b',
            },
          ],
          calls: [
            {
              reference: 'balanceOf',
              methodName: 'balanceOf',
              methodParameters: ['0xa258a693A403b7e98fd05EE9e1558C760308cFC7'],
            },
          ],
        },
        callsReturnContext: [
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x00',
              },
            ],
            decoded: true,
            reference: 'balanceOf',
            methodName: 'balanceOf',
            methodParameters: ['0xa258a693A403b7e98fd05EE9e1558C760308cFC7'],
            success: true,
          },
        ],
      },
      '0xaB1a4d4f1D656d2450692D237fdD6C7f9146e814': {
        originalContractCallContext: {
          reference: '0xaB1a4d4f1D656d2450692D237fdD6C7f9146e814',
          contractAddress: '0xaB1a4d4f1D656d2450692D237fdD6C7f9146e814',
          abi: [
            {
              inputs: [],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'constructor',
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: 'address',
                  name: 'owner',
                  type: 'address',
                },
                {
                  indexed: true,
                  internalType: 'address',
                  name: 'spender',
                  type: 'address',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'value',
                  type: 'uint256',
                },
              ],
              name: 'Approval',
              type: 'event',
              signature: '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: 'address',
                  name: 'previousOwner',
                  type: 'address',
                },
                {
                  indexed: true,
                  internalType: 'address',
                  name: 'newOwner',
                  type: 'address',
                },
              ],
              name: 'OwnershipTransferred',
              type: 'event',
              signature: '0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0',
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: 'address',
                  name: 'from',
                  type: 'address',
                },
                {
                  indexed: true,
                  internalType: 'address',
                  name: 'to',
                  type: 'address',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'value',
                  type: 'uint256',
                },
              ],
              name: 'Transfer',
              type: 'event',
              signature: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
            },
            {
              constant: true,
              inputs: [],
              name: '_decimals',
              outputs: [
                {
                  internalType: 'uint8',
                  name: '',
                  type: 'uint8',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x32424aa3',
            },
            {
              constant: true,
              inputs: [],
              name: '_name',
              outputs: [
                {
                  internalType: 'string',
                  name: '',
                  type: 'string',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0xd28d8852',
            },
            {
              constant: true,
              inputs: [],
              name: '_symbol',
              outputs: [
                {
                  internalType: 'string',
                  name: '',
                  type: 'string',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0xb09f1266',
            },
            {
              constant: true,
              inputs: [
                {
                  internalType: 'address',
                  name: 'owner',
                  type: 'address',
                },
                {
                  internalType: 'address',
                  name: 'spender',
                  type: 'address',
                },
              ],
              name: 'allowance',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0xdd62ed3e',
            },
            {
              constant: false,
              inputs: [
                {
                  internalType: 'address',
                  name: 'spender',
                  type: 'address',
                },
                {
                  internalType: 'uint256',
                  name: 'amount',
                  type: 'uint256',
                },
              ],
              name: 'approve',
              outputs: [
                {
                  internalType: 'bool',
                  name: '',
                  type: 'bool',
                },
              ],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
              signature: '0x095ea7b3',
            },
            {
              constant: true,
              inputs: [
                {
                  internalType: 'address',
                  name: 'account',
                  type: 'address',
                },
              ],
              name: 'balanceOf',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x70a08231',
            },
            {
              constant: false,
              inputs: [
                {
                  internalType: 'uint256',
                  name: 'amount',
                  type: 'uint256',
                },
              ],
              name: 'burn',
              outputs: [
                {
                  internalType: 'bool',
                  name: '',
                  type: 'bool',
                },
              ],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
              signature: '0x42966c68',
            },
            {
              constant: true,
              inputs: [],
              name: 'decimals',
              outputs: [
                {
                  internalType: 'uint8',
                  name: '',
                  type: 'uint8',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x313ce567',
            },
            {
              constant: false,
              inputs: [
                {
                  internalType: 'address',
                  name: 'spender',
                  type: 'address',
                },
                {
                  internalType: 'uint256',
                  name: 'subtractedValue',
                  type: 'uint256',
                },
              ],
              name: 'decreaseAllowance',
              outputs: [
                {
                  internalType: 'bool',
                  name: '',
                  type: 'bool',
                },
              ],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
              signature: '0xa457c2d7',
            },
            {
              constant: true,
              inputs: [],
              name: 'getOwner',
              outputs: [
                {
                  internalType: 'address',
                  name: '',
                  type: 'address',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x893d20e8',
            },
            {
              constant: false,
              inputs: [
                {
                  internalType: 'address',
                  name: 'spender',
                  type: 'address',
                },
                {
                  internalType: 'uint256',
                  name: 'addedValue',
                  type: 'uint256',
                },
              ],
              name: 'increaseAllowance',
              outputs: [
                {
                  internalType: 'bool',
                  name: '',
                  type: 'bool',
                },
              ],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
              signature: '0x39509351',
            },
            {
              constant: false,
              inputs: [
                {
                  internalType: 'uint256',
                  name: 'amount',
                  type: 'uint256',
                },
              ],
              name: 'mint',
              outputs: [
                {
                  internalType: 'bool',
                  name: '',
                  type: 'bool',
                },
              ],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
              signature: '0xa0712d68',
            },
            {
              constant: true,
              inputs: [],
              name: 'name',
              outputs: [
                {
                  internalType: 'string',
                  name: '',
                  type: 'string',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x06fdde03',
            },
            {
              constant: true,
              inputs: [],
              name: 'owner',
              outputs: [
                {
                  internalType: 'address',
                  name: '',
                  type: 'address',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x8da5cb5b',
            },
            {
              constant: false,
              inputs: [],
              name: 'renounceOwnership',
              outputs: [],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
              signature: '0x715018a6',
            },
            {
              constant: true,
              inputs: [],
              name: 'symbol',
              outputs: [
                {
                  internalType: 'string',
                  name: '',
                  type: 'string',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x95d89b41',
            },
            {
              constant: true,
              inputs: [],
              name: 'totalSupply',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x18160ddd',
            },
            {
              constant: false,
              inputs: [
                {
                  internalType: 'address',
                  name: 'recipient',
                  type: 'address',
                },
                {
                  internalType: 'uint256',
                  name: 'amount',
                  type: 'uint256',
                },
              ],
              name: 'transfer',
              outputs: [
                {
                  internalType: 'bool',
                  name: '',
                  type: 'bool',
                },
              ],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
              signature: '0xa9059cbb',
            },
            {
              constant: false,
              inputs: [
                {
                  internalType: 'address',
                  name: 'sender',
                  type: 'address',
                },
                {
                  internalType: 'address',
                  name: 'recipient',
                  type: 'address',
                },
                {
                  internalType: 'uint256',
                  name: 'amount',
                  type: 'uint256',
                },
              ],
              name: 'transferFrom',
              outputs: [
                {
                  internalType: 'bool',
                  name: '',
                  type: 'bool',
                },
              ],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
              signature: '0x23b872dd',
            },
            {
              constant: false,
              inputs: [
                {
                  internalType: 'address',
                  name: 'newOwner',
                  type: 'address',
                },
              ],
              name: 'transferOwnership',
              outputs: [],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
              signature: '0xf2fde38b',
            },
          ],
          calls: [
            {
              reference: 'balanceOf',
              methodName: 'balanceOf',
              methodParameters: ['0xa258a693A403b7e98fd05EE9e1558C760308cFC7'],
            },
          ],
        },
        callsReturnContext: [
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x022a5ffbf4a937fb',
              },
            ],
            decoded: true,
            reference: 'balanceOf',
            methodName: 'balanceOf',
            methodParameters: ['0xa258a693A403b7e98fd05EE9e1558C760308cFC7'],
            success: true,
          },
        ],
      },
      '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd': {
        originalContractCallContext: {
          reference: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
          contractAddress: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
          abi: [
            {
              inputs: [],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'constructor',
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: 'address',
                  name: 'owner',
                  type: 'address',
                },
                {
                  indexed: true,
                  internalType: 'address',
                  name: 'spender',
                  type: 'address',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'value',
                  type: 'uint256',
                },
              ],
              name: 'Approval',
              type: 'event',
              signature: '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: 'address',
                  name: 'previousOwner',
                  type: 'address',
                },
                {
                  indexed: true,
                  internalType: 'address',
                  name: 'newOwner',
                  type: 'address',
                },
              ],
              name: 'OwnershipTransferred',
              type: 'event',
              signature: '0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0',
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: 'address',
                  name: 'from',
                  type: 'address',
                },
                {
                  indexed: true,
                  internalType: 'address',
                  name: 'to',
                  type: 'address',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'value',
                  type: 'uint256',
                },
              ],
              name: 'Transfer',
              type: 'event',
              signature: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
            },
            {
              constant: true,
              inputs: [],
              name: '_decimals',
              outputs: [
                {
                  internalType: 'uint8',
                  name: '',
                  type: 'uint8',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x32424aa3',
            },
            {
              constant: true,
              inputs: [],
              name: '_name',
              outputs: [
                {
                  internalType: 'string',
                  name: '',
                  type: 'string',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0xd28d8852',
            },
            {
              constant: true,
              inputs: [],
              name: '_symbol',
              outputs: [
                {
                  internalType: 'string',
                  name: '',
                  type: 'string',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0xb09f1266',
            },
            {
              constant: true,
              inputs: [
                {
                  internalType: 'address',
                  name: 'owner',
                  type: 'address',
                },
                {
                  internalType: 'address',
                  name: 'spender',
                  type: 'address',
                },
              ],
              name: 'allowance',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0xdd62ed3e',
            },
            {
              constant: false,
              inputs: [
                {
                  internalType: 'address',
                  name: 'spender',
                  type: 'address',
                },
                {
                  internalType: 'uint256',
                  name: 'amount',
                  type: 'uint256',
                },
              ],
              name: 'approve',
              outputs: [
                {
                  internalType: 'bool',
                  name: '',
                  type: 'bool',
                },
              ],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
              signature: '0x095ea7b3',
            },
            {
              constant: true,
              inputs: [
                {
                  internalType: 'address',
                  name: 'account',
                  type: 'address',
                },
              ],
              name: 'balanceOf',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x70a08231',
            },
            {
              constant: false,
              inputs: [
                {
                  internalType: 'uint256',
                  name: 'amount',
                  type: 'uint256',
                },
              ],
              name: 'burn',
              outputs: [
                {
                  internalType: 'bool',
                  name: '',
                  type: 'bool',
                },
              ],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
              signature: '0x42966c68',
            },
            {
              constant: true,
              inputs: [],
              name: 'decimals',
              outputs: [
                {
                  internalType: 'uint8',
                  name: '',
                  type: 'uint8',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x313ce567',
            },
            {
              constant: false,
              inputs: [
                {
                  internalType: 'address',
                  name: 'spender',
                  type: 'address',
                },
                {
                  internalType: 'uint256',
                  name: 'subtractedValue',
                  type: 'uint256',
                },
              ],
              name: 'decreaseAllowance',
              outputs: [
                {
                  internalType: 'bool',
                  name: '',
                  type: 'bool',
                },
              ],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
              signature: '0xa457c2d7',
            },
            {
              constant: true,
              inputs: [],
              name: 'getOwner',
              outputs: [
                {
                  internalType: 'address',
                  name: '',
                  type: 'address',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x893d20e8',
            },
            {
              constant: false,
              inputs: [
                {
                  internalType: 'address',
                  name: 'spender',
                  type: 'address',
                },
                {
                  internalType: 'uint256',
                  name: 'addedValue',
                  type: 'uint256',
                },
              ],
              name: 'increaseAllowance',
              outputs: [
                {
                  internalType: 'bool',
                  name: '',
                  type: 'bool',
                },
              ],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
              signature: '0x39509351',
            },
            {
              constant: false,
              inputs: [
                {
                  internalType: 'uint256',
                  name: 'amount',
                  type: 'uint256',
                },
              ],
              name: 'mint',
              outputs: [
                {
                  internalType: 'bool',
                  name: '',
                  type: 'bool',
                },
              ],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
              signature: '0xa0712d68',
            },
            {
              constant: true,
              inputs: [],
              name: 'name',
              outputs: [
                {
                  internalType: 'string',
                  name: '',
                  type: 'string',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x06fdde03',
            },
            {
              constant: true,
              inputs: [],
              name: 'owner',
              outputs: [
                {
                  internalType: 'address',
                  name: '',
                  type: 'address',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x8da5cb5b',
            },
            {
              constant: false,
              inputs: [],
              name: 'renounceOwnership',
              outputs: [],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
              signature: '0x715018a6',
            },
            {
              constant: true,
              inputs: [],
              name: 'symbol',
              outputs: [
                {
                  internalType: 'string',
                  name: '',
                  type: 'string',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x95d89b41',
            },
            {
              constant: true,
              inputs: [],
              name: 'totalSupply',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x18160ddd',
            },
            {
              constant: false,
              inputs: [
                {
                  internalType: 'address',
                  name: 'recipient',
                  type: 'address',
                },
                {
                  internalType: 'uint256',
                  name: 'amount',
                  type: 'uint256',
                },
              ],
              name: 'transfer',
              outputs: [
                {
                  internalType: 'bool',
                  name: '',
                  type: 'bool',
                },
              ],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
              signature: '0xa9059cbb',
            },
            {
              constant: false,
              inputs: [
                {
                  internalType: 'address',
                  name: 'sender',
                  type: 'address',
                },
                {
                  internalType: 'address',
                  name: 'recipient',
                  type: 'address',
                },
                {
                  internalType: 'uint256',
                  name: 'amount',
                  type: 'uint256',
                },
              ],
              name: 'transferFrom',
              outputs: [
                {
                  internalType: 'bool',
                  name: '',
                  type: 'bool',
                },
              ],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
              signature: '0x23b872dd',
            },
            {
              constant: false,
              inputs: [
                {
                  internalType: 'address',
                  name: 'newOwner',
                  type: 'address',
                },
              ],
              name: 'transferOwnership',
              outputs: [],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
              signature: '0xf2fde38b',
            },
          ],
          calls: [
            {
              reference: 'balanceOf',
              methodName: 'balanceOf',
              methodParameters: ['0xa258a693A403b7e98fd05EE9e1558C760308cFC7'],
            },
          ],
        },
        callsReturnContext: [
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x00',
              },
            ],
            decoded: true,
            reference: 'balanceOf',
            methodName: 'balanceOf',
            methodParameters: ['0xa258a693A403b7e98fd05EE9e1558C760308cFC7'],
            success: true,
          },
        ],
      },
    },
    blockNumber: 25252574,
  },
};
const vaiController: {
  [key: string]: ContractCallResults;
} = {
  getVaiRepayInterests: {
    results: {
      getVaiRepayInterests: {
        originalContractCallContext: {
          reference: 'getVaiInterests',
          contractAddress: '0xf70C3C6b749BbAb89C081737334E74C9aFD4BE16',
          abi: [
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'error',
                  type: 'uint256',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'info',
                  type: 'uint256',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'detail',
                  type: 'uint256',
                },
              ],
              name: 'Failure',
              type: 'event',
              signature: '0x45b96fe442630264581b197e84bbada861235052c5a1aadfff9ea4e40a969aa0',
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: 'address',
                  name: 'liquidator',
                  type: 'address',
                },
                {
                  indexed: false,
                  internalType: 'address',
                  name: 'borrower',
                  type: 'address',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'repayAmount',
                  type: 'uint256',
                },
                {
                  indexed: false,
                  internalType: 'address',
                  name: 'vTokenCollateral',
                  type: 'address',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'seizeTokens',
                  type: 'uint256',
                },
              ],
              name: 'LiquidateVAI',
              type: 'event',
              signature: '0x42d401f96718a0c42e5cea8108973f0022677b7e2e5f4ee19851b2de7a0394e7',
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: 'address',
                  name: 'minter',
                  type: 'address',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'feeAmount',
                  type: 'uint256',
                },
              ],
              name: 'MintFee',
              type: 'event',
              signature: '0xb0715a6d41a37c1b0672c22c09a31a0642c1fb3f9efa2d5fd5c6d2d891ee78c6',
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: 'address',
                  name: 'minter',
                  type: 'address',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'mintVAIAmount',
                  type: 'uint256',
                },
              ],
              name: 'MintVAI',
              type: 'event',
              signature: '0x002e68ab1600fc5e7290e2ceaa79e2f86b4dbaca84a48421e167e0b40409218a',
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: 'address',
                  name: 'oldAccessControlAddress',
                  type: 'address',
                },
                {
                  indexed: false,
                  internalType: 'address',
                  name: 'newAccessControlAddress',
                  type: 'address',
                },
              ],
              name: 'NewAccessControl',
              type: 'event',
              signature: '0x0f1eca7612e020f6e4582bcead0573eba4b5f7b56668754c6aed82ef12057dd4',
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: 'contract ComptrollerInterface',
                  name: 'oldComptroller',
                  type: 'address',
                },
                {
                  indexed: false,
                  internalType: 'contract ComptrollerInterface',
                  name: 'newComptroller',
                  type: 'address',
                },
              ],
              name: 'NewComptroller',
              type: 'event',
              signature: '0x7ac369dbd14fa5ea3f473ed67cc9d598964a77501540ba6751eb0b3decf5870d',
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: 'address',
                  name: 'oldTreasuryAddress',
                  type: 'address',
                },
                {
                  indexed: false,
                  internalType: 'address',
                  name: 'newTreasuryAddress',
                  type: 'address',
                },
              ],
              name: 'NewTreasuryAddress',
              type: 'event',
              signature: '0x8de763046d7b8f08b6c3d03543de1d615309417842bb5d2d62f110f65809ddac',
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: 'address',
                  name: 'oldTreasuryGuardian',
                  type: 'address',
                },
                {
                  indexed: false,
                  internalType: 'address',
                  name: 'newTreasuryGuardian',
                  type: 'address',
                },
              ],
              name: 'NewTreasuryGuardian',
              type: 'event',
              signature: '0x29f06ea15931797ebaed313d81d100963dc22cb213cb4ce2737b5a62b1a8b1e8',
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'oldTreasuryPercent',
                  type: 'uint256',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'newTreasuryPercent',
                  type: 'uint256',
                },
              ],
              name: 'NewTreasuryPercent',
              type: 'event',
              signature: '0x0893f8f4101baaabbeb513f96761e7a36eb837403c82cc651c292a4abdc94ed7',
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'oldBaseRateMantissa',
                  type: 'uint256',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'newBaseRateMantissa',
                  type: 'uint256',
                },
              ],
              name: 'NewVAIBaseRate',
              type: 'event',
              signature: '0xc84c32795e68685ec107b0e94ae126ef464095f342c7e2e0fec06a23d2e8677e',
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'oldFloatRateMantissa',
                  type: 'uint256',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'newFlatRateMantissa',
                  type: 'uint256',
                },
              ],
              name: 'NewVAIFloatRate',
              type: 'event',
              signature: '0x546fb35dbbd92233aecc22b5a11a6791e5db7ec14f62e49cbac2a10c0437f561',
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'oldMintCap',
                  type: 'uint256',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'newMintCap',
                  type: 'uint256',
                },
              ],
              name: 'NewVAIMintCap',
              type: 'event',
              signature: '0x43862b3eea2df8fce70329f3f84cbcad220f47a73be46c5e00df25165a6e1695',
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: 'address',
                  name: 'oldReceiver',
                  type: 'address',
                },
                {
                  indexed: false,
                  internalType: 'address',
                  name: 'newReceiver',
                  type: 'address',
                },
              ],
              name: 'NewVAIReceiver',
              type: 'event',
              signature: '0x4df62dd7d9cc4f480a167c19c616ae5d5bb40db6d0c2bc66dba57068225f00d8',
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: 'address',
                  name: 'payer',
                  type: 'address',
                },
                {
                  indexed: false,
                  internalType: 'address',
                  name: 'borrower',
                  type: 'address',
                },
                {
                  indexed: false,
                  internalType: 'uint256',
                  name: 'repayVAIAmount',
                  type: 'uint256',
                },
              ],
              name: 'RepayVAI',
              type: 'event',
              signature: '0x1db858e6f7e1a0d5e92c10c6507d42b3dabfe0a4867fe90c5a14d9963662ef7e',
            },
            {
              constant: true,
              inputs: [],
              name: 'INITIAL_VAI_MINT_INDEX',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x65097954',
            },
            {
              constant: false,
              inputs: [
                {
                  internalType: 'contract VAIUnitroller',
                  name: 'unitroller',
                  type: 'address',
                },
              ],
              name: '_become',
              outputs: [],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
              signature: '0x1d504dc6',
            },
            {
              constant: false,
              inputs: [
                {
                  internalType: 'contract ComptrollerInterface',
                  name: 'comptroller_',
                  type: 'address',
                },
              ],
              name: '_setComptroller',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
              signature: '0x4576b5db',
            },
            {
              constant: false,
              inputs: [
                {
                  internalType: 'address',
                  name: 'newTreasuryGuardian',
                  type: 'address',
                },
                {
                  internalType: 'address',
                  name: 'newTreasuryAddress',
                  type: 'address',
                },
                {
                  internalType: 'uint256',
                  name: 'newTreasuryPercent',
                  type: 'uint256',
                },
              ],
              name: '_setTreasuryData',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
              signature: '0xd24febad',
            },
            {
              constant: true,
              inputs: [],
              name: 'accessControl',
              outputs: [
                {
                  internalType: 'address',
                  name: '',
                  type: 'address',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x13007d55',
            },
            {
              constant: false,
              inputs: [],
              name: 'accrueVAIInterest',
              outputs: [],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
              signature: '0xb49b1005',
            },
            {
              constant: true,
              inputs: [],
              name: 'admin',
              outputs: [
                {
                  internalType: 'address',
                  name: '',
                  type: 'address',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0xf851a440',
            },
            {
              constant: true,
              inputs: [],
              name: 'baseRateMantissa',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x3b72fbef',
            },
            {
              constant: true,
              inputs: [],
              name: 'comptroller',
              outputs: [
                {
                  internalType: 'contract ComptrollerInterface',
                  name: '',
                  type: 'address',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x5fe3b567',
            },
            {
              constant: true,
              inputs: [],
              name: 'floatRateMantissa',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x5ce73240',
            },
            {
              constant: true,
              inputs: [],
              name: 'getBlockNumber',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x42cbb15c',
            },
            {
              constant: true,
              inputs: [],
              name: 'getBlocksPerYear',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x741de148',
            },
            {
              constant: true,
              inputs: [
                {
                  internalType: 'address',
                  name: 'minter',
                  type: 'address',
                },
              ],
              name: 'getMintableVAI',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x3785d1d6',
            },
            {
              constant: true,
              inputs: [],
              name: 'getVAIAddress',
              outputs: [
                {
                  internalType: 'address',
                  name: '',
                  type: 'address',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0xcbeb2b28',
            },
            {
              constant: true,
              inputs: [
                {
                  internalType: 'address',
                  name: 'borrower',
                  type: 'address',
                },
                {
                  internalType: 'uint256',
                  name: 'repayAmount',
                  type: 'uint256',
                },
              ],
              name: 'getVAICalculateRepayAmount',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x691e45ac',
            },
            {
              constant: true,
              inputs: [
                {
                  internalType: 'address',
                  name: 'minter',
                  type: 'address',
                },
              ],
              name: 'getVAIMinterInterestIndex',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x234f8977',
            },
            {
              constant: true,
              inputs: [
                {
                  internalType: 'address',
                  name: 'account',
                  type: 'address',
                },
              ],
              name: 'getVAIRepayAmount',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x78c2f922',
            },
            {
              constant: true,
              inputs: [],
              name: 'getVAIRepayRate',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0xb9ee8726',
            },
            {
              constant: true,
              inputs: [],
              name: 'getVAIRepayRatePerBlock',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x75c3de43',
            },
            {
              constant: false,
              inputs: [],
              name: 'initialize',
              outputs: [],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
              signature: '0x8129fc1c',
            },
            {
              constant: true,
              inputs: [],
              name: 'isVenusVAIInitialized',
              outputs: [
                {
                  internalType: 'bool',
                  name: '',
                  type: 'bool',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x60c954ef',
            },
            {
              constant: false,
              inputs: [
                {
                  internalType: 'address',
                  name: 'borrower',
                  type: 'address',
                },
                {
                  internalType: 'uint256',
                  name: 'repayAmount',
                  type: 'uint256',
                },
                {
                  internalType: 'contract VTokenInterface',
                  name: 'vTokenCollateral',
                  type: 'address',
                },
              ],
              name: 'liquidateVAI',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
              signature: '0x11b3d5e7',
            },
            {
              constant: true,
              inputs: [],
              name: 'mintCap',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x76c71ca1',
            },
            {
              constant: false,
              inputs: [
                {
                  internalType: 'uint256',
                  name: 'mintVAIAmount',
                  type: 'uint256',
                },
              ],
              name: 'mintVAI',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
              signature: '0x4712ee7d',
            },
            {
              constant: true,
              inputs: [
                {
                  internalType: 'address',
                  name: '',
                  type: 'address',
                },
              ],
              name: 'pastVAIInterest',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0xf20fd8f4',
            },
            {
              constant: true,
              inputs: [],
              name: 'pendingAdmin',
              outputs: [
                {
                  internalType: 'address',
                  name: '',
                  type: 'address',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x26782247',
            },
            {
              constant: true,
              inputs: [],
              name: 'pendingVAIControllerImplementation',
              outputs: [
                {
                  internalType: 'address',
                  name: '',
                  type: 'address',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0xb06bb426',
            },
            {
              constant: true,
              inputs: [],
              name: 'receiver',
              outputs: [
                {
                  internalType: 'address',
                  name: '',
                  type: 'address',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0xf7260d3e',
            },
            {
              constant: false,
              inputs: [
                {
                  internalType: 'uint256',
                  name: 'repayVAIAmount',
                  type: 'uint256',
                },
              ],
              name: 'repayVAI',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
              signature: '0x6fe74a21',
            },
            {
              constant: false,
              inputs: [
                {
                  internalType: 'address',
                  name: 'newAccessControlAddress',
                  type: 'address',
                },
              ],
              name: 'setAccessControl',
              outputs: [],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
              signature: '0x19129e5a',
            },
            {
              constant: false,
              inputs: [
                {
                  internalType: 'uint256',
                  name: 'newBaseRateMantissa',
                  type: 'uint256',
                },
              ],
              name: 'setBaseRate',
              outputs: [],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
              signature: '0x1d08837b',
            },
            {
              constant: false,
              inputs: [
                {
                  internalType: 'uint256',
                  name: 'newFloatRateMantissa',
                  type: 'uint256',
                },
              ],
              name: 'setFloatRate',
              outputs: [],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
              signature: '0x3b5a0a64',
            },
            {
              constant: false,
              inputs: [
                {
                  internalType: 'uint256',
                  name: '_mintCap',
                  type: 'uint256',
                },
              ],
              name: 'setMintCap',
              outputs: [],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
              signature: '0x4070a0c9',
            },
            {
              constant: false,
              inputs: [
                {
                  internalType: 'address',
                  name: 'newReceiver',
                  type: 'address',
                },
              ],
              name: 'setReceiver',
              outputs: [],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
              signature: '0x718da7ee',
            },
            {
              constant: true,
              inputs: [],
              name: 'treasuryAddress',
              outputs: [
                {
                  internalType: 'address',
                  name: '',
                  type: 'address',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0xc5f956af',
            },
            {
              constant: true,
              inputs: [],
              name: 'treasuryGuardian',
              outputs: [
                {
                  internalType: 'address',
                  name: '',
                  type: 'address',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0xb2eafc39',
            },
            {
              constant: true,
              inputs: [],
              name: 'treasuryPercent',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x04ef9d58',
            },
            {
              constant: true,
              inputs: [],
              name: 'vaiControllerImplementation',
              outputs: [
                {
                  internalType: 'address',
                  name: '',
                  type: 'address',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x003b5884',
            },
            {
              constant: true,
              inputs: [],
              name: 'vaiMintIndex',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0xb2b481bc',
            },
            {
              constant: true,
              inputs: [
                {
                  internalType: 'address',
                  name: '',
                  type: 'address',
                },
              ],
              name: 'venusVAIMinterIndex',
              outputs: [
                {
                  internalType: 'uint256',
                  name: '',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0x24650602',
            },
            {
              constant: true,
              inputs: [],
              name: 'venusVAIState',
              outputs: [
                {
                  internalType: 'uint224',
                  name: 'index',
                  type: 'uint224',
                },
                {
                  internalType: 'uint32',
                  name: 'block',
                  type: 'uint32',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
              signature: '0xe44e6168',
            },
          ],
          calls: [
            {
              reference: 'accrueVAIInterest',
              methodName: 'accrueVAIInterest',
              methodParameters: [],
            },
            {
              reference: 'getVAICalculateRepayAmount',
              methodName: 'getVAICalculateRepayAmount',
              methodParameters: [
                '0x2Ce1d0ffD7E869D9DF33e28552b12DdDed326706',
                '100000000000000000000',
              ],
            },
          ],
        },
        callsReturnContext: [
          {
            returnValues: '0x',
            decoded: false,
            reference: 'accrueVAIInterest',
            methodName: 'accrueVAIInterest',
            methodParameters: [],
            success: true,
          },
          {
            returnValues: [
              {
                type: 'BigNumber',
                hex: '0x056bc63d8c71be92ab',
              },
              {
                type: 'BigNumber',
                hex: '0x0120a0f13d2d68',
              },
              {
                type: 'BigNumber',
                hex: '0x00',
              },
            ],
            decoded: true,
            reference: 'getVAICalculateRepayAmount',
            methodName: 'getVAICalculateRepayAmount',
            methodParameters: [
              '0x2Ce1d0ffD7E869D9DF33e28552b12DdDed326706',
              '100000000000000000000',
            ],
            success: true,
          },
        ],
      },
    },
    blockNumber: 26714340,
  } as ContractCallResults,
};

export default { pancakeSwapRouter, interestRateModel, bep20, vaiController };
