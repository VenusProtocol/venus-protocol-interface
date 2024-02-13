import { BigNumber as BN } from 'ethers';
import { LegacyPoolComptroller } from 'libs/contracts';

const comptrollerResponses: {
  venusVAIVaultRate: Awaited<ReturnType<LegacyPoolComptroller['venusVAIVaultRate']>>;
  getHypotheticalAccountLiquidity: Awaited<
    ReturnType<LegacyPoolComptroller['getHypotheticalAccountLiquidity']>
  >;
  mintedVAIs: Awaited<ReturnType<LegacyPoolComptroller['mintedVAIs']>>;
  getAllMarkets: Awaited<ReturnType<LegacyPoolComptroller['getAllMarkets']>>;
} = {
  venusVAIVaultRate: BN.from('5000000000'),
  getHypotheticalAccountLiquidity: [
    BN.from('100000000'),
    BN.from('200000000'),
    BN.from('300000000'),
  ],
  mintedVAIs: BN.from('60000000000000000'),
  getAllMarkets: [
    '0xD5C4C2e2facBEB59D0216D0595d63FcDc6F9A1a7',
    '0xb7526572FFE56AB9D7489838Bf2E18e3323b441A',
    '0x08e0A5575De71037aE36AbfAfb516595fE68e5e4',
    '0x74469281310195A04840Daf6EdF576F559a3dE80',
    '0x2E7222e51c0f6e98610A1543Aa3836E092CDe62c',
    '0x6d6F697e34145Bb95c54E77482d97cc261Dc237E',
    '0x162D005F0Fff510E54958Cfc5CF32A3180A84aab',
    '0xAfc13BC065ABeE838540823431055D2ea52eBA52',
    '0x488aB2826a154da01CC4CC16A8C83d4720D3cA2C',
    '0xb6e9322C49FD75a367Fcb17B0Fcd62C5070EbCBe',
    '0x37C28DE42bA3d22217995D146FC684B2326Ede64',
    '0xF912d3001CAf6DC4ADD366A62Cc9115B4303c9A9',
    '0xeDaC03D29ff74b5fDc0CC936F6288312e1459BC6',
    '0x3619bdDc61189F33365CC572DF3a68FB3b316516',
    '0x714db6c38A17883964B68a07d56cE331501d9eb6',
    '0x3A00d9B02781f47d033BAd62edc55fBF8D083Fb0',
    '0x369Fea97f6fB7510755DCA389088d9E2e2819278',
    '0xF206af85BC2761c4F876d27Bd474681CfB335EfA',
    '0x9C3015191d39cF1930F92EB7e7BCbd020bCA286a',
    '0x6AF3Fdb3282c5bb6926269Db10837fa8Aec67C04',
    '0x35566ED3AF9E537Be487C98b1811cDf95ad0C32b',
    '0xEFAACF73CE2D38ED40991f29E72B12C74bd4cf23',
  ],
};

export default comptrollerResponses;
