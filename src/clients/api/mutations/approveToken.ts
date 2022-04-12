import BigNumber from 'bignumber.js';

export interface IApproveTokenInput {
  tokenContract: $TSFixMe; // @TODO: use contract type (through Typechain?)
  account: string | undefined;
  vtokenAddress: string;
  allowance?: string;
}

export type ApproveTokenOutput = void;

const approveToken = ({
  tokenContract,
  account,
  vtokenAddress,
  allowance = new BigNumber(2).pow(256).minus(1).toString(10),
}: IApproveTokenInput): Promise<ApproveTokenOutput> =>
  tokenContract.methods.approve(vtokenAddress, allowance).send({ from: account });

export default approveToken;
