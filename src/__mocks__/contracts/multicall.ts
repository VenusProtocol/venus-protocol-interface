const pancakeSwapRouter = {
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

const interestRateModel = {
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

export default { pancakeSwapRouter, interestRateModel };
