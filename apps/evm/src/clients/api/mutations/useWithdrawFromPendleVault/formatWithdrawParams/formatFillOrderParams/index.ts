import type { PendleContractWithdrawCallParams } from 'clients/api';

export const formatFillOrderParams = (fills: PendleContractWithdrawCallParams[4]['normalFills']) =>
  fills.map(({ order, signature, makingAmount }) => ({
    order: {
      ...order,
      salt: BigInt(order.salt),
      expiry: BigInt(order.expiry),
      nonce: BigInt(order.nonce),
      orderType: Number(order.orderType),
      makingAmount: BigInt(order.makingAmount),
      lnImpliedRate: BigInt(order.lnImpliedRate),
      failSafeRate: BigInt(order.failSafeRate),
    },
    signature,
    makingAmount: BigInt(makingAmount),
  }));
