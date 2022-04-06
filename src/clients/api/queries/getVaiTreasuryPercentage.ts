import BigNumber from 'bignumber.js';
import { Contract } from 'web3-eth-contract';

export interface IGetVaiTreasuryPercentageInput {
  vaiControllerContract: Contract; // @TODO: use contract type (through Typechain?)
}

export type IGetVaiTreasuryPercentageOutput = number;

const getVaiTreasuryPercentage = async ({
  vaiControllerContract,
}: IGetVaiTreasuryPercentageInput) => {
  const treasuryPercentage = await vaiControllerContract.methods.treasuryPercent().call();
  const formattedTreasuryPercentage = new BigNumber(treasuryPercentage)
    .times(100)
    .div(1e18)
    .toNumber();

  return formattedTreasuryPercentage;
};

export default getVaiTreasuryPercentage;
