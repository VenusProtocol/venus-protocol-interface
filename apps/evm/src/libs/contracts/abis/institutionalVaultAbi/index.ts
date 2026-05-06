export const institutionalVaultAbi = [
  {
    type: 'function',
    stateMutability: 'view',
    name: 'balanceOf',
    inputs: [{ name: 'account', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    name: 'deposit',
    inputs: [
      { name: 'assets', type: 'uint256', internalType: 'uint256' },
      { name: 'receiver', type: 'address', internalType: 'address' },
    ],
    outputs: [{ name: 'shares', type: 'uint256', internalType: 'uint256' }],
  },
  {
    type: 'function',
    stateMutability: 'view',
    name: 'maxRedeem',
    inputs: [{ name: 'owner', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
  },
  {
    type: 'function',
    stateMutability: 'view',
    name: 'maxWithdraw',
    inputs: [{ name: 'owner', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    name: 'redeem',
    inputs: [
      { name: 'shares', type: 'uint256', internalType: 'uint256' },
      { name: 'receiver', type: 'address', internalType: 'address' },
      { name: 'owner', type: 'address', internalType: 'address' },
    ],
    outputs: [{ name: 'assets', type: 'uint256', internalType: 'uint256' }],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    name: 'withdraw',
    inputs: [
      { name: 'assets', type: 'uint256', internalType: 'uint256' },
      { name: 'receiver', type: 'address', internalType: 'address' },
      { name: 'owner', type: 'address', internalType: 'address' },
    ],
    outputs: [{ name: 'shares', type: 'uint256', internalType: 'uint256' }],
  },
] as const;
