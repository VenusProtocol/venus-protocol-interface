import type { DisabledTokenAction } from '../../types';

export const disabledTokenActions: DisabledTokenAction[] = [
  {
    // BUSD
    address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    disabledActions: ['borrow', 'supply'],
  },
  {
    // UST
    address: '0x3d4350cD54aeF9f9b2C29435e0fa809957B3F30a',
    disabledActions: ['borrow', 'supply'],
  },
  {
    // LUNA
    address: '0x156ab3346823B651294766e23e6Cf87254d68962',
    disabledActions: ['borrow', 'supply'],
  },
  {
    // SXP
    address: '0x47BEAd2563dCBf3bF2c9407fEa4dC236fAbA485A',
    disabledActions: ['borrow', 'supply'],
  },
  {
    // TRXOLD
    address: '0x85EAC5Ac2F758618dFa09bDbe0cf174e7d574D5B',
    disabledActions: ['borrow', 'supply'],
  },
  {
    // TUSDOLD
    address: '0x14016e85a25aeb13065688cafb43044c2ef86784',
    disabledActions: ['borrow', 'supply'],
  },
  {
    // BETH
    address: '0x250632378E573c6Be1AC2f97Fcdf00515d0Aa91B',
    disabledActions: ['borrow'],
  },
  {
    // stkBNB
    address: '0xc2E9d07F66A89c44062459A47a0D2Dc038E4fb16',
    disabledActions: ['borrow', 'supply'],
  },
  {
    // SnBNB
    address: '0xB0b84D294e0C75A6abe60171b70edEb2EFd14A1B',
    disabledActions: ['borrow', 'supply'],
  },
  {
    // agEUR
    address: '0x12f31b73d812c6bb0d735a218c086d44d5fe5f89',
    disabledActions: ['borrow', 'supply'],
  },
  // BNB
  {
    address: '0x0000000000000000000000000000000000000000',
    disabledActions: ['swapAndSupply'],
  },
  // vAAVE - Core pool
  {
    address: '0x26DA28954763B92139ED49283625ceCAf52C6f94',
    disabledActions: ['swapAndSupply'],
  },
  // vADA - Core pool
  {
    address: '0x9A0AF7FDb2065Ce470D72664DE73cAE409dA28Ec',
    disabledActions: ['swapAndSupply'],
  },
  // vBCH - Core pool
  {
    address: '0x5F0388EBc2B94FA8E123F404b79cCF5f40b29176',
    disabledActions: ['swapAndSupply'],
  },
  // vBETH - Core pool
  {
    address: '0x972207A639CC1B374B893cc33Fa251b55CEB7c07',
    disabledActions: ['swapAndSupply'],
  },
  // vCAKE - Core pool
  {
    address: '0x86aC3974e2BD0d60825230fa6F355fF11409df5c',
    disabledActions: ['swapAndSupply'],
  },
  // vCAN - Core pool
  {
    address: '0xeBD0070237a0713E8D94fEf1B728d3d993d290ef',
    disabledActions: ['swapAndSupply'],
  },
  // vDAI - Core pool
  {
    address: '0x334b3eCB4DCa3593BCCC3c7EBD1A1C1d1780FBF1',
    disabledActions: ['swapAndSupply'],
  },
  // vDOGE - Core pool
  {
    address: '0xec3422Ef92B2fb59e84c8B02Ba73F1fE84Ed8D71',
    disabledActions: ['swapAndSupply'],
  },
  // vDOT - Core pool
  {
    address: '0x1610bc33319e9398de5f57B33a5b184c806aD217',
    disabledActions: ['swapAndSupply'],
  },
  // vFIL - Core pool
  {
    address: '0xf91d58b5aE142DAcC749f58A49FCBac340Cb0343',
    disabledActions: ['swapAndSupply'],
  },
  // vLINK - Core pool
  {
    address: '0x650b940a1033B8A1b1873f78730FcFC73ec11f1f',
    disabledActions: ['swapAndSupply'],
  },
  // vLTC - Core pool
  {
    address: '0x57A5297F2cB2c0AaC9D554660acd6D385Ab50c6B',
    disabledActions: ['swapAndSupply'],
  },
  // vLUNA - Core pool
  {
    address: '0xb91A659E88B51474767CD97EF3196A3e7cEDD2c8',
    disabledActions: ['swapAndSupply'],
  },
  // vMATIC - Core pool
  {
    address: '0x5c9476FcD6a4F9a3654139721c949c2233bBbBc8',
    disabledActions: ['swapAndSupply'],
  },
  // vSXP - Core pool
  {
    address: '0x2fF3d0F6990a40261c66E1ff2017aCBc282EB6d0',
    disabledActions: ['swapAndSupply'],
  },
  // vTRX - Core pool
  {
    address: '0xC5D3466aA484B040eE977073fcF337f2c00071c1',
    disabledActions: ['swapAndSupply'],
  },
  // vTRXOLD - Core pool
  {
    address: '0x61eDcFe8Dd6bA3c891CB9bEc2dc7657B3B422E93',
    disabledActions: ['swapAndSupply'],
  },
  // vTUSD - Core pool
  {
    address: '0xBf762cd5991cA1DCdDaC9ae5C638F5B5Dc3Bee6E',
    disabledActions: ['swapAndSupply'],
  },
  // vTUSDOLD - Core pool
  {
    address: '0x08CEB3F4a7ed3500cA0982bcd0FC7816688084c3',
    disabledActions: ['swapAndSupply'],
  },
  // vUST - Core pool
  {
    address: '0x78366446547D062f45b4C0f320cDaa6d710D87bb',
    disabledActions: ['swapAndSupply'],
  },
  // vWBETH - Core pool
  {
    address: '0x6CFdEc747f37DAf3b87a35a1D9c8AD3063A1A8A0',
    disabledActions: ['swapAndSupply'],
  },
  // vXRP - Core pool
  {
    address: '0xB248a295732e0225acd3337607cc01068e3b9c10',
    disabledActions: ['swapAndSupply'],
  },
];
