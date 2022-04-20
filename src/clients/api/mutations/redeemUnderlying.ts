export interface IRedeemUnderlyingInput {
  tokenContract: $TSFixMe; // @TODO: use contract type once defined (Typechain?)
  account: string | undefined;
  amount: string;
}

export type RedeemUnderlyingOutput = void;

const redeemUnderlying = async ({
  tokenContract,
  account,
  amount,
}: IRedeemUnderlyingInput): Promise<RedeemUnderlyingOutput> =>
  tokenContract.methods.redeemUnderlying(amount).send({ from: account! });

export default redeemUnderlying;
