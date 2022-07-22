import BigNumber from 'bignumber.js';

export interface GetVaiTreasuryPercentageInput {
  vaiControllerContract: $TSFixMe; // @TODO: use contract type (through Typechain?)
}

export type GetVaiTreasuryPercentageOutput = number;

const getVaiTreasuryPercentage = async ({
  vaiControllerContract,
}: GetVaiTreasuryPercentageInput): Promise<GetVaiTreasuryPercentageOutput> => {
  const treasuryPercentage = await vaiControllerContract.methods.treasuryPercent().call();
  const formattedTreasuryPercentage = new BigNumber(treasuryPercentage)
    .times(100)
    .div(1e18)
    .toNumber();

  return formattedTreasuryPercentage;
};

export default getVaiTreasuryPercentage;
