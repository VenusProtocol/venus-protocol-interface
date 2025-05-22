const abi = [
  {
    constant: false,
    inputs: [
      { internalType: 'string', name: 'fakeArg1', type: 'string' },
      { internalType: 'string', name: 'fakeArg2', type: 'string' },
    ],
    name: 'fakeFunction',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'payable',
    type: 'function',
  },
] as const;

export const txData = {
  abi,
  address: '0xmockAddress',
  functionName: 'fakeFunction',
  args: ['arg1', 'arg2'],
} as const;
